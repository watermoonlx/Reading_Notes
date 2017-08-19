import pickle
from AthleteList import AthleteList


def get_coach_data(filename):
    try:
        with open(filename, 'r') as file:
            data = file.readline().strip().split(',')
            return AthleteList(data.pop(0), data.pop(0), data)
    except IOError as err:
        print('Read file failed. ' + str(err))
        return None


def put_to_store(files_list):
    all_athletes = {}
    for file in files_list:
        data = get_coach_data(file)
        all_athletes[data.name] = data
    try:
        with open('myData.txt', 'wb') as myDataFile:
            pickle.dump(all_athletes, myDataFile)
    except IOError as err:
        print('File error (put_to_store) : ' + str(err))
    return all_athletes


def get_from_store():
    all_athletes = {}
    try:
        with open('myData.txt', 'rb') as myDataFile:
            all_athletes = pickle.load(myDataFile)
    except IOError as err:
        print('File error (get_from_store) : ' + str(err))
    return all_athletes
