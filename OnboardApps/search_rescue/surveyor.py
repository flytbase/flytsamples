#!/usr/bin/env python
import time
import math
import numpy as np
from operator import add
import argparse
import sys
# add arguments
parser = argparse.ArgumentParser()
parser.add_argument('box_l', help='length of the box, x direction')
parser.add_argument('box_h', help='length of the box, y direction')
parser.add_argument('step', help='step size, multiple of 0.5 only')
parser.add_argument('height', help='height from ground in meters')
parser.add_argument('heading_correction', help='send True', type=bool)

args = parser.parse_args()


from flyt_python import api
drone = api.navigation(timeout=120000) # instance of drone navigation class

#at least 3sec sleep time for the drone interface to initialize properly
time.sleep(3)

# save current position and yaw angle and use it to rotate all the setpoints

if args.heading_correction == True:
    init_ang = drone.get_attitude_euler()
    print init_ang.roll, init_ang.pitch, init_ang.yaw, "starting angles"
    if init_ang.yaw is not None:
        theta_init = init_ang.yaw
    else:
        print "Error: Couldn't get current Yaw, mission will be aborted for safety."
        drone.disconnect()
        sys.exit(1)
else:
    theta_init = 0.0


def generate_zigzag_setpoints(shapeX, shapeY, step_size):
    res = []
    for i in range(int(shapeX/step_size+1)):
        if i%2:
            for j in list(reversed(range(int(shapeY/step_size+1)))):
                res.append( [i * step_size, j * step_size])
        else:
            for j in range(int(shapeY/step_size+1)):
                res.append( [i * step_size, j * step_size])
    return res


def get_setpoints(shape, step, height, theta, pos_offset):
    sp =  generate_zigzag_setpoints(shape[0],shape[1],1)
    md_sp = []
    for x in sp:
        md_sp.append( [[n] for n in x])
    # print md_sp

    # rotation matrix
    rot_mat = [[math.cos(theta), -math.sin(theta)], [math.sin(theta), math.cos(theta)]]

    rot_setpoints = [np.array((np.matrix(rot_mat) * np.matrix(x)).flatten()).reshape(-1).tolist() for x in md_sp]
    # print rot_setpoints
    final_setpoints = [x + [height] for x in rot_setpoints]
    # add position offset from origin
    final_sp = [map(add, x, pos_offset) for x in final_setpoints]
    return final_sp


fly = True

if fly:
    print 'taking off'
    drone.take_off(float(args.height))

    print ' going along the setpoints'
    # all setpoints should be relative to current


    init_pos = drone.get_local_position()
    if init_pos.x and init_pos.y:
        pos_init = [init_pos.x, init_pos.y, 0.0]
    else:
        # pos_init = [0.0,0.0,0.0]
        print "Error: Couldn't get current Position, mission will be aborted for safety."
        drone.land(async=False)
        drone.disconnect()
        sys.exit(1)
    # todo remove this
    # pos_init = [2.0, 2.0, 0.0]
    print init_pos.x, init_pos.y, init_pos.z, "current position, this will be used for offset"
    try:
        setpoints = get_setpoints([float(args.box_l), float(args.box_h)], float(args.step), float(init_pos.z), theta_init, pos_init)
    except (ValueError, TypeError) as e:
        print "Error in setpoint calulation:", e, ": for safety mission aborted!!"
        print 'Landing now'
        drone.land(async=False)
        drone.disconnect()
        sys.exit(1)

    for sp in setpoints:
        drone.position_set(*sp)
        print "going to", sp

    print 'Landing'
    drone.land(async=False)

#shutdown the instance
drone.disconnect()
