# FlytSamples

These are sample scripts/apps written using FlytAPIs in ROS, C++, Python, RESTful, WebSockets.

FlytOS abstracts drone autopilot's navigation, setup functions to a SBC (companion computer) in the form for FlytAPIs.
FlytOS uses ROS at its core and exposes APIs for non ros users as well.

To replicate above samples you need to install recent version of FlytOS for your companion computer. 
Binaries are available to download at http://flytbase.com/flytos

You can try out your scripts in flytSIM (based on Px4 SITL) before putting them on actual drone. 
FlytSIM is available to download at http://flytbase.com/flytos/ 
Note that FlytSIM does not yet work on SBC with ARM arch. So you will have to install it on your laptop/desktop.

FlytOS supports several companion computers as listed here http://flytbase.com/flytos/

Use our forums at http://forums.flytbase.com/ for any issues.
Detailed documentation is available at http://docs.flytbase.com/ .

Join our facebook group to get in touch with the FlytOS application developers community. https://www.facebook.com/groups/flytos/

The AndroidApps folder consists of some Android Apps to control your device running FlytOS.

The OnboardApps folder consists of cpp and python Apps deployed on board the device running FlytOS to be triggered remotely through APIs.

The WebAps folder consists of Web Apps to command and control your device running FlytOS.
