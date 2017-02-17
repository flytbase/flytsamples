## Flyt-follow

This is a sample web app, to be used with flytsim and also with any device runing FlytOS. This app allows the user to tell the drone to follow the GPS location of the device running the application. As an additional feature we have also provided the capaility to give custom targets by double clicking on the map for testing it out, just in case your device location is very far from the drone location. (drone location is Navistik Labs in flytsim).

## Using the Application

To use the application these are the steps that need to be followed:

- You need to be logged in to [flytsim(cloud)](https://flytsim.flytbase.com) with the provided credentials.
- Wait for your drone to spawn and click on the takeoff button. This should make your drone hover at a height of 5 mts above ground.
- Make sure you are logged in with a drone spawned for you for the whole time you are testing this or any other app in flytsim.
- Double click on the index.html file from the app folder and launch the Flyt-follow app on your local system.
- Again login with the same credentials you used to login into flytsim(cloud).
- You should see a blue marker that marks your drone location with the name of your drone on the infowindow of the marker.
- On the left hand side you have two buttons, one pans and zooms into the current location of the drone and second is a switch to start and stop the drone from following the devie location.
- You can double click somewhere nearby and see the drone go to that location.
- Every setpoint you give is currently set to 10mts height you can also give it a custom height from the right corner.

## Building your own Application 

You can also build your own custom app and test it on your drone on flytsim(cloud) using all the different APIs provided (here)[docs.flytbase.com]. The main steps to follow for going forward in this direction is as follows:

- This app has a web SDK provided with some important libraries that contain some predefined functions and websocket initialization available for you in `js` folder. Copy the folder as it is in your app and move forward.
- All the user side of the code goes in `index.js`.
- The first thing you need to do is make the login function call `login(<username>,<password>)` either through a front-end for accepting these values or through a hardcoded method. On successful login a `token` and `namespace` both of which required to make any REST API calls from the [documentation](http://docs.flytbase.com/docs/FlytAPI/REST_WebsocketAPIs.html) are now available in sessionStorage for you to use throughtout the app.
- On successful login a callback function `afterLogin` is called which runs soon after. You can have your app screen open up in this part or any other piece of code that you want to run after you login.
- The `socketCallaback` function contains all the subscription code for different [topics](http://docs.flytbase.com/docs/FlytAPI/REST_WebsocketAPIs.html#telemetry-apis) available. You can add or remove topics subscription here.  


