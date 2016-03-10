import cv2
import cv2.cv as cv
import detector as vision
import numpy as np
from flyt_python import api
nav = api.navigation() # instance of flyt navigation class
state_UP, state_DOWN = False, False
delta_h = 1.0      ## vertical distance between top and bottom points
# Take input from webcam
cap = cv2.VideoCapture(0)

def state_machine(trigA, trigB, sUP, sDOWN, del_h):
    up = bool(sUP)
    down = bool(sDOWN)
    if up:
        if not trigA and trigB:
            print "going down"
            nav.position_set(0,0, del_h, relative = True, async=True)
            up, down = False, True
        return (up, down)
    if down:
        if trigA and not trigB:
            print "going up"
            nav.position_set(0,0, -del_h, relative = True, async=True)
            up, down = True, False
        return (up, down)
    if trigA and not trigB:
        print "going up"
        nav.position_set(0,0,-(del_h/2), relative = True, async=True)
        up = True
        return (up, down)
    if not trigA and trigB:
        print "going down"
        nav.position_set(0,0,(del_h/2), relative = True, async=True)
        down = True
        return (up, down)
    return (up, down)

while(1):
    trig_eventA, trig_eventB = vision.find_circles(cap)
    state_UP, state_DOWN = state_machine(trig_eventA, trig_eventB, state_UP, state_DOWN, delta_h)
    k = cv2.waitKey(5) & 0xFF
    if k == 27:
        break

cap.release()
cv2.destroyAllWindows()
