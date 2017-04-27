# Android Apps (Java)

These are native Android apps built using java and Android Studio. This approach provides full flexibility in terms of native support for the platform. 

You can download the SDK for development or try out the apks from here:
1. [Flyt Android SDK](https://flyt.blob.core.windows.net/flytos/downloads/sdk/Flyt-Android-SDK.zip)
2. [Flyt Joystick](https://flyt.blob.core.windows.net/flytos/downloads/apk/Flyt-Joystick-mode-1.apk) (mode 1)
3. [Flyt Follow me](https://flyt.blob.core.windows.net/flytos/downloads/apk/Flyt-Follow-me.apk)

1. **Flyt Android SDK**: It is a project with all the required libraries and declarations pre integrated for you, so that you directly start building your app using Flyt-APIs. The first URL screen is in-built.
<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395018/be069160-13bb-11e7-972b-87a18146902d.png" width="300" >

2. **Joystick **: This is a sample joystick app to control your drone, like you would with a physical joystick. For documentation on how to connect your app scroll down and for using the app check the readme in the app folder.
<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395143/431aab0c-13bc-11e7-8e56-0832494a2e02.png" width="500" >

3. **Follow me **: This is a sample follow-me app using GPS based positioning. When follow-me mode is turned on, the GPS coordinates of the device running the app are used to send position commands to the drone and the drone follows the person carrying the device. 
<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395170/5cbc3472-13bc-11e7-80ac-27bd6cd7be61.png" width="300" >

* How to Run app and Connect to drone

1. Install the APK for the specific App to your mobile device.(link available inside app folder)
2. Make sure that your mobile device running the app and the system running FlytOS are on the same network.
3. If your network does not have internet or you are connecting to FlytPOD(or other device running FlytOS) in AP mode make sure your mobile device **Data connection is turned off**. This helps for enabling communication over local network.
3. Launch the app providing it appropriate permissions (e.g. access to device location).
4. Enter the URL(IP) of the system running FlytOS in the URL box that shows up and click on connect.

<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395190/6bce5a62-13bc-11e7-8d3c-e55ca3e249b7.png" width="500" >

5. The page redirects to your App.
<img  style='margin:300px;' src="https://cloud.githubusercontent.com/assets/6880872/24395143/431aab0c-13bc-11e7-8e56-0832494a2e02.png" width="500" >
