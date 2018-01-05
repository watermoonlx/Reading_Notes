def isConflict(state, nextX):
    nextY = len(state)
    for row, col in enumerate(state):
        if abs(col - nextX) in (0, nextY - row)
