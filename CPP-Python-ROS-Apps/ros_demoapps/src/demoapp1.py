#!/usr/bin/env python
import rospy
from core_api.srv import *

global_namespace = ''

def setpoint_local_position(lx, ly, lz, yaw=0.0, tolerance= 1.0, async = False, relative= False, yaw_valid= False, body_frame= False):
	global global_namespace
	rospy.wait_for_service('/'+ global_namespace +'/navigation/position_set')
	try:
		handle = rospy.ServiceProxy('/'+ global_namespace +'/navigation/position_set', PositionSet)

		# building message structure
		header_msg = std_msgs.msg.Header(1,rospy.Time(0.0,0.0),'a')
		twist = geometry_msgs.msg.Twist(geometry_msgs.msg.Vector3(lx,ly,lz),geometry_msgs.msg.Vector3(0.0,0.0,yaw))
		twiststamped_msg= geometry_msgs.msg.TwistStamped(header_msg, twist)
		req_msg = PositionSetRequest(x=lx, y=ly, z=lz, yaw=yaw, tolerance=tolerance, async=async, relative=relative, yaw_valid=yaw_valid, body_frame=body_frame)
		resp = handle(req_msg)
		return resp.success
	except rospy.ServiceException, e:
		rospy.logerr("pos set service call failed %s", e)
		return None

def make_square():
	global global_namespace
	#first get the global namespace to call the subsequent services
	#wait for service to come up
	rospy.wait_for_service('/get_global_namespace')
	try:
		res = rospy.ServiceProxy('/get_global_namespace', ParamGetGlobalNamespace)
		op = res()
		global_namespace = str(op.param_info.param_value)
	except rospy.ServiceException, e:
		rospy.logerr("global namespace service not available", e)
		#cannot continue without global namespace
		return None

	# Next take off to an altitue of 3.0 meters
	rospy.wait_for_service('/'+ global_namespace +'/navigation/take_off')
	try:
		handle = rospy.ServiceProxy('/'+ global_namespace +'/navigation/take_off', TakeOff)
		resp = handle(takeoff_alt=3.0)
	except rospy.ServiceException, e:
		rospy.logerr("takeoff service call failed %s", e)
		# cannot continue without taking off
		return None
	print "Took off successfully"

	# Then call the position set service for each edge of a square shaped trajectory
	if setpoint_local_position(5,0,-3.0):
		print "Successfully reached 1st waypoint"
	else:	
		rospy.logerr("Failed to set position")
		return None
	if setpoint_local_position(5,5,-3.0):
		print "Successfully reached 2nd waypoint"
	else:
		rospy.logerr("Failed to set position")
		return None
	if setpoint_local_position(0,5,-3.0):
		print "Successfully reached 3rd waypoint"
	else:
		rospy.logerr("Failed to set position")
		return None
	if setpoint_local_position(0,0,-3.0):
		print "Successfully reached 4th waypoint"
	else:
		rospy.logerr("Failed to set position")
		return None

	# Finally land the drone
	rospy.wait_for_service('/'+ global_namespace +'/navigation/land')
	try:
		handle = rospy.ServiceProxy('/'+ global_namespace +'/navigation/land', Land)
		resp = handle(False)
	except rospy.ServiceException, e:
		rospy.logerr("land service call failed %s", e)
		return None
	print "Landed Successfully. Exiting script."

if __name__ == "__main__":
	make_square()
