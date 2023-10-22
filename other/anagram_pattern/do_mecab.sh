KEY=はしび

echo $KEY > input.txt
mecab input.txt -o output.txt
# ２行ではない＝単語が１行より多い＝２単語以上として判定された
wc -l output.txt | grep -v 2
echo $?