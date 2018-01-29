# Sample App
This App allows the user to send the drone velocity setpoints and control the drone as with a regular joystick.

	
## Things to Remember

* Once you have connected to your FlytOS device using the right URL, you will be redirected to the app screen.
<img  style='margin:300px;' src="https://user-images.githubusercontent.com/33481219/35508070-08f88192-0515-11e8-8322-099fb5915676.png" width="500" >

<img  style='margin:300px;' src="https://user-images.githubusercontent.com/33481219/35508079-0d61a826-0515-11e8-8274-529a8d6257d4.png" width="500" >

* You need to press **takeoff** before you can use the joystick to control your drone.

* The left joystick gives the drone commands to move **front back left and right**.

* The right buttons gives the drone commands to move **up down**.

* All the commands are given with respect to the drone(front = direction of the nose/front of the drone).

* The app uses velocity_set FlytAPI to control the drone.
