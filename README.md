# FlytSamples

[FlytOS](https://flytbase.com/flytos) abstracts drone autopilot's navigation, setup and high level functions to a companion computer in the form for FlytOS [Drone APIs](http://api.flytbase.com). FlytOS uses ROS at its core and exposes APIs for non ros users as well.
FlytSamples are sample scripts/apps written using FlytOS Drone APIs in ROS, C++, Python, RESTful and WebSockets. To replicate these samples you need to install recent version of FlytOS for your companion computer. FlytOS supports several [companion computers](https://flytbase.com/flytos/#companion-computer). For instructions on setting up FlytOS please refer the [documentation](http://docs.flytbase.com/docs/FlytOS/GettingStarted.html).

**CPP-Python-ROS Apps:**
These apps run onboard the companion computer (on the drone) running FlytOS. These are ROS nodes or scripts written in CPP/Python. This is preferred option for real-time processing e.g. obstacle avoidance, object tracking etc.

**Mobile Apps:**
These are mobile apps built in native languages like Java for Android or using cross-platform frameworks like Cordova. These apps run on a ground device and communicate with the drone using RESTful and WebSocket APIs. Download Mobile [Drone SDK](https://flytbase.com/flytos/#flytsdk) to develop mobile applications for your drone.

**Web Apps:**
These are web apps that can either be deployed onboard the companion computer (on the drone) running FlytOS or on a remote server. Web apps provide an easy way to interact with the drone. These apps use the RESTful and Websocket APIs. Download Web [Drone SDK](https://flytbase.com/flytos/#flytsdk) to develop web applications for your drone.

**Sample Projects:**
These are sample projects built for specific use cases and employ a mix of above Drone APIs. They provide a good demonstration of how onboard and remote apps can be combined to build a complete drone application.

Refer to [FlytBase Detailed documentation]( http://docs.flytbase.com/) to start developing your own applications. Participate in Flytbase [drone forums](http://forums.flytbase.com/) to discuss about your app or to raise any issues. Join our facebook group to get in touch with the [FlytOS application developers community](https://www.facebook.com/groups/flytos/
).
