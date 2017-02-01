#!/usr/bin/env python
import time
import math
import numpy as np
from operator import add
import argparse
import sys
import gpxpy.geo
# add arguments

max_abs_dist = 20 # in meters, max horizontal distance from current location to the target


parser = argparse.ArgumentParser()
parser.add_argument('lat_off', help='lat off')
parser.add_argument('lon_off', help='lon off')
parser.add_argument('height', help='height from ground in meters')
parser.add_argument('wait_time', help='wait time at target spot')
args = parser.parse_args()


from flyt_python import api
drone = api.navigation(timeout=120000) # instance of drone navigation class

#at least 3sec sleep time for the drone interface to initialize properly
time.sleep(3)


fly = True

if fly:
    try:
        gpos_home_gnd = drone.get_global_position()
        lpos_home_gnd = drone.get_local_position()
    except:
        pass
    print gpos_home_gnd.lat, gpos_home_gnd.lon, gpos_home_gnd.alt, "ground global position"
    lat1, lon1 = gpos_home_gnd.lat, gpos_home_gnd.lon
    lat2, lon2 = gpos_home_gnd.lat+float(args.lat_off), gpos_home_gnd.lon+float(args.lon_off)

    try:
        dist_to_target = gpxpy.geo.haversine_distance(lat1,lon1,lat2,lon2)
    except:
        print "couldn't calculate distance to target, aborting mission!"
        drone.disconnect()
        sys.exit(1)

    if dist_to_target <= max_abs_dist:
        print 'dist to target from ground is',dist_to_target, 'taking off'
        drone.take_off(float(args.height))
        try:
            gpos_home_air = drone.get_global_position()
            lpos_home_air = drone.get_local_position()
            print "home air gps location at", gpos_home_air.lat, gpos_home_air.lon
        except:
            pass

        if gpos_home_air.lat and gpos_home_air.lon:
            pass
        else:
            # pos_init = [0.0,0.0,0.0]
            print "Error: Couldn't get current Position, mission will be aborted for safety."
            drone.land(async=False)
            drone.disconnect()
            sys.exit(1)


        print ' going along the setpoints'
        # all setpoints should be relative to current

        print "####################"
        try:
            lat_target = gpos_home_air.lat+float(args.lat_off)
            lon_target = gpos_home_air.lon+float(args.lon_off)
            print "going to setpoint", lat_target, lon_target, -lpos_home_air.z
            res = drone.position_set_global(lat=lat_target, lon=lon_target, rel_ht=-lpos_home_air.z, tolerance=1.0)
            print "command status", res
        except:
            print "error mision aborted!"
            drone.land(async=False)
            drone.disconnect()
            sys.exit(1)

        time.sleep(float(args.wait_time))
        print "####################"
        try:
            print "going back to home for land", gpos_home_air.lat, gpos_home_air.lon
            res = drone.position_set_global(lat=gpos_home_air.lat, lon=gpos_home_air.lon, rel_ht=-lpos_home_air.z, tolerance=1.0)
            print "command status", res
        except:
            print "error mission aborted!"
            drone.land(async=False)
            drone.disconnect()
            sys.exit(1)

    else:
        print "target site dist:", dist_to_target, ", too far to reach, aborting mission!!"


    print 'Landing'
    drone.land(async=False)

#shutdown the instance
drone.disconnect()
