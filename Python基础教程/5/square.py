def story(**kwds):
    return 'Once upon a time,there was a '\
        '%(job)s called %(name)s.' % kwds

def power(x,y,*other):
    if other:
        print 'Received redundant parameters:',other
    return

def interval(start,stop=None,step=1):
    if stop is None:
        start,stop=0,start
    result=[]
    i=start
    while i<stop:
        result.append(i)
        i+=step
    return result

print str(interval(10))