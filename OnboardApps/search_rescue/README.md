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
please follow this link to the tutorial on flytbase docs.
