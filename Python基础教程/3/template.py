from string import Template

s=Template('A ${thing} must never ${action}')
d={}
d['thing']='gentleman'
d['action']='show his socks'
print s.substitute(d)

if True:
    