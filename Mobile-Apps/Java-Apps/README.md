# Android Apps (Java)


You can download the [FlytSDK](https://github.com/flytbase/flytsamples/raw/master/Mobile-Apps/Java-Apps/FlytSDK/FlytSDK.jar) for development from here:


This is a sample app to control your drone, like you would with a physical joystick. For documentation on how to connect your app scroll down and for using the app check the readme in the app folder.


**How to Run app and Connect to drone**

1. Make sure that your mobile device running the app and the system running FlytOS are on the same network.
2. If your network does not have internet or you are connecting to FlytPi(or other device running FlytOS) in AP mode make sure your mobile device **Data connection is turned off. This helps for enabling communication over local network.**
3. Enter the URL(IP) of the system running FlytOS in the URL box that shows up and click on connect.

Once you have connected to your FlytOS device using the right URL, you will be redirected to the app screen.

4. You need to press takeoff before you can use the joystick to control your drone.
5. The left joystick gives the drone commands to move front back left and right.
6. The right buttons gives the drone commands to move up down.
7. All the commands are given with respect to the drone(front = direction of the nose/front of the drone).
8. The app uses velocity_set FlytAPI to control the drone.

<img  style='margin:300px;' src="https://user-images.githubusercontent.com/33481219/35508070-08f88192-0515-11e8-8322-099fb5915676.png" width="500" >

<img  style='margin:300px;' src="https://user-images.githubusercontent.com/33481219/35508079-0d61a826-0515-11e8-8274-529a8d6257d4.png" width="500" >
