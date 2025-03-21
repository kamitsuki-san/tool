import os
import datetime

import pykakasi

kks = pykakasi.kakasi()

# NOWKEY = datetime.datetime.now().strftime("%Y%m%d%H%M%S")

CURRENTDIR = os.path.dirname(__file__)
INDIR = os.path.join(CURRENTDIR, os.pardir) + "/in"
OUTDIR = os.path.join(CURRENTDIR, os.pardir) + "/dest/hira"
os.makedirs(OUTDIR, exist_ok=True)


# 変換
def conv(text):
    result = kks.convert(text)
    # for item in result:
    #     print("{}: kana '{}', hiragana '{}', romaji: '{}'".format(item['orig'], item['kana'], item['hira'], item['hepburn']))
    return result


# 1ファイルを変換
def convFile(indir, filename, outdir):
    # パス
    inpath = indir + "/" + filename
    outpath = outdir + "/" + filename
    # 読み書き
    with open(inpath, mode="r") as infile, open(outpath, mode="w") as hirafile:
        lines = infile.readlines()
        for line in lines:
            line = line.replace("\n", "")
            line = line.replace("\r", "")
            for item in conv(line):
                hirafile.write(item["hira"])
            hirafile.write("\n")


# 入力フォルダ配下のファイルでループ
for name in [s for s in os.listdir(INDIR) if s.endswith(".txt")]:
    print("TARGET:" + name)
    convFile(INDIR, name, OUTDIR)
