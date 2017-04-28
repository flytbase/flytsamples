# Joystick
This App allows the user to send the drone velocity setpoints and control the drone as with a regular joystick (mode 1).


Download the .apk and try out the app from [here](https://downloads.flytbase.com/flytos/downloads/apk/Flyt-Joystick-mode-1.apk) 

## Things to Remember

* Once you have connected to your FlytOS device using the right URL, you will be redirected to the app screen.

<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395143/431aab0c-13bc-11e7-8e56-0832494a2e02.png" width="500" >

* You need to press **takeoff** before you can use the joystick to control your drone.
* The left joystick gives the drone commands to move **up down turn-left and turn-right**.
* The right joystick gives the drone commands to move **front back left and right**.
* All the commands are given with respect to the drone(front = direction of the nose/front of the drone).
* The app uses velocity_set FlytAPI to control the drone.
