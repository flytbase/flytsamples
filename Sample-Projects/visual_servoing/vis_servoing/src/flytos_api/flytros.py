#!/usr/bin/env python
import ast

import rospy
from core_api.srv import *
from core_api.msg import ParamInfo

class FlytDroneAPI(object):

    def __init__(self, namespace):
        if namespace:
            self.namespace = namespace
        else:
            self.namespace = self.get_global_namespace()

    def get_global_namespace(self):
        rospy.wait_for_service('/get_global_namespace')
        try:
            res = rospy.ServiceProxy('/get_global_namespace', ParamGetGlobalNamespace)
            op = res()
            return str(op.param_info.param_value)
        except rospy.ServiceException, e:
            rospy.logerr("global namespace service not available", e)
            return None

    def take_off(self, height):
        rospy.wait_for_service(self.namespace + '/navigation/take_off')
        try:
            handle = rospy.ServiceProxy(self.namespace + '/navigation/take_off', TakeOff)
            resp = handle(takeoff_alt=height)
            return resp
        except rospy.ServiceException, e:
            rospy.logerr("service call failed %s", e)

    def land(self, async=False):
        rospy.wait_for_service(self.namespace + '/navigation/land')
        try:
            handle = rospy.ServiceProxy(self.namespace + '/navigation/land', Land)
            resp = handle(async)
            return resp
        except rospy.ServiceException, e:
            rospy.logerr("service call failed %s", e)

    def set_velocity(self, vx, vy, vz, yaw_rate, tolerance=1.0, async=False, relative=True, yaw_rate_valid=False,
                     body_frame=True):
        rospy.wait_for_service(self.namespace + '/navigation/velocity_set')
        try:
            handle = rospy.ServiceProxy(self.namespace + '/navigation/velocity_set', VelocitySet)
            # build the message structure
            header_msg = std_msgs.msg.Header(1, rospy.Time(0.0, 0.0), 'a')
            twist = geometry_msgs.msg.Twist(geometry_msgs.msg.Vector3(vx, vy, vz),
                                            geometry_msgs.msg.Vector3(0.0, 0.0, yaw_rate))
            twiststamped_msg = geometry_msgs.msg.TwistStamped(header_msg, twist)
            req_msg = VelocitySetRequest(twiststamped_msg, tolerance, async, relative, yaw_rate_valid, body_frame)
            resp = handle(req_msg)
            return resp
        except rospy.ServiceException, e:
            rospy.logerr("vel set service call failed %s", e)

    def position_hold(self):
        rospy.wait_for_service(self.namespace + '/navigation/position_hold')
        try:
            handle = rospy.ServiceProxy(self.namespace +'/navigation/posigettion_hold', PositionHold)
            resp = handle()
            return resp
        except rospy.ServiceException, e:
            rospy.logerr("service call failed %s", e)

    def gimbal_set(self,roll,pitch,yaw):
        rospy.wait_for_service(self.namespace + '/payload/gimbal_set')
        try:
            handle = rospy.ServiceProxy(self.namespace + '/payload/gimbal_set', GimbalSet)
            resp=handle(roll,pitch,yaw)
            return resp
        except  rospy.ServiceException, e:
            rospy.logerr("service call failed %s", e)

    def get_param(self, param_id):
        rospy.wait_for_service(self.namespace + '/param/param_get')
        try:
            handle = rospy.ServiceProxy(self.namespace+'/param/param_get', ParamGet)
            resp = handle(param_id)
            if resp.success:
                # this API returns all values as strings, need to eval for type
                type_evaled =  ast.literal_eval(resp.param_info.param_value)
                return type_evaled
            else: return None
        except rospy.ServiceException, e:
            rospy.logerr("service call failed %s", e)

    def create_param(self, param_id, param_value):
        rospy.wait_for_service(self.namespace + '/param/param_create')
        try:
            handle = rospy.ServiceProxy(self.namespace + '/param/param_create', ParamCreate)
            msg = ParamInfo(param_id, str(param_value))
            req_msg = ParamCreateRequest(msg)
            resp = handle(req_msg)
            return resp.success
        except rospy.ServiceException, e:
            rospy.logerr("service call failed %s", e)
