import sys

args = sys.argv

word = args[1]
resultSet = set()
resultSet.add(word[0] + word[1] + word[2])
resultSet.add(word[0] + word[2] + word[1])
resultSet.add(word[1] + word[0] + word[2])
resultSet.add(word[1] + word[2] + word[0])
resultSet.add(word[2] + word[0] + word[1])
resultSet.add(word[2] + word[1] + word[0])

print('\n'.join(resultSet))