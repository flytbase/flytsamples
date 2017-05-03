AprilTags Detection with FlytOS
=============

This project integrates April Tags detection with FlytOS. AprilTags are 2D barcodes developed for robotics applications by Ed Olson. The library detects any April tags in a given image, provides the unique ID of the tag as well as its location in the image. If the camera is calibrated and the physical size of the tag known, also provides the relative transform between tag and camera. This project is based on the [apriltags_ros](https://github.com/RIVeR-Lab/apriltags_ros/tree/indigo-devel/apriltags_ros) project. It is a package that provides a ROS wrapper for the apriltags C++ package. For more details visit [wiki](http://wiki.ros.org/apriltags_ros).

The project is modified for FlytOS as follows:
* Takes input image from FlytOS camera image topic: /<global_namespace>/flytcam/image_capture
* Publishes processed image with detected AR tags on topic: /tag_detections_image
* Can be used with any April Tags family (16h5, 36h11) by setting a parameter using FlytOS set param API: /<global_namespace>/parameters/flyt/apriltags_family

**How to use the app:**
* Clone this ROS project to your catkin workspace
* Compile the project using the catkin_make command
* Source the workspace: source ./devel/setup.bash
* Edit the launch file apriltags_ros/launch/example.launch to include id's for your april tags and save. You can also add custom names for the tags here and those will be overlayed on the image.
* Launch FlytOS (if not running already). This will start the camera capture and get the image in input topic. It will also make available the param set API.
* Launch april tags node using command: 
    roslaunch apriltags_ros example.launch
* You can view the video stream in FlytConsole video section by selecting topic: /tag_detections_image

![artag-screen](https://cloud.githubusercontent.com/assets/4656768/25661949/42b983be-3030-11e7-831a-ec815484c757.png)
