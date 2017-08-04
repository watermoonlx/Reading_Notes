import os

os.chdir('./05')


def readData(filename):
    try:
        with open(filename, 'r') as file:
            return file.readline().strip().split(',')
    except IOError as err:
        print('Read file failed. ' + str(err))
        return None


def sanitize(time_string):
    if '-' in time_string:
        spliter = '-'
    elif ':' in time_string:
        spliter = ':'
    else:
        return time_string
    (min, secs) = time_string.split(spliter)
    return min + '.' + secs

# def sanitizeList(data_lsit):
#     return [sanitize(data) for data in data_lsit]

# james = sorted(sanitizeList(readData('james.txt')))
# julie = sorted(sanitizeList(readData('julie.txt')))
# mikey = sorted(sanitizeList(readData('mikey.txt')))
# sarah = sorted(sanitizeList(readData('sarah.txt')))

james = sorted(set([sanitize(data) for data in readData('james.txt')]))[:3]
julie = sorted(set([sanitize(data) for data in readData('julie.txt')]))[:3]
mikey = sorted(set([sanitize(data) for data in readData('mikey.txt')]))[:3]
sarah = sorted(set([sanitize(data) for data in readData('sarah.txt')]))[:3]

print(james)
print(julie)
print(mikey)
print(sarah)
