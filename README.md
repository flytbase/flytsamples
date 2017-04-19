# FlytSamples

FlytOS abstracts drone autopilot's navigation, setup and high level functions to a companion computer in the form for FlytOS [Drone APIs](http://api.flytbase.com) . FlytOS uses ROS at its core and exposes APIs for non ros users as well.
FlytSamples are sample scripts/apps written using FlytAPIs in ROS, C++, Python, RESTful and WebSockets. To replicate these samples you need to install recent version of FlytOS for your companion computer. FlytOS supports several companion computers as listed here http://flytbase.com/flytos/. For instructions on setting up FlytOS please refer the [documentation](http://docs.flytbase.com/docs/FlytOS/GettingStarted.html).

**CPP-Python-ROS Apps:**
These apps run onboard the companion computer (on the drone) running FlytOS. These are ROS nodes or scripts written in CPP/Python. This is preferred option for real-time processing e.g. obstacle avoidance, object tracking etc.

**Mobile Apps:**
These are mobile apps built in native languages like Java for Android or using cross-platform frameworks like Cordova. These apps run on a ground device and communicate with the drone using RESTful and WebSocket APIs.

**Web Apps:**
These are web apps that can either be deployed onboard the companion computer (on the drone) running FlytOS or on a remote server. Web apps provide an easy way to interact with the drone. These apps use the RESTful and Websocket APIs.

**Sample Projects:**
These are sample projects built for specific use cases and employ a mix of above APIs. They provide a good demonstration of how onboard and remote apps can be combined to build a complete drone application.

Use our forums at http://forums.flytbase.com/ for any issues. Detailed documentation is available at http://docs.flytbase.com/ 
Join our facebook group to get in touch with the FlytOS application developers community - https://www.facebook.com/groups/flytos/

