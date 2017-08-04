movies = [
    'The Holy Grail', 1975, 'Terry Jones & Terry Gilliam', 91,
    [
        'Graham Chapman',
        ['Mickael Palin', 'Jhon Cleese', 'Terry Gilliam', 'Eric Idle', "Terry Jones"]
    ]
]


def print_lol(the_list):
    for movie in the_list:
        if isinstance(movie, list):
            print_lol(movie)
        else:
            print(movie)


print_lol(movies)
