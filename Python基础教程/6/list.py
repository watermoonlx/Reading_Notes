__metaclass__ = type


class MyClass:
    
    @staticmethod
    def smeth():
        print '123'
    smeth=staticmethod(smeth)

    def cmeth(cls):
        print cls
    cmeth=classmethod(cmeth)


MyClass.smeth()
MyClass.cmeth()

MyClass().cmeth()
