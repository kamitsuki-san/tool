KEY=�Ϥ���

echo $KEY > input.txt
mecab input.txt -o output.txt
# ���ԤǤϤʤ���ñ�줬���Ԥ��¿���ᣲñ��ʾ�Ȥ���Ƚ�ꤵ�줿
wc -l output.txt | grep -v 2
echo $?