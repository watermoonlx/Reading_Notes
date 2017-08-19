class AthleteList(list):
    def __init__(self, name, dob=None, times=[]):
        list.__init__(self)
        self.name = name
        self.dob = dob
        self.extend(times)

    def top3(self):
        return sorted(set([sanitize(t) for t in self]))[:3]

    def add_time(self, time):
        self.append(time)

    def add_times(self, times):
        self.extend(times)


def sanitize(time_string):
    if '-' in time_string:
        spliter = '-'
    elif ':' in time_string:
        spliter = ':'
    else:
        return time_string
    (min, secs) = time_string.split(spliter)
    return min + '.' + secs
