# ROS DemoApps

This is a ROS Package that contains rospy and roscpp demo apps that highlight the use of FlytOS Navigation APIs to control a drone. The `src/demoapp1.cpp` and `src/demoapp1.py` apps make the drone takeoff, move in a square trajectory of side length 5m, and land the drone once the entire mission is over.The `src/demoapp2.cpp` and `src/demoapp2.py` apps make the drone takeoff, move in a square trajectory of side length provided as an argument to the script and land once the entire mission is over.

## Compilation

* Download the folder and place it in the src folder of your catkin workspace in your flight computer. If you do not created a catkin workspace before, follow these steps to create one.
* We are going to name our catkin workspace catkin_ws. Create the folder by typing the following commands in your terminal:
````
$ mkdir -p ~/catkin_ws/src
$ cd ~/catkin_ws/src
````
* Copy the ros_demoapps folder in src

* You can now compile the the app by entering the following commands"
````
$ cd ~/catkin_ws/
$ catkin_make
````

* You will have to source your workspace by entering the following command
````
$ source ~/catkin_ws/devel/setup.bash
````
* You can add the above line at the end of your /etc/bash.bashrc file so that you don’t have to execute the sourcing command every time you open a new terminal. You will need sudo privileges to edit the /etc/bash.bashrc file.

## Executing the apps

To execute the roscpp apps type the following commands in your fligt computer's terminal:
````
$ rosrun ros_demoapps demoapp1_node
````
and
````
$ rosrun ros_demoapps demoapp2_node 3.0
# here '3.0' is passed as an argument, one could send any other float value.
````

And to execute the rospy apps type the following commands in your fligt computer's terminal:

````
$ rosrun ros_demoapps demoapp1.py
````

and
````
$ rosrun ros_demoapps demoapp2.py 3.0
# here '3.0' is passed as an argument, one could send any other float value.
````
[Visit developer's section](http://docs.flytbase.com/docs/FlytOS/Developers/BuildingCustomApps.html#onboard-apps) for more information on these apps.
