# Joystick
This App allows the user to send the drone velocity setpoints and control the drone as with a regular joystick(mode 2).

Download and test out the app from [here](https://downloads.flytbase.com/flytos/downloads/webApps/Joystick.zip).

## Things to Remember

* Once you have connected to your FlytOS device using the right URL, you will be redirected to the app screen.

![web-app-screen](https://cloud.githubusercontent.com/assets/6880872/24096551/18c80258-0d88-11e7-9d3c-4704748b5a2b.png)


* You need to press **takeoff** before you can use the joystick to control your drone.
* The left joystick gives the drone commands to move **up down turn-left and turn-right**.
* The right joystick gives the drone commands to move **front back left and right**.
* All the commands are given with respect to the drone(front = direction of the nose/front of the drone).
* The app uses velocity_set API to control the drone.
