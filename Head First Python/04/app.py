import os
import pickle

os.chdir('./04')

man = []
other = []

try:
    data = open('sketch.txt')
    for line in data:
        try:
            (role, line_spoken) = line.split(':', 1)
            line_spoken.strip()
            if role == 'Man':
                man.append(line_spoken)
            elif role == 'Other Man':
                other.append(line_spoken)
        except ValueError:
            pass
    data.close()
except IOError:
    print('The datafile is missing!')

try:
    with open('man_data.txt', 'wb') as man_file, open('other_data.txt', 'wb') as other_file:
        pickle.dump(man, file=man_file)
        pickle.dump(man, file=other_file)
except pickle.PickleError as err:
    print('file error' + str(err))
