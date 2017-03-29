Visual servoing using FlytOS gimbal API.
----------------------------------------

This app uses gimbal APIs to control a 3-axis gimbal in order to keep the camera (mounted on gimbal) focused on object of interest in the scene. FlytOS vision APIs are used to detect and track the object. 

Below is a youtube video showing this app running on a FlytPOD.


Requirements:
  1. Drone with PX4 autopilot firmware and PWM output pins for gimbal.
  2. Companion computer running FlytOS latest release.
  3. 3-axis gimbal with RC input support for yaw and pitch angle commands. (tested with Tarrot 3 axis gimbal)
  4. visual servoing webapp.
 
Setup instructions:
 1. Update FlytOS to get the Gimbal APIs. Simply connect your FlytPOD/companion computer to internet (client mode) to update. [Visit documentation](http://docs.flytbase.com/docs/FlytOS/GettingStarted/FlytOSUpdate.html#flytos-updates) to know more about automatic updates.
 2. Check [documentation](http://docs.flytbase.com/docs/FlytPOD/Hardware_specifications.html#gimbal) for Gimbal connection on FlytPOD.
    To setup gimbal on you autopilot refer to the [gimbal API documentation.](http://api.flytbase.com/?shell#gimbal-control) 
 3. To verify that everything is setup properly try following service call from terminal on companion computer. Replace namespace with global namespace on your companion computer.  
    `rosservice call /<namespace>/payload/gimbal_set "roll: 0.0 pitch:0.5 yaw:-0.2"`
 4. On companion computer create a folder in home directory.  
   `mkdir -p catkin_ws/src`
 5. Download and copy vis_servoing folder to caktin_ws/src/ directory.  
 6. Compile the vis_servoing package.  
    `cd catkin_ws`  
    `catkin_make`  
 7. Source the compiled package.  
    `source devel/setup.bash`  
    If you want this packages to be sourced automatically you can add it to bashrc.
 8. Connect camera (which is mounted on gimbal) to companion computer using USB cable. 
 9. By default FlytOS automatically connects to any camera available at /dev/video0 when it is booting up. If you connected camera after FlytOS was launched then launch the cam_api as shown below.  
    `roslaunch vision_apps cam_api.launch`  
 10. In case you want to change the camera capture settings, edit following launch file.  
    `/flyt/flytos/flytcore/share/vision_apps/launch/cam_api.launch`
 11. FlyOS vision API's provide two different detection and tracking algorithms. Color and OpenTLD based.
 12. Launch object tracking node.  
    `roslaunch vision_apps object_tracking.launch global_namespace:=flytsim`
 13. If you want to use OpenTLD based tracker then follow instruction given below to run OpenTLD:
     * Clone FlytOpenTLD repo from https://github.com/flytbase/flyt_open_tld_3d.git
     * It is a ROS project, so compile it using the 'catkin_make' command
     * After compilation, source the repo using command 'source \<path to repo\>/devel/setup.bash'
     * Launch OpenTLD using command 'roslaunch open_tld_3d open_tld_3d.launch global_namespace:=flytsim'
     * Once launched, you can use it through the Flyt Servoing web app
     * To get more details on this project, visit 'https://github.com/flytbase/flyt_open_tld_3d/tree/master/src'
 14. Install pid_controller package on companion computer. (You need internet on companion computer for installing this package.)  
     `sudo pip install pid_controller`
 15. In a terminal source vis_servoing package as shown above. Then run visual servoing app.  
     `rosrun vis_servoing vis_servoing.py`
 16. Download and copy the folder vis_servoing_web_app to your laptop.
 17. Connect your laptop to the same wifi network as your companion computer. Open the web app in browser.
 18. Follow instructions given below to use the web UI.
     * Enter the Url to the FlytOS system in the web app and click on connect.
     * Click on the start button button to get the video stream.
     * Select an object to track in the video stream.
     * In the Track/Detect mode on the right hand side select on of the methods circle/detector/TLD and tune their parameters to identify the object according to the method.
     * In the Inspect mode you can observe the centroid coordinates of the detected object.
     * In the Visual servoing method you can adjust the parameters to make your camera attached to a gimbal to follow the object in view.
 19. Select an object to track. Gimbal will start following the object as it moves.
 20. If you find the gimbal overshooting or not able to point at the object properly then try changing the PID parameters from the web UI.
 
 
 Help: 
 For any issues use our [forums](forums.flytbase.com). Joing our [facebook group](https://www.facebook.com/groups/flytos/) to stay tuned with upcoming sample apps and interesting applications. 
