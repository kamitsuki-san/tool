import subprocess
import re

python_cmd = 'python3'
with open('words.txt', mode='r') as f, open('50.txt', mode='w') as w50, open('33.txt', mode='w') as w33, open('00.txt', mode='w') as w00:
    lines = f.readlines()
    for i, line in enumerate(lines):
        # 3文字のユニークな単語候補
        word = line.replace("\n", "")

        # 2_1_word_combo
        result_list = []
        combo_list = subprocess.run([python_cmd, '2_1_word_combo.py', word], capture_output=True, text=True).stdout
        # 2_2_do_mecab相当
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
                    hit = mecab_out[0].replace("\n", "").replace('*', '')
                    hit_sp = hit.split(',')
                    if len(hit_sp[5] + hit_sp[6]) > 0:
                        result_list.append(hit)

        # 割合ごとに分割
        percent = len(result_list)/len(combo_list)
        l = str(len(result_list)) + '\t' + word + '\t' + str(percent) + ':\t' + ',\t'.join(result_list)
        print(str(i) + '\t' + l)
        if percent >= 0.5:
            w50.write(l + '\n')
        elif percent >= 0.33:
            w33.write(l + '\n')
        # else:
        #     w00.write(l + '\n')
