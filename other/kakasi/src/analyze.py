import os
import datetime
import re
import MeCab

# NOWKEY = datetime.datetime.now().strftime("%Y%m%d%H%M%S")

CURRENTDIR = os.path.dirname(__file__)
INDIR = os.path.join(CURRENTDIR, os.pardir) + "/in"
OUTDIR = os.path.join(CURRENTDIR, os.pardir) + "/dest/analyze"
os.makedirs(OUTDIR, exist_ok=True)


def parse(text):
    # 「分かち書きされた要素の情報（タブ区切り）」のリスト(EOSの行は削除)
    chunks = mecab.parse(text).splitlines()[:-1]
    # dict化
    ret = []
    for chunk in chunks:
        # print(chunk)

        # # UniDic format
        # d = chunk.split("\t")
        # # 各データに分解
        # ret.append(
        #     {
        #         "org": d[0],
        #         "base": re.sub("\\-.+", "", d[3]),
        #         "type": re.sub("\\-.+", "", d[4]),
        #         "types": d[4:7],
        #     }
        # )

        # MeCab default format
        d = chunk.split("\t")[1].split(",")
        ignoresForBase = ["", "*"]
        org = chunk.split("\t")[0]
        base = d[6]
        if base.strip() in ignoresForBase:
            base = org
        # 各データに分解
        ret.append(
            {
                "org": org,
                "base": base,
                "type": d[0],
                "types": list(filter(lambda x: x.strip() not in ignoresForBase, d[:6])),
            }
        )

    return ret


def addCount(countDict, d):
    # 分解したデータを計測
    key = d["base"] + "-" + d["type"]
    if key not in countDict:
        countDict[key] = {
            "base": "",
            "type": "",
            "count": 0,
            "types": [],
            "orgs": [],
        }
    countDict[key]["base"] = d["base"]
    countDict[key]["type"] = d["type"]
    countDict[key]["count"] += 1
    countDict[key]["orgs"].append(d["org"])
    countDict[key]["orgs"] = list(set(countDict[key]["orgs"]))
    for t in d["types"]:
        if t.strip() != "":
            countDict[key]["types"].append(t)
            countDict[key]["types"] = list(set(countDict[key]["types"]))


# MeCab Taggerオブジェクトを作成
mecab = MeCab.Tagger()

#################################
print("★解析")
#################################
# 分解データ計測 [ファイルのDict][TypeのDict][単語のDict]["count"]
dataDictPerEpisodes = {}
# 分解データ計測 [TypeのDict][単語のDict]["count"]
dataDictAll = {}
# 入力フォルダ配下のファイルでループ
for name in [s for s in os.listdir(INDIR) if s.endswith(".txt")]:
    print("TARGET:" + name)
    dataDictPerEpisodes[name] = {}
    indir = INDIR
    filename = name
    # パス
    inpath = INDIR + "/" + name
    with open(inpath, mode="r") as infile:
        # ファイル内各行
        lines = infile.readlines()
        for line in lines:
            for w in re.split("[。、\\.,]", line):
                for d in parse(w):
                    if d["base"].strip() == "":
                        continue

                    t = d["type"]
                    if t not in dataDictPerEpisodes[name]:
                        dataDictPerEpisodes[name][t] = {}
                    addCount(dataDictPerEpisodes[name][t], d)
                    # 全データ
                    if t not in dataDictAll:
                        dataDictAll[t] = {}
                    addCount(dataDictAll[t], d)


#################################
print("★出力")
#################################
outdir = OUTDIR
inpath = CURRENTDIR + "/" + "analyzeOrg.html"
# 各エピソード
for epi in dataDictPerEpisodes.keys():
    print("★★" + epi + "出力")
    # 変換用データ
    outData = {}
    for t in dataDictPerEpisodes[epi].keys():
        print("★★★ソート:" + t)
        outData[t] = sorted(
            dataDictPerEpisodes[epi][t].values(), key=lambda d: d["count"], reverse=True
        )

    filename = epi
    outpath = outdir + "/" + filename + ".html"
    print("★★★ファイル出力:" + outpath)
    # 書き
    with open(inpath, mode="r") as infile, open(outpath, mode="w") as outfile:
        lines = infile.readlines()
        for line in lines:
            line = line.replace(
                '"%EPISODES%"',
                "[]",
            )
            line = line.replace('"%WORD_DATA%"', str(outData))
            outfile.write(line)

    # countDict = dataDictPerEpisodes[epi][t]
    # print("TYPE:", t)
    # # すべてを含む
    # # NORMALIZE
    # nrml = s
    # for ss in list(reversed(nrml))[:10]:
    #     print(ss["count"], ":", ss)

# まとめ
print("★★まとめ出力")
episodes = str([x + ".html" for x in sorted(dataDictPerEpisodes.keys())])
outData = {}
for t in dataDictAll.keys():
    print("★★★ソート:" + t)
    outData[t] = sorted(dataDictAll[t].values(), key=lambda d: d["count"], reverse=True)

outpath = outdir + "/index.html"
print("★★★ファイル出力:" + outpath)
# 書き
with open(inpath, mode="r") as infile, open(outpath, mode="w") as outfile:
    lines = infile.readlines()
    for line in lines:
        line = line.replace(
            '"%EPISODES%"',
            episodes,
        )
        line = line.replace('"%WORD_DATA%"', str(outData))
        outfile.write(line)
