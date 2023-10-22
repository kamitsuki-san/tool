with open('char.txt', mode='r') as f:
    lines = f.readlines()
    char = ''
    for i, line in enumerate(lines):
        lines[i] = line.replace("\n", "")

    resultSet = set()
    for i in range(len(lines)):
        for j in range(len(lines)):
            for k in range(len(lines)):
                s = lines[i]+lines[j]+lines[k]
                s = sorted(s)
                resultSet.add(''.join(s))

with open('words.txt', mode='w') as f:
    for word in resultSet:
        f.write(word + "\n")

