import os
import pickle
import nester

os.chdir('./04')


try:
    with open('man_data.txt','rb') as man_file:
        man=pickle.load(man_file)
    with open('other_data.txt','rb') as other_data:
        other=pickle.load(other_data)
except pickle.PickleError as err:
    print(str(err))

nester.print_lol(man);
nester.print_lol(other);