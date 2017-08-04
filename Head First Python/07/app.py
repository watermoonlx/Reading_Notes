import os
import athletemodel

os.chdir('./07')

the_files = ['sarah2.txt', 'james2.txt', 'mikey2.txt', 'julie2.txt']

data = athletemodel.put_to_store(the_files)

newData=athletemodel.get_from_store()

print(newData)