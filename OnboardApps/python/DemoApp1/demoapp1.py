#!/usr/bin/env python

from flyt_python import api

nav = api.navigation() # instance of flyt navigation class

nav.arm()
print 'taking off'
nav.takeoff(3.0)
print ' going along the setpoints'
nav.position_set(5,0,-3)
nav.position_set(5,5,-3)
nav.position_set(0,5,-3)
nav.position_set(0,0,-3)
print 'Done'
nav.land()
print 'wait for the vehicle to land'

 