x = 1


def change_global():
    global x
    x = x + 1


change_global()

print str(x)
