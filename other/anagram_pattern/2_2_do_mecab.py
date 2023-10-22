import subprocess
import sys

python_cmd = 'python3'

args = sys.argv
# 単語候補の文字組み合わせ（最大6通り）
word = args[1]

combo_list = subprocess.run([python_cmd, '2_1_word_combo.py', word], capture_output=True, text=True).stdout
# 空白で分割（組み合わせた最大6通り単語で改行）
combo_list = combo_list.split()
for c in combo_list:
    # # create INPUT FILE
    with open('input.txt', mode='w', encoding='euc_jp') as f:
        f.write(c)
    # MECAB
    subprocess.run(['mecab', 'input.txt', '-o', 'output.txt'], capture_output=True, text=True).stdout
    # # read OUTPUT FILE
    with open('output.txt', mode='r', encoding='euc_jp') as f:
        mecab_out = f.readlines()
        if len(mecab_out) == 2:
            print(mecab_out[0].replace("\n", ""))
    

