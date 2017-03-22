#ifndef APRILTAG_DETECTOR_H
#define APRILTAG_DETECTOR_H

#include <ros/ros.h>
#include <geometry_msgs/PoseStamped.h> ////////////
#include <geometry_msgs/TwistStamped.h> ///////////
#include <sensor_msgs/Range.h>  ///////////////
#include <navigation_util/NavigationPosActionResult.h>

#include <sensor_msgs/NavSatFix.h> //mavros global position
#include <image_transport/image_transport.h>
#include <std_msgs/String.h>
#include <AprilTags/TagDetector.h>
#include <tf/transform_broadcaster.h>

namespace apriltags_ros{


class AprilTagDescription{
 public:
  AprilTagDescription(int id, double size, std::string &frame_name):id_(id), size_(size), frame_name_(frame_name){}
  double size(){return size_;}
  int id(){return id_;} 
  std::string& frame_name(){return frame_name_;} 
 private:
  int id_;
  double size_;
  std::string frame_name_;
};


class AprilTagDetector{
 public:
  AprilTagDetector(ros::NodeHandle& nh, ros::NodeHandle& pnh);
  ~AprilTagDetector();
 private:
  void imageCb(const sensor_msgs::ImageConstPtr& msg,const sensor_msgs::CameraInfoConstPtr& cam_info);
  std::map<int, AprilTagDescription> parse_tag_descriptions(XmlRpc::XmlRpcValue& april_tag_descriptions);
  void paramUpdatedCb(const std_msgs::StringConstPtr &param_name);
  void gposCb(const sensor_msgs::NavSatFix::ConstPtr& gpos_msg);
  void imudataCb(const geometry_msgs::TwistStampedConstPtr &imu_msg);
  void lposdataCb(const geometry_msgs::TwistStampedConstPtr &lpos_msg);
  void lidarCb(const sensor_msgs::RangeConstPtr &lidar);
  void posSetResultCb(const navigation_util::NavigationPosActionResultConstPtr &pos_set_result);

 private:
  std::map<int, AprilTagDescription> descriptions_;
  std::string sensor_frame_id_;
  image_transport::ImageTransport it_;
  image_transport::CameraSubscriber image_sub_;
  image_transport::Publisher image_pub_;
  ros::Publisher detections_pub_;
  ros::Publisher pose_pub_;
  tf::TransformBroadcaster tf_pub_;
  boost::shared_ptr<AprilTags::TagDetector> tag_detector_;
  std::string global_namespace;
  ros::Subscriber _parameter_updated_sub;
  ros::Subscriber _latlong_sub;
    ros::Subscriber _position_set_topic_sub;
  ros::Publisher _camp_site_pub;
   ///////
  ros::Subscriber imudata_sub_;
  ros::Subscriber lposdata_sub_;
  ros::Subscriber lidar_sub_;

  geometry_msgs::TwistStampedConstPtr imu_msg_data_ptr;
  geometry_msgs::TwistStampedConstPtr lpos_msg_data_ptr;
  sensor_msgs::RangeConstPtr lidar_ptr;
  ///////
  std::string apriltags_family = "16h5";
  double _last_latitude;
  double _last_longitude;
  double _takeoff_latitude;
  double _takeoff_longitude;
  ros::Subscriber _pos_set_result_sub;

};



}


#endif
