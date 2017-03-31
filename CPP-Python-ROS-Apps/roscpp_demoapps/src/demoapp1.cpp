#include <ros/ros.h>
#include <core_api/ParamGetGlobalNamespace.h>
#include <core_api/TakeOff.h>
#include <core_api/Land.h>
#include <core_api/PositionSet.h>

std::string global_namespace;

core_api::ParamGetGlobalNamespace namespace_srv;
core_api::TakeOff takeoff_srv;
core_api::Land land_srv;
core_api::PositionSet pos_srv;

ros::ServiceClient pos_client,land_client,takeoff_client;


bool position_set(float x, float y, float z)
{
  pos_srv.request.twist.twist.linear.x = x;
  pos_srv.request.twist.twist.linear.y = y;
  pos_srv.request.twist.twist.linear.z = z;
  pos_srv.request.twist.twist.angular.z = 0.0;
  pos_srv.request.tolerance = 1.0;
  pos_srv.request.async = false;
  pos_srv.request.yaw_valid = false;
  pos_srv.request.relative = false;
  pos_srv.request.body_frame = false;
  ROS_INFO("Going to the next setpoint");
  pos_client.call(pos_srv);
  return pos_srv.response.success;
}

int main(int argc, char **argv)
{
  ros::init(argc, argv, "roscpp_demoapp1");
  ros::NodeHandle nh;

  ros::ServiceClient namespace_client = nh.serviceClient<core_api::ParamGetGlobalNamespace>("/get_global_namespace");
  namespace_client.call(namespace_srv);
  global_namespace = namespace_srv.response.param_info.param_value;
  
  takeoff_client = nh.serviceClient<core_api::TakeOff>("/"+global_namespace+"/navigation/take_off");
  land_client    = nh.serviceClient<core_api::Land>("/"+global_namespace+"/navigation/land");
  pos_client     = nh.serviceClient<core_api::PositionSet>("/"+global_namespace+"/navigation/position_set");

  ROS_INFO("Taking Off");
  takeoff_srv.request.takeoff_alt = 3.0;
  takeoff_client.call(takeoff_srv);
  if(!takeoff_srv.response.success)
  {
    ROS_ERROR("Failed to takeoff");
    return 1;    
  }
  // position_set(5,0,-3);       //Sending Position Setpoints
  // position_set(5,5,-3);
  // position_set(0,5,-3);
  // position_set(0,0,-3);

  if(!position_set(5,0,-3))
  {
    ROS_ERROR("Failed to set position");
    return 1;    
  }

  if(!position_set(5,5,-3))
  {
    ROS_ERROR("Failed to set position");
    return 1;    
  }

  if(!position_set(0,5,-3))
  {
    ROS_ERROR("Failed to set position");
    return 1;    
  }

  if(!position_set(0,0,-3))
  {
    ROS_ERROR("Failed to set position");
    return 1;    
  }

  ROS_INFO("Landing");
  land_srv.request.async =false;
  land_client.call(land_srv); 
  if(!land_srv.response.success)
  {
    ROS_ERROR("Failed to Land!");
    return 1;
  }
  return 0;
}