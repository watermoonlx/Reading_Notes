import sys


def print_lol(the_list, index=False, level=0, fn=sys.stdout):
    for item in the_list:
        if isinstance(item, list):
            print_lol(item, index, level + 1)
        else:
            if index:
                for tab_stop in range(level):
                    print('\t', end='',file=fn)
            print(item,file=fn)
