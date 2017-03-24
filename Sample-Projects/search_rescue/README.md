# Search and Rescue

**Mission Brief:**
Scouter drone surveys rectangular area (M x N) in a zig zag fashion, looking out for campsites (april tags laid down on the ground). When a tag with particular ID is found, it sends its current GPS coordinates to the command center. Command center receives locations of multiple camp sites and deploys rescuer drone to one with highest priority. Rescuer drone directly approaches tag site and looks out for survivors using its machine learning based classifier.


![scouter](https://cloud.githubusercontent.com/assets/10280687/22498510/ded5a470-e87e-11e6-9260-3a752b25c9e5.png)


**Requirements:**
Two drones, scouter and rescuer.
  1. Scouter: FlytOS on companion computer (equivalent to odroid XU4 or better), wifi, webcam
  2. Rescuer: FlytOS on Nvidia TX1, wifi, webcam
  3. Ground laptop: Browser, wifi
  4. Ground router: for better wifi connectivity, internet connection for maps in web app to work
  5. Multiple april tags, print tags from search_rescue/catkin_ws/src/apriltags/tags/tag16h5.pdf
  6. people

**File structure:**
  1. catkin_ws: onboard code for april tag detection on scouter.
  2. suveyor.py: onboard python script for launching scouter drone in zig zag fashion.
  3. flytSnR.zip: Ground web app for mission control, to be run on laptop.
  4. rescuer.py: onboard python script for sending rescuer to campsite.
  
**Setup instructions:**
  1. Please follow docs.flytbase.com to enable scouter and rescuer drone with FlytOS
  2. copy surveyor.py to /flyt/flytapps/onboard/install/ directory on scouter drone
  3. copy rescuer.py to /flyt/flytapps/onboard/install/ directory on rescuer drone.
  4. Unzip flytsnr.zip on your laptop and open index.html in browser.
  5. Edit catkin_ws/src/apriltags_ros/launch/example.launch to include id's for your april tags and save.
  5. copy catkin_ws folder to home directory of scouter drone.
   
         cd catkin_ws
         catkin_make
         source devel/setup.bash
         roslaunch apritags_ros example.launch
  
**Mission**:
  1. Keep scouter and rescuer close to each other, facing in same direction. Open web app on laptop, put ip address of both drones in app, upon connection you will see gps position on map. 
  2. lay down printed tags on ground, if front of the drone. Scouter will cover rectangular area (MxN) in front of drone, with current drone position as one vertex of rectangle. Side M is in the front direction of drone, side N is in right direction of drone.
  3. Switch both drones to offboard mode.
  4. click on 'deploy drones', configure parameters. in 'scout area', first argument is side M in meters, second argument is side N in meters. Height is relative height from ground, keep step size 1.0, 'Target camp site' is the tag id of high priority camp site where rescuer drone will be sent.
  5. Scouter will be deployed after ~6 secs. When high priority campsite is detected, the rescuer drone will be sent to that camp site.
  6. Upon completion scouter will land at the diagonally opposite vertex of rectangular area, rescuer will land back at home position after hovering above camp site for x secs. 
