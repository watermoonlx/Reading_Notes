database = [
    ['albert', '1234'],
    ['dilbert', '4242'],
    ['smith', '7524'],
    ['jones', '9843']
]

database.pop()
username = raw_input('User name:')
pin = raw_input('PIN code:')

if [username, pin] in database:
    print 'Access granted'
else:
    print 'AAccess denied'
