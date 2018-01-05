class Test:
    count = 22

    def howMany(self):
        print self.count
        print Test.count

    def add(self):
        self.count += 1


test = Test()
test.howMany()
test.add()
test.howMany()
