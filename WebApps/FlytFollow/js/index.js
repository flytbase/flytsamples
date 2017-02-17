
var namespace, bodyFrame=false;
var currentLocationGCS, destinationMarker;
var map,line=[], z1deg, z1;
var pi=Math.PI;
var currentLocationGCSLatLng ,followMeFlag=0;;
var image123="images/quad_icon.png";

$(document).ready(function(){


  //Used for drone to fllow the device gps location
  // not supported in Chrome 50 and above unless page is served with https

    setTimeout(function(){
        if(navigator.geolocation){
            // timeout at 60000 milliseconds (60 seconds)
            var options = {timeout :60000, enableHighAccuracy: true};
            geoLoc = navigator.geolocation;
            watchID = geoLoc.watchPosition(followMe, errorHandler, options);
        }
    },3000);


});

//Funtion called when using device location to follow 
function followMe(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    if (followMeFlag){

        destinationMarker.setPosition(new google.maps.LatLng(latitude,longitude));
        destinationMarker.setMap(map);
        followSetpoint(new google.maps.LatLng(latitude,longitude));
    }
}


function errorHandler(err) {
    if(err.code == 1) {
       alert("Error: GPS Access is denied!");
    }

    else if( err.code == 2) {
       alert("Error: Position is unavailable!");
       // console.log(err);
    }
 }

//click event for login button which call the predefined login function with username and password as parameters.
$("#login-button").click(function(){

    login($("#input-user").val(),$("#input-pass").val());
});

$(".current-loc-button").click(function(){
    map.setCenter(currentLocationGCSLatLng);
  	map.setZoom(18);

});

$(".follow-button").click(function(){
    if($(this).hasClass("start-follow")){
        $(this).removeClass("start-follow");
        $(this).addClass("btn-success");
        $(this).addClass("stop-follow");
        $(this).prop('title','Click to Stop Follow');
        followMeFlag=1;

    }else{

        $(this).addClass("start-follow");
        $(this).removeClass("btn-success");
        $(this).removeClass("stop-follow");
        $(this).prop('title','Click to Start Follow');
        followMeFlag=0;
        positionHold();
    }

});


//The call back function which runs after a successful login REST call
function afterLogin(data){
    if (data.response.errors){
        if (data.response.errors.email){

            $(".toast").html(data.response.errors.email[0]);
            $(".toast").show();
            setTimeout(function(){
                $(".toast").hide(20);
            },3000);
        }else if(data.response.errors.password){

            $(".toast").html(data.response.errors.password[0]);
            $(".toast").show();
            setTimeout(function(){
                $(".toast").hide(20);
            },3000);
        }

    }else{
        $("#login").hide();
        $("#main").show(200);
    }
}

//REST call for giving the drone position setpoint
function followSetpoint(latlng){
    var msgdata = {};
    msgdata["twist"]={};
    msgdata.twist["twist"]={};
    msgdata.twist.twist["linear"]={};
    msgdata.twist.twist.linear["x"]=parseFloat(latlng.lat());
    msgdata.twist.twist.linear["y"]=parseFloat(latlng.lng());
    msgdata.twist.twist.linear["z"]=parseFloat($("#input-alt").val());
    msgdata.twist.twist["angular"]={};
    msgdata.twist.twist.angular["z"]=0;
    msgdata["yaw_valid"]=false;
    msgdata["async"]=true;
    $.ajax({
        type: "POST",
        dataType: "json",
        headers: {'Authentication-Token': sessionStorage.getItem('token')},
        data: JSON.stringify(msgdata),
        url: restPath+"/ros/"+namespace+"/navigation/position_set_global",
        success: function(data){
        if (data.success){
            console.log("success")
            }
        }
    });
}


//REST call to make the drone hover at the cureent location

function positionHold(){
    var msgdata={};
    $.ajax({
        type: "POST",
        headers: { 'Authentication-Token':sessionStorage.getItem('token')},
        dataType: "json",
        data: JSON.stringify(msgdata),
        url: restPath+"/ros/"+namespace+"/navigation/position_hold",
        success: function(data){
            console.log(data);
            if (data.success){
                console.log("position hold");
            }
        }
    });


}

//All the subscription to telemetry data is written here

function socketCallback(){

   currentLocationGCS = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg  },disableDoubleClickZoom: true});

    var myOptions = {zoom:10,center:new google.maps.LatLng(18.594,73.910),mapTypeId: google.maps.MapTypeId.ROADMAP ,disableDoubleClickZoom: true};
    map = new google.maps.Map(document.getElementById("gmap"), myOptions);
    destinationMarker= new google.maps.Marker();

    google.maps.event.addListener(map, 'dblclick', function(e){
        destinationMarker.setPosition(e.latLng);
        destinationMarker.setMap(map);
        followSetpoint(e.latLng);
    });
    var infowindow = new google.maps.InfoWindow({
          content: sessionStorage.getItem('drone')
      });


  var listenerGlobalPosition = new ROSLIB.Topic({
      ros :ros,
      name : '/'+namespace+'/mavros/global_position/global',
      messageType : 'sensor_msgs/NavSatFix',
      throttle_rate: 1000
  });


  listenerGlobalPosition.subscribe(function(message) {
      
      var temp=new google.maps.LatLng(message.latitude,message.longitude);
      draw(currentLocationGCSLatLng,temp,'#0000AA');

      currentLocationGCSLatLng = new google.maps.LatLng(message.latitude,message.longitude);
      currentLocationGCS.setPosition(currentLocationGCSLatLng);

      currentLocationGCS.setIcon({path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg } );
      currentLocationGCS.setMap(map);

      infowindow.open(map,currentLocationGCS);
  });

  var listenerImu = new ROSLIB.Topic({
      ros :ros,
      name : '/'+namespace+'/mavros/imu/data_euler',
      messageType : 'geometry_msgs/TwistStamped',
      throttle_rate: 200
  });


  listenerImu.subscribe(function(message) {
        
      z1 = round(message.twist.linear.z,3);
      z1deg = z1 * ( 180 / pi);
  });

 }

//Plotting on the map
function draw(lat1,lat2,color) {

    var flightPlanCoordinates = [
        lat1,
        lat2
    ];
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    line.push(flightPath);
    flightPath.setMap(map);
}


function round(value,decimal){
    var x=Math.pow(10,decimal);
    return Math.round(value*x)/x;
}
