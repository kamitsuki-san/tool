- install
python3 -m venv myenv
source myenv/bin/activate
pip install pykakasi
pip install mecab-python3
pip install unidic-lite

- use
source myenv/bin/activate

- add user dictionary
sudo mkdir /usr/local/lib/mecab/dic/userdic/
# https://www.unixuser.org/~euske/doc/postag/  に沿ってCSVを作成
# 文字コードは mecab -D でシステムに合わせる
# https://taku910.github.io/mecab/
# 先頭行を削除してコピー
sed -e '1d' src/dic_sample_with_header.csv > mydict.csv
# 辞書のコンパイル
/usr/local/libexec/mecab/mecab-dict-index -d /usr/local/lib/mecab/dic/ipadic -u my_$(date '+%Y%m%d%H%M%S').dic -f utf8 -t utf8 mydict.csv
# 移動
sudo mv *.dic /usr/local/lib/mecab/dic/userdic/
# 登録(userdic = /usr/local/lib/mecab/dic/userdic/my_20250321173804.dic)
sudo vi /usr/local/etc/mecabrc

# check
echo '焼肉定食が食べたい' | mecab
