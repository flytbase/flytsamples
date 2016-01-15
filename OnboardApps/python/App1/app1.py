#!/usr/bin/env python

from flyt_python import api
import rospy
iris = api.navigation()

iris.arm()
print 'Taking Off'
iris.takeoff(3.0)
print 'Going along the Setpoints'
iris.position_set(5,0,-3)
iris.position_set(5,5,-3)
iris.position_set(0,5,-3)
iris.position_set(0,0,-3)
print 'Setpoints Completed'
iris.land()
print 'wait for the vehicle to land'

 