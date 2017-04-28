# Joystick
This App allows the user to send the drone velocity setpoints and control the drone as with a regular joystick (mode 2).

* Cordova/IntelliJ <br>
	Language used: HTML, JS, css.<br>
	Platforms: Android, IOS, Blackberry etc.


Download the apk and try out the app from [here](https://downloads.flytbase.com/flytos/downloads/apk/Flyt-Joystick-mode-2.apk) 

## Things to Remember

* Once you have connected to your FlytOS device using the right URL, you will be redirected to the app screen.

![app-screen](https://cloud.githubusercontent.com/assets/6880872/24093778/92f990da-0d7b-11e7-9f68-e2cd495af14b.png)

* You need to press **takeoff** before you can use the joystick to control your drone.
* The left joystick gives the drone commands to move **up down turn-left and turn-right**.
* The right joystick gives the drone commands to move **front back left and right**.
* All the commands are given with respect to the drone(front = direction of the nose/front of the drone).
* The app uses velocity_set FlytAPI to control the drone.
