# Obstacle_detection__HCSR04
This  demo app uses upto 6 HCSR04 distance sensors connected to an Arduino, to detect obstacles from 6 directions, and publish the distance data into ROS. Also included is a sample web app that  visualizes live data received from the distance sensor. Please note that this app just makes the distance data available in FlytOS. If you want your drone to have obstacle avoidance capabilities, you will have to write a custom onboard application that consumes the sonar data and produces an obstacle avoidance behavior. 

![alt tag](https://cloud.githubusercontent.com/assets/10280687/17396651/ff939cdc-5a51-11e6-8a77-9b91d15594bb.JPG)

Arduino samples data from any/all of the 6 sensors at given rate and publishes in ROS. The data is made available on the `/sonar` topic in FlytOS. 

### Features:
  1. Continuous output mode, One time poll mode for quering fresh data.
  2. Select which sensors to listen to from 6 sensors.
  3. Configurable sensor poll rate.

Contributor: Saumya Saksena, email: f2013114@hyderabad.bits-pilani.ac.in
Maintainer: Dhiraj, email: dhiraj@navstik.org


### Hardware requirements: 
HCSR04 ultrasonic sensors, wires, Arduino Uno, USB cable, 5V power source.  

### Hardware setup:
  1. Print 3D parts using STL files. 
  2. Supply all sensors with separate 5V power supply. Arduino can be supplied power from a USB cable connected to the companion computer.
  3. Connect the echo and trigger pins of the sensors  to the Arduino pins as follows. If you want the ordering to be different, edit the suitable lines in the `sonar_jig_6.ino` file.  


| Direction     | Echo Pin      | Trigger |
| ------------- |:-------------:| -------:|
| Top           | 9             | 2       |
| Bottom        | 8             | 3       |
| Rear          | 11            | 6       |
| Left          | 10            | 7       |
| Right         | 13            | 4       |
| Front         | 12            | 5       |


### Arduino Setup:

Install the NewPing and ros_lib Arduino libraries on your computer. You can follow [this link.](http://wiki.ros.org/rosserial_arduino/Tutorials/Arduino%20IDE%20Setup) You can then compile and upload the sonar_jig_6.ino file on your Arduino. 

### FlytPOD / ROS side setup:
  1. Install rosserial package and related dependencies on your FlytPOD/Companion computer by giving the following commands:

```bash
$ sudo apt-get install ros-kinetic-rosserial-arduino ros-kinetic-rosserial ros-kinetic-rosserial-msgs ros-kinetic-rosserial-client ros-kinetic-rosserial-python
```

  2. Once the required packages are installed, the device becomes more or less plug-n-play. Connect the device to a USB port and the power up the sensors using a suitable power source that provides 5V.
  
  3. Now data should be published in ROS under topic 'sonar'. From terminal you can test it first starting the node in your companion computer's terminal using the command:

```bash
$ rosrun rosserial_python serial_node.py /dev/ttyACM0
```

  And then view the raw data in the CC's terminal by typing:

````
$ rostopic echo sonar
````

   NOTE: If the first command shows that no device found on ACM0, you can disconnect the deivce from the companion computer and give the command again, or you can see which port the Arduino shows up as by running the command `ls /dev/ttyACM*` on your companion computer.
  
### Setting up the Web App:
Refer this [link](http://docs.flytbase.com/docs/FlytOS/Developers/BuildingCustomApps/RemoteWeb.html#deploying-web-app-onboard) on how to deploy a custom webapp. For `flytsonar`, the steps are as follows: 

i. Download this source code on your companion computer. 

ii. Copy the `flytsonar` folder to the location `/flyt/userapps/web_user/` . You will need to perform this operation as a sudo user

iii. Edit `/flyt/useraps/web_user/apps.py` file to add an entry to access the app through onboard server. The contents of the file would be:
```python
from flask import Blueprint, render_template, Flask
from .flytsonar.views import flytsonar

def register_user( main_app ):
  main_app.register_blueprint(flytsonar,url_prefix='/flytsonar')
```

iv. Restart FlytOS.

Once FlytOS is running. In your browser open the following link 

```  
companion-computer's-IP-address/flytsonar
```

You would see the GUI now. Enjoy!


![alt tag](https://cloud.githubusercontent.com/assets/13434353/17547419/bfc44860-5f04-11e6-85e6-dbfcd2564dbf.png)
      
  
