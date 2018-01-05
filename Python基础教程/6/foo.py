class Foo(object):
    def __init__(self, value):
        self.name = value

    def print_name(self):
        print self.name


foo = Foo()

foo.print_name()
