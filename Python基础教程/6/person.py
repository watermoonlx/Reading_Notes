__metaclass__ = type


class Person:

    count=0

    name='Jake'

    def getName(self):
        print '%s' % self.name


print Person.name
