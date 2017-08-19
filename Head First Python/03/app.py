import os

os.chdir('./03')

data = open('sketch.txt')

for line in data:
    try:
        (role, line_spoken) = line.split(':', 1)
        print(role, end='')
        print(' said: ', end='')
        print(line_spoken, end='')
    except:
        pass

data.close()
