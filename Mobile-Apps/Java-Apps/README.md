# Android Apps (Java)


You can download the SDK for development or try out the apks from here:
* [FlytSDK Android](https://downloads.flytbase.com/flytos/downloads/sdk/Flyt-Android-SDK.zip)

This is a sample app to control your drone, like you would with a physical joystick. For documentation on how to connect your app scroll down and for using the app check the readme in the app folder.


**How to Run app and Connect to drone**

1. Make sure that your mobile device running the app and the system running FlytOS are on the same network.
2. If your network does not have internet or you are connecting to FlytPi(or other device running FlytOS) in AP mode make sure your mobile device **Data connection is turned off. This helps for enabling communication over local network.**
3. Launch the app providing it appropriate permissions (e.g. access to device location).
4. Enter the URL(IP) of the system running FlytOS in the URL box that shows up and click on connect.

Once you have connected to your FlytOS device using the right URL, you will be redirected to the app screen.

5. You need to press takeoff before you can use the joystick to control your drone.
6. The left joystick gives the drone commands to move front back left and right.
7. The right joystick gives the drone commands to move up down.
8. All the commands are given with respect to the drone(front = direction of the nose/front of the drone).
9. The app uses velocity_set FlytAPI to control the drone.


..<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395018/be069160-13bb-11e7-972b-87a18146902d.png" width="300" >

..<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395018/be069160-13bb-11e7-972b-87a18146902d.png" width="300" >


