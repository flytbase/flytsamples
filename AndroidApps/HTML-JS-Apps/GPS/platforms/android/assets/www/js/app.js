
var restPath=localStorage.getItem("restPath");
var wsPath=localStorage.getItem("wsPath");
var namespace=localStorage.getItem("namespace");
var token=localStorage.getItem("token");
var auth=localStorage.getItem("auth");
var disconnectTimeout,down=0,tright=0,front=0,right=0;
var oldValues=[0,0,0,0],ctx;
var watchID;
var geoLoc;
var count=0;
var gps_follow=0;
var latitude,longitude,myLatlng,map,mapSmall;
var isinitMap=0;
var videoip;
var slide=true;
var marker;
var marker1;
var marker1LatLng;
var lat_offset = 0;
var long_offset = 0;
var z1deg,line=[];





$(document).ready(function(){
    rosInitialize();



    try{
        myLatlng = new google.maps.LatLng(18.5940829,73.91060829999999);
        marker1 = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg  },disableDoubleClickZoom: true});

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 19,
          center: myLatlng,
          zoomControl: false,
          streetViewControl: false,
          disableDoubleClickZoom: false,
          mapTypeControl: false


        });
       }

    catch(err){}



});


function rosInitialize(){
    ros = new ROSLIB.Ros({
      url : wsPath +'/websocket'
    });


    ros.on('connection', function() {
        console.log('Connected to websocket server.');
        setTimeout(function(){socketCallback();},3000);

    });

    ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      console.log('Connection to websocket server closed.');
    });

    if(auth){
	    var rauth = new ROSLIB.Message({
             "op": "auth",
             "mac" : localStorage.getItem('token'),

        });

	    ros.authenticate(rauth);
    }
}

function socketCallback(){



    var listenerAttitude = new ROSLIB.Topic({
        ros :ros,
        name : '/'+namespace+'/mavros/imu/data_euler',
        messageType : 'geometry_msgs/TwistStamped',
        throttle_rate: 500
    });
    listenerAttitude.subscribe(function(message){
        z1deg = round(message.twist.linear.z,3)* ( 180 / Math.PI);


    });


    var listenerGlobalPosition = new ROSLIB.Topic({
        ros :ros,
        name : '/'+namespace+'/mavros/global_position/global',
        messageType : 'sensor_msgs/NavSatFix',
        throttle_rate: 1000
    });

    listenerGlobalPosition.subscribe(function(message) {

        var temp=new google.maps.LatLng(message.latitude,message.longitude);
//        draw(marker1LatLng,temp,'#0000AA');

        marker1LatLng = temp;
        marker1.setPosition(marker1LatLng);

        marker1.setIcon({path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg } );
        marker1.setMap(map);
    });

}



function round(value,decimal){
    var x=Math.pow(10,decimal);
    return Math.round(value*x)/x;
}

$(".locate").click(function(){

    try{
        map.setCenter(marker1LatLng);
        map.setZoom(19);
    }
    catch(err){
        $(".toast").html("No Internet Connection!!");
        $(".toast").show();
        setTimeout(function(){
            $(".toast").hide(20);
        },3000);
//        document.write('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDj_GQYaoJ79l_hhishNJc-ZZkSzNWn8nE "></script>');
        initMap();
    }

});
