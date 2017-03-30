#!/usr/bin/env python

import rospy
import time
import math
from flytos_api import flytros
from std_msgs.msg import Float32MultiArray, String
from pid_controller.pid import PID

img_size = [320,240] # Size of image, [width, height]
fov = [140,105] # Field of view of camera along width and height

# Height in image plane is pitch for gimbal: X axis
# Width in image plane is yaw for gimbal: Y axis


gimbal_range_X = [-2.5,2.5] # arguments for maximum angles
gimbal_range_Y = [-1.0,2.5] # arguments for maximum angles

# PID gains
kp = .1
ki=0.02
kd=0.0640

# Controller will be run every n seconds as defined by this parameter. If it doesn't work out start with higher values such as 1.0
loop_rate = .2

# Object tracking APIs provide delta pixel value.
# fov Y axis:140, X axis=105
pix_to_rad = math.radians(fov[0])/float(img_size[0]) # Converting number of pixels to radians.

# initialize global variables.
last_X_pose = 0.0
last_Y_pose = 0.0
rad_obj_del_X = 0.0
rad_obj_del_Y = 0.0

v_s_switch = False # Gimbal will not be actuated unless this param is true. (Not used anymore)

# Direction of Gimbal control and centroid coordinates. Following diagram is with respect to camera view.
#   +x
#   ^
#   |
#    --> +y

def centroid_callback(data):
    # This callback is called every time Object tracking API gives object centroid output.
    global rad_obj_del_X
    global rad_obj_del_Y

    # delta pixel values from object tracking API
    obj_del_X, obj_del_Y = data.data[:2]

    # convert delta pixel values to delta angle in radians.
    rad_obj_del_X = float(obj_del_X) * pix_to_rad
    rad_obj_del_Y = float(obj_del_Y) * pix_to_rad


def control_loop_callback(event):
    # Rospy timer will force this loop to run at specified rate.
    global rad_obj_del_X
    global rad_obj_del_Y
    global last_X_pose
    global last_Y_pose
    global v_s_switch

    # feed current state to controlller.
    X_step = pidc_X(feedback=rad_obj_del_X)
    Y_step = pidc_Y(feedback=rad_obj_del_Y)

    #Todo clip the output to a range that gimbal can support.

    # command gimbal to point at particular angle.
    # print v_s_switch
    # if v_s_switch:
    #     save last step to use in next loop as the current position of gimbal.
        # print "there"
        # last_X_pose += X_step
        # last_Y_pose += Y_step
    drone.gimbal_set(0.0, last_X_pose+X_step, last_Y_pose+Y_step)
    # else:
    #     print "hey"
    #     drone.gimbal_set(0.0, -1.0, 0.0)
    #     last_X_pose = -1.0 * 0.6
    #     last_Y_pose = 0.0
    # print pidc_X.error, pidc_Y.error
    # save last step to use in next loop as the current position of gimbal.
    last_X_pose += X_step
    last_Y_pose += Y_step


def param_update_callback(data):
    global v_s_switch
    global control_loop
    print "updated param: ", data.data
    if data.data == "ob_track_parameter_p":
        newP = drone.get_param("ob_track_parameter_p")
        pidc_X.Kp = newP
        pidc_Y.Kp = newP
    if data.data == "ob_track_parameter_i":
        newI = drone.get_param("ob_track_parameter_i")
        pidc_X.Ki = newI
        pidc_Y.Ki = newI
    if data.data == "ob_track_parameter_d":
        newD = drone.get_param("ob_track_parameter_d")
        pidc_X.Kd = newD
        pidc_Y.Kd = newD
    if data.data == "vis_servo_loop_rate":
        loop_rate = drone.get_param("vis_servo_loop_rate")
        # timer need to be restarted in order to apply new loop rate
        control_loop.shutdown()
        control_loop = rospy.Timer(period=rospy.Duration(loop_rate), callback=control_loop_callback, oneshot=False)

    if data.data == "vis_servo_gimbal_switch":
        # if False gimbal will focus at 0,0.8,0
        v_s_switch = drone.get_param("vis_servo_gimbal_switch")


if __name__ == "__main__":
    drone = flytros.FlytDroneAPI(namespace=None)
    rospy.init_node('vis_servoing')
    # global v_s_switch
    # subscribe to centroid msg.
    topic_sub = rospy.Subscriber("/"+drone.namespace+"/object/centroid", Float32MultiArray, centroid_callback)

    # configure params
    params = {kp: "ob_track_parameter_p", ki: "ob_track_parameter_i", kd: "ob_track_parameter_d", loop_rate: "vis_servo_loop_rate", v_s_switch: "vis_servo_gimbal_switch"}
    for i in params.keys():
        val = drone.get_param(params[i])
        if val is not None:
            print "found existing value for param", params[i], val
            i = val
        else:
            print "creating new param", params[i], i
            drone.create_param(params[i], i)

    v_s_switch = True

    # Initialize two separate PID controllers for two axis.
    # Controller's target is to bring delta angle between image center and object's centroid to zero.
    # Controller is not aware of current position of gimbal.
    # Since position feedback from gimbal is not available run controller at lower speed than the gimbal can move. Then assume that current position of gimbal is last commanded state.
    pidc_X = PID(p=kp, i=ki, d=kd)
    pidc_X.target=0
    pidc_Y = PID(p=kp, i=ki, d=kd)
    pidc_Y.target=0

    # Initialize gimbal to (0,0,0) angles.
    drone.gimbal_set(0.0, 0.0, 0.0)
    time.sleep(5.0)

    # initialize a rospy.Timer to force controller rate.
    control_loop = rospy.Timer(period=rospy.Duration(loop_rate), callback=control_loop_callback, oneshot=False)
    # subscribe to param update msg
    param__update_sub = rospy.Subscriber("/" + drone.namespace + "/parameter_updated", String, param_update_callback)

    rospy.spin()
