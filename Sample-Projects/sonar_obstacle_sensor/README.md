# Obstacle_detection__HCSR04
Upto 6 HCSR04 sensors with arduino, to detect obstacles from 6 directions, publishing data into ROS.


![alt tag](https://cloud.githubusercontent.com/assets/10280687/17396651/ff939cdc-5a51-11e6-8a77-9b91d15594bb.JPG)

Arduino samples data from any/all of the 6 sensors at given rate and publishes in ROS. It is Tested on FlytPOD with FlytOS. But should work with any ROS setup. 

**Features:**
  1. Continuous output mode, One time poll mode for quering fresh data.
  2. Select which sensors to listen to from 6 sensors.
  3. Configurable sensor poll rate.

Contributor: Saumya Saksena, email: f2013114@hyderabad.bits-pilani.ac.in
Maintainer: Dhiraj, email: dhiraj@navstik.org


**Hardware requirements:** HCSR04 ultrasonic sensors, wires, arduino / Tiva C launchpad, USB cable, 5V power source.  

**Hardware setup:** 
  1. Print 3D parts using STL files. 
  2. Supply all sensors with separate 5V power supply. Arduino can be supplied from USB cable as well.
  3. wiring information coming soon. 

**FlytPOD / ROS side setup:**
  1. Install rosserial package on your system, by giving the following commands
      $ sudo apt-get install ros-indigo-rosserial-arduino ros-indigo-rosserial ros-indigo-rosserial-msgs ros-indigo-rosserial-client ros-indigo-rosserial-python

    NOTE: If you are using the TI TIVA C Launchpad for this application, the procedure would be a little bit different. You will have to install rosserial_tivac. You can install rosserial_tivac from source. 

      Navigate to your ROS workspace. Clone the git repository. Then build and install the package.
      
      $ cd <workspace_dir>/src
      $ git clone https://github.com/robosavvy/rosserial_tivac.git
      $ cd ..
      $ catkin_make
      $ catkin_make install

  2. Once the required packages are installed, the device becomes more or less plug-n-play. Connect the device to a USB port and the power up the sensors using a suitable power source that provides 5V.
  
  3. Now data should be published in ROS under topic 'sonar'. From terminal you can test it using

      $ rosrun rosserial_python serial_node.py /dev/ttyACM0
      $ rostopic echo sonar

    NOTE: If the first command shows that no device found on ACM0, you can disconnect the deivce from the flytpod and give the command again, or you can try with ACM1. Sometimes the ports get switched between the two.
  
  4. Make sure that FlytOS is running. In your browser open <FlytPOD's IP address>:9090/flytsonar

    You would see the GUI now. Enjoy!    
    To install the flytSonar app to your FlytOS sd card follow these instrucitons.

      i. download the source from <link>
      ii. Copy the source code to /flyt/flytapps/web/ . You will need to perform this operation as 'sudo' user.
      iii. edit apps.py file to add an entry to access the app through onboard server.
      iv. Restart FlytOS.


![alt tag](https://cloud.githubusercontent.com/assets/13434353/17547419/bfc44860-5f04-11e6-85e6-dbfcd2564dbf.png)
      
  
