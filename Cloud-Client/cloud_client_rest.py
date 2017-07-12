import json
import sys
from requests import get, put

#comment by putting hash(#) 
#uncomment by removing hash(#)

token = 'de1de2cc11bebc502d0737866cd47ab0235e9da5'	#replace the value with your personal access token within single quotes(')
VehicleID = 'NzxxpEfy'	#replace this with the vehicle ID within single quotes (')
token = token.replace(" ", "")
VehicleID = VehicleID.replace(" ", "")

if len(token) != 40 or len(VehicleID) != 8:
    print "The token length should be 40 characters and the VehicleID should be 8 characters"
    sys.exit()

headers = {'Authorization':'Token ' + token, 'VehicleID': VehicleID}



def printResponse(msg, r):
	print msg + r.reason 
	print "Content " + r.content + "\n"  

#get namespace of the vehicle API call


result = get('https://dev.flytbase.com/rest/ros/get_global_namespace', headers = headers)
result = json.loads(result.content)
namespace = result["param_info"]["param_value"]

print "Your " + namespace + " is connected through cloud client"
#take off API call
#take_off_alt = 10
#printResponse("navigation/take_off	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/take_off', headers = headers, data=json.dumps({"takeoff_alt": take_off_alt})))

#land API call
#async = True
#printResponse("navigation/land ", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/land', headers = headers, data=json.dumps({"async": async})))

#position hold API call
#printResponse( "navigation/position_hold ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/position_hold', headers = headers))

#get local position API call
printResponse( "mavros/local_position/local ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/local_position/local', headers = headers))

#arm vehicle API call
#printResponse( "navigation/arm ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/arm', headers = headers))

#disarm vehicle API call
#printResponse( "navigation/disarm ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/disarm', headers = headers))

#set local position API call
#printResponse("navigation/position_set	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/position_set', headers = headers, data=json.dumps({"twist":{"twist":{ "linear":{
#                "x": 12.5,
#                "y": 12.5,
#                "z": 12.5
#            },"angular":{
#                "z": 12.4
#    }}},
#    "tolerance": 0.3,
#    "async": True,
#    "relative": True,
#    "yaw_valid" : True,
#    "body_frame" : True })))

#set global position API call 
#printResponse("navigation/position_set_global	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/position_set_global', headers = headers, data=json.dumps({"twist":{"twist":{ "linear":{
#                "x": 12.5,
#                "y": 12.5,
#                "z": 12.5
#            },"angular":{
#                "z": 12.4
#    }}},
#    "tolerance": 0.3,
#    "async": True,
#    "yaw_valid" : True
#})))

#set velocity API call
#printResponse("navigation/velocity_set	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/velocity_set', headers = headers, data=json.dumps({"twist":{"twist":{ "linear":{
#                "x": 12.5,
#                "y": 12.5,
#                "z": 12.5
#            },"angular":{
#                "z": 12.4
#    }}},
#    "tolerance": 0.3,
#    "async": True,
#    "relative": True,
#    "yaw_rate_valid" : True,
#    "body_frame" : True 
#})))

#get waypoint API call
#printResponse( "navigation/waypoint_get ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/waypoint_get', headers = headers))

#set waypoint API call
#printResponse("navigation/waypoint_set	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/waypoint_set', headers = headers, data=json.dumps({   "waypoints":[{
#        "frame" : 3,
#        "command" : 16,
#        "is_current" : True,
#        "autocontinue" : True,
#        "param1" : 10.2,
#        "param2" : 10.2,
#        "param3" : 10.2,
#        "param4" : 10.2,
#        "x_lat" : 10.2,
#        "y_long" : 10.2,
#        "z_alt" : 10.2,
#        },
#        {
#        "frame" : 3,
#        "command" : 16,
#        "is_current" : True,
#        "autocontinue" : True,
#        "param1" : 10.2,
#        "param2" : 10.2,
#       "param3" : 10.2,
#        "param4" : 10.2,
#        "x_lat" : 12.2,
#        "y_long" : 12.2,
#        "z_alt" : 12.2,
#        }] })))

#set current API call
#printResponse("navigation/waypoint_set_current	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/waypoint_set_current', headers = headers, data=json.dumps(
#{   "wp_seq": 2 })))


#set home API call
#printResponse("navigation/set_home	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/set_home', headers = headers, data=json.dumps(
#{   "lat": 12.4,
#    "lon": 12.4,
#    "alt": 20.4,
#    "set_current" : True
# })))

#get payload data API call
#this API will only work for FlytPOD, uncomment by removing the hash
#printResponse( "mavros/payload_adc ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/payload_adc', headers = headers))

#set gimbal API call
#printResponse("payload/gimbal_set	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/payload/gimbal_set', headers = headers, data=json.dumps(
#{   "roll": 20.2,
#    "pitch": 12.2,
#    "yaw": 1.2     }
#)))

#execute script API call
#printResponse("navigation/exec_script	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/exec_script', headers = headers, data=json.dumps({   "app_name" : "String", "arguments" : "String" })))


#Parameter APIs

#Parameter create API call
#printResponse("param/param_create	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_create', headers = headers, data=json.dumps({  'param_info':{ 'param_id': 'walk',
# 'param_value': 'test' }})))

#Parameter set API call
#printResponse("param/param_set	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_set', headers = headers, data=json.dumps(
#{  "param_info":{
#        'param_id': 'walk',
#        'param_value': 'test2'
#        }    
#	})))

#Get All Parameters API call
#printResponse( "param/param_get_all ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_get_all', headers = headers))

#Get Parameter value API call
#printResponse("param/param_get	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_get', headers = headers, data=json.dumps({       "param_id": 'walk'})))

#Save Parameters API call
#printResponse( "param/param_save ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_save', headers = headers))

#Load Parameters API call
#printResponse( "param/param_load ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_load', headers = headers))

#Delete Parameters API call
#printResponse("param/param_delete	", put('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_delete', headers = headers, data=json.dumps({ "param_id": "walk"})))

#Reset Parameters API call
#printResponse( "param/param_reset ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/param/param_reset', headers = headers))

#Execute Waypoints API call
#printResponse( "navigation/waypoint_execute ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/waypoint_execute', headers = headers))

#Clear waypoints API call
#printResponse( "navigation/waypoint_clear ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/waypoint_clear', headers = headers))

#Pause waypoint execution API call
#printResponse( "navigation/waypoint_pause ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/waypoint_pause', headers = headers))

#Return to launch API call
#printResponse( "navigation/rtl ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/navigation/rtl', headers = headers))



# Telemetry APIs

#Get IMU data API call
printResponse( "mavros/imu/data ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/imu/data', headers = headers))

#Get IMU euler API call
printResponse( "mavros/imu/data_euler ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/imu/data_euler', headers = headers))

#Get global position API call
printResponse( "mavros/global_position/global ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/global_position/global', headers = headers))

#Get battery status API call
printResponse( "mavros/battery ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/battery', headers = headers))

#Get VFR HUD data API call
printResponse( "mavros/vfr_hud ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/vfr_hud', headers = headers))

#Get RC data API call
#printResponse( "mavros/rc/in ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/rc/in', headers = headers))

#Get Distance from ground API call
#printResponse( "mavros/distance_sensor/lidarlite_pub ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/mavros/distance_sensor/lidarlite_pub', headers = headers))

#Get State of Vehicle
printResponse( "flyt/state ", get('https://dev.flytbase.com/rest/ros/' + namespace + '/flyt/state', headers = headers))




