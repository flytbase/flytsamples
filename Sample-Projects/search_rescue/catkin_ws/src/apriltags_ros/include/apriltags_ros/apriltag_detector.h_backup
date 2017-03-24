#ifndef APRILTAG_DETECTOR_H
#define APRILTAG_DETECTOR_H

#include <ros/ros.h>
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
  ros::Publisher _camp_site_pub;
  std::string apriltags_family = "16h5";
  double _last_latitude;
  double _last_longitude;


};



}


#endif
