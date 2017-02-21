
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
var greenThreshold=2.5, yellowThreshold=0.5;

/*try{
 marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.CIRCLE,scale: 5, fillColor: 'red',strokeColor: 'red',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: false});

 console.log("Came here");


}

catch(err){

$("#msg").html("No internet connection:  " + err);

$("#msg").show();
$("#msg").fadeOut(2000);


}*/

$(".battery").click(function(){
    $(".battery-window").toggle(200);
    $(".attitude-window").hide(200);
    $(".gps-window").hide(200);
    $(".connection-window").hide(200);

});

$(".attitude").click(function(){
    $(".attitude-window").toggle(200);
    $(".battery-window").hide(200);
    $(".gps-window").hide(200);
    $(".connection-window").hide(200);

});

$(".gps").click(function(){
    $(".gps-window").toggle(200);
    $(".battery-window").hide(200);
    $(".attitude-window").hide(200);
    $(".connection-window").hide(200);

});
$(".connection-status").click(function(){
    $(".connection-window").toggle(200);
    $(".battery-window").hide(200);
    $(".attitude-window").hide(200);
    $(".gps-window").hide(200);
});




$(document).ready(function(){
    rosInitialize();
    ctx=$("#myCanvas")[0].getContext("2d");
    ctx.beginPath();
    ctx.arc(15,15,13,0,2*Math.PI);
    ctx.lineWidth=3;
    ctx.strokeStyle="#fff";
    ctx.stroke();
    ctx.font="bold 12px Arial";
    ctx.fillStyle="white";
    ctx.fillText("100",5,18);
    function checkWidth(){
        if($(window).width()<$(window).height()){
            var left1= ($(window).width()-200)/2;
            var top1= ((($(window).height()-40)/2)-200)/2+40;
            var left2=left1;
            var top2=3*top1+120;
            $(".sat").hide();
            $(".alt").hide();
            $(".guidance-box").attr('style','left:'+($(window).width()-250)/2+"px;top:80px;");
            $(".val-data").attr('style','left:'+($(window).width()-200)/2+'px;top:370px');

        }else{
            var left1= (($(window).width()/2)-200)/2;
            var top1=(($(window).height()-40)-200)/2+40;
            var left2=left1*3+200;
            var top2=top1;
            $(".sat").show();
            $(".alt").show();
//            $(".guidance-box").attr('style','left:20px;');
//            $(".val-data").attr('style','left:300px;');
            $(".guidance-box").attr('style','top:'+(($(window).height()-250)/2+20)+"px;left:50px;");
            $(".val-data").attr('style','top:'+(($(window).height()-150)/2+20)+'px;left:370px');
        }
    }
//            console.log()

    checkWidth();
    $(window).resize(checkWidth);


    


});



function socketCallback(){

    var listenerBatteryStatus = new ROSLIB.Topic({
            ros :ros,
            name : '/'+namespace+'/mavros/battery',
            messageType : 'sensor_msgs/BatteryState',
            throttle_rate: 500
    });

    listenerBatteryStatus.subscribe(function(message) {
        $("#voltage").html("Volt: &nbsp &nbsp  &nbsp &nbsp &nbsp"+round(message.voltage,2)+" V");
        $("#current").html("Current:  &nbsp &nbsp &nbsp"+round(message.current,2)+" A");
        $("#remaining").html("Remaining: "+round(message.percentage,2)*100+" %");
        ctx.clearRect(0,0,30,30);
        ctx.beginPath();
        ctx.arc(15,15,13,Math.PI*1.5,(round(message.percentage,2)*2+1.5)*Math.PI);
        ctx.lineWidth=3;
        ctx.strokeStyle="#fff";
        ctx.stroke();
        if ((round(message.percentage,2)*100)>=100)
            ctx.fillText("100",5,18);
        else
            ctx.fillText(round(message.percentage,2)*100,8,18);


    });


    var listenerAttitude = new ROSLIB.Topic({
        ros :ros,
        name : '/'+namespace+'/mavros/imu/data_euler',
        messageType : 'geometry_msgs/TwistStamped',
        throttle_rate: 500
    });
    listenerAttitude.subscribe(function(message){
        z1deg = round(message.twist.linear.z,3)* ( 180 / Math.PI);

       $('.roll-data').html("Roll: &nbsp "+ round(message.twist.linear.x,3)+" &#0176;");
       $('.pitch-data').html("Pitch: &nbsp "+ round(message.twist.linear.y,3)+" &#0176;");
       $('.yaw-data').html("Yaw: &nbsp "+ round(message.twist.linear.z,3)+" &#0176;");

        if(round(message.twist.linear.y,3)>-0.75 & round(message.twist.linear.y,3)<0.75 ){
            var calTop=parseInt(50+round(message.twist.linear.y,3)*54);
            $(".land").css({top: calTop+"px"});
        }

        $(".rotate").rotate(round(message.twist.linear.x,3)*(-57.2958));
//        $(".compass").rotate(round(message.twist.linear.z,3)*(-57.2958));
    });


    var listenerGlobalPositionRaw = new ROSLIB.Topic({
        ros :ros,
        name : '/'+namespace+'/mavros/global_position/raw/fix',
        messageType : 'sensor_msgs/NavSatFix',
        throttle_rate: 1000
    });
    listenerGlobalPositionRaw.subscribe(function(message) {

        //            if(gpsTimeout)clearTimeout(gpsTimeout);
        $("#hdop").html("HDOP: &nbsp &nbsp &nbsp"+Math.sqrt(message.position_covariance[4]));
        $("#satellites").html("Satellites: &nbsp"+message.status.status);
        $(".sat").html("Sat: "+message.status.status);
    });

    var listenerLocalPosition = new ROSLIB.Topic({
        ros :ros,
        name : '/'+namespace+'/mavros/local_position/local',
        messageType : 'geometry_msgs/TwistStamped',
        throttle_rate: 500
    });

    listenerLocalPosition.subscribe(function(message) {

        $('.alt-data').html("Alt: &nbsp "+ (round(message.twist.linear.z,3)*-1)+" m");
        $('.alt').html("Alt: &nbsp "+ (round(message.twist.linear.z,3)*-1)+" m");
    });


    var listenerState = new ROSLIB.Topic({
        ros :ros,
        name : '/'+namespace+'/flyt/state',
        messageType : 'mavros_msgs/State',
        throttle_rate: 500
    });


    listenerState.subscribe(function(message) {
        $("#connection").html("Connected");
        $(".connection-status").children("img").attr("src","img/connected.png");
        clearTimeout(disconnectTimeout);

        disconnectTimeout=window.setTimeout(function(){
            $("#connection").html("Disconnected");
            $(".connection-status").children("img").attr("src","img/disconnected.png");

        },5000);
    });

    var listenerGuidance = new ROSLIB.Topic({
        ros :ros,
        name : '/guidance/obstacle_distance',
        messageType : 'sensor_msgs/LaserScan',
        throttle_rate: 0
    });


    listenerGuidance.subscribe(function(message) {
        
        // console.log(message.ranges[4]);
        $("#front-val").html(round(message.ranges[1],4));
        $("#right-val").html(round(message.ranges[2],4));
        $("#back-val").html(round(message.ranges[3],4));
        $("#left-val").html(round(message.ranges[4],4));
        if (parseFloat(message.ranges[1])>greenThreshold){
            $(".top").attr('style','background-color:green;');
        }else if(parseFloat(message.ranges[1])>yellowThreshold){
            $(".top").attr('style','background-color:yellow;');
        }else{
            $(".top").attr('style','background-color:red;');
        }


        if (parseFloat(message.ranges[2])>greenThreshold){
            $(".right").attr('style','background-color:green;');
        }else if(parseFloat(message.ranges[2])>yellowThreshold){
            $(".right").attr('style','background-color:yellow;');
        }else{
            $(".right").attr('style','background-color:red;');
        }


        if (parseFloat(message.ranges[3])>greenThreshold){
            $(".bottom").attr('style','background-color:green;');
        }else if(parseFloat(message.ranges[3])>yellowThreshold){
            $(".bottom").attr('style','background-color:yellow;');
        }else{
            $(".bottom").attr('style','background-color:red;');
        }


        if (parseFloat(message.ranges[4])>greenThreshold){
            $(".left").attr('style','background-color:green;');
        }else if(parseFloat(message.ranges[4])>yellowThreshold){
            $(".left").attr('style','background-color:yellow;');
        }else{
            $(".left").attr('style','background-color:red;');
        }
    });






    // var listenerGlobalPosition = new ROSLIB.Topic({
    //     ros :ros,
    //     name : '/'+namespace+'/mavros/global_position/global',
    //     messageType : 'sensor_msgs/NavSatFix',
    //     throttle_rate: 1000
    // });

    // listenerGlobalPosition.subscribe(function(message) {

    //     var temp=new google.maps.LatLng(parseFloat(message.latitude)-lat_offset,parseFloat(message.longitude)-long_offset);
    //     draw(marker1LatLng,temp,'#0000AA');

    //     marker1LatLng = temp;
    //     marker1.setPosition(marker1LatLng);

    //     marker1.setIcon({path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg } );
    //     marker1.setMap(map);
    // });

}

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


jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

function round(value,decimal){
    var x=Math.pow(10,decimal);
    return Math.round(value*x)/x;
}

$(".logout").click(function(){
    localStorage.removeItem("token");
    window.location.replace("index.html");

});
$(".joystick-zone1").on('touchmove',(function(e){

//    $(".nnn").html(e.touches[0].pageX+ " "+e.touches[0].pageY);
    var pos=$(this).position();
//    console.log(e.touches);
    for (var i=0;i<e.touches.length;i++){
        if(e.touches[i].pageX>(pos.left-5) && e.touches[i].pageX<(pos.left+205) && e.touches[i].pageY>(pos.top-5) && e.touches[i].pageY<(pos.top+205) ){
            $(".joystick1").attr('style','top:'+(e.touches[i].pageY-pos.top-25)+'px;left:'+(e.touches[i].pageX-pos.left-25)+'px;');

            if (e.touches[i].pageX>(pos.left+125))tright=0.5;
            else if (e.touches[i].pageX<(pos.left+75))tright=-0.5;
            else tright=0;
            if (e.touches[i].pageY>(pos.top+125))down=1;
            else if (e.touches[i].pageY<(pos.top+75))down=-1;
            else down=0;
            $(".nnn").html(tright +" "+down);
        }
    }

}));


$(".joystick-zone1").on('touchend',(function(e){

    $(".joystick1").attr('style','top:75px;left:75px;');
    tright=0;
    down=0;
}));


$(".joystick-zone2").on('touchmove',(function(e){

    var pos=$(this).position();
//    console.log(e.touches);
    for (var i=0;i<e.touches.length;i++){
        if(e.touches[i].pageX>(pos.left-5) && e.touches[i].pageX<(pos.left+205) && e.touches[i].pageY>(pos.top-5) && e.touches[i].pageY<(pos.top+205) ){
            $(".joystick2").attr('style','top:'+(e.touches[i].pageY-pos.top-25)+'px;left:'+(e.touches[i].pageX-pos.left-25)+'px;');

            if (e.touches[i].pageX>(pos.left+125))right=1;
            else if (e.touches[i].pageX<(pos.left+75))right=-1;
            else right=0;
            if (e.touches[i].pageY>(pos.top+125))front=-1;
            else if (e.touches[i].pageY<(pos.top+75))front=1;
            else front=0;
//            $(".nnn").html(right +" "+front);
        }
    }

}));

$(".joystick-zone2").on('touchend',(function(e){

    $(".joystick2").attr('style','top:75px;left:75px;');
    right=0;
    front=0;
}));
setInterval(callVelocity,500);

function callVelocity(){
    var newValues=[front,right,down,tright];
    if (newValues.toString()!=oldValues.toString()){
        if (newValues.toString()==="0,0,0,0")
            positionHold();
        else
            velocitySetpoint(newValues);
        oldValues=newValues;
    }
}

function velocitySetpoint(values){
    var msgdata={};
    msgdata["twist"]={};
    msgdata.twist["twist"]={};
    msgdata.twist.twist["linear"]={};
    msgdata.twist.twist.linear["x"]=parseFloat(values[0]);
    msgdata.twist.twist.linear["y"]=parseFloat(values[1]);
    msgdata.twist.twist.linear["z"]=parseFloat(values[2]);
    msgdata.twist.twist["angular"]={};
    msgdata.twist.twist.angular["z"]=parseFloat(values[3]);
    msgdata["tolerance"]=2.00;
    msgdata["async"]=true;
    msgdata["relative"]=false;
    if (values[3]==0)msgdata["yaw_rate_valid"]=false;
    else msgdata["yaw_rate_valid"]=true;
//    console.log(msgdata);

    $.ajax({
        type: "POST",
        dataType: "json",
        headers: { 'Authentication-Token': token },
        data: JSON.stringify(msgdata),
        url: restPath+"/ros/"+namespace+"/navigation/velocity_set",
        success: function(data){
            console.log(data);
            if (data.success){
                console.log("velocity set -- "+ msgdata.twist.twist.linear.x+" "+ msgdata.twist.twist.linear.y+" "+ msgdata.twist.twist.linear.z);
            }
        }
    });

}

function positionHold(){
    $.ajax({
        type: "GET",
        headers: { 'Authentication-Token': token },
        dataType: "json",
        url: restPath+"/ros/"+namespace+"/navigation/position_hold",
        success: function(data){
            if (data.success){
                console.log("position hold");
            }
        }
    });

}


$("#button-takeoff").click(function(){
    var msgdata={};
    msgdata["takeoff_alt"]=parseFloat($("#alt").val());
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': token },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/take_off",
       success: function(data){console.log(data);
           if(data.success){
                $(".toast").html("System Taking off!!");
                $(".toast").show();
                setTimeout(function(){
                    $(".toast").hide(20);
                },3000);

           }
           else{
                $(".toast").html("Take Off Rejected! Retry!!");
                $(".toast").show();
                setTimeout(function(){
                    $(".toast").hide(20);
                },3000);

           }
       },
       error: function(){
            $(".toast").html("Failed to contact FlytPOD! Retry!!");
            $(".toast").show();
            setTimeout(function(){
                $(".toast").hide(20);
            },3000);
       }
   });


})
$("#button-land").click(function(){
    $.ajax({
           type: "GET",
           headers: { 'Authentication-Token':token },
           dataType: "json",
           url: restPath+"/ros/"+namespace+"/navigation/land",
           success: function(data){

               if(data.success){
                    $(".toast").html("System Landing!");
                    $(".toast").show();
                    setTimeout(function(){
                        $(".toast").hide(20);
                    },3000);
               }
               else{
                    $(".toast").html("Land Rejected by FlytPOD! Retry!!");
                    $(".toast").show();
                    setTimeout(function(){
                        $(".toast").hide(20);
                    },3000);
               }
           },
           error: function(){
                $(".toast").html("Failed to contact FlytPOD! Retry!!");
                $(".toast").show();
                setTimeout(function(){
                    $(".toast").hide(20);
                },3000);
           }
    });

})


function initMap() {

        myLatlng = new google.maps.LatLng(18.5940829,73.91060829999999);
        marker1 = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg  },disableDoubleClickZoom: true});

        marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.CIRCLE,scale: 5, fillColor: 'red',strokeColor: 'red',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: true});

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 19,
          center: myLatlng,
          zoomControl: false,
          streetViewControl: false,
          disableDoubleClickZoom: false,
          mapTypeControl: false


        });

            isinitMap=1;

}


function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;


    if(gps_follow){
        console.log("Following");
        followSetpoint(latitude,longitude,parseFloat($("#alt").val()));
    }

    //console.log("Latitude : " + latitude + " Longitude: " + longitude);

    count++;
//    $("#lat").html("lat : " + latitude);
//    $("#long").html( "long : " + longitude);

     if(isinitMap){
         console.log(latitude.toString());
         console.log(longitude.toString());
        latlng = new google.maps.LatLng(latitude,longitude);
        marker.setPosition(latlng);
        marker.setMap(map);

     }

 }
  function errorHandler(err) {
     if(err.code == 1) {
        alert("Error: Access is denied!");
     }

     else if( err.code == 2) {
        alert("Error: Position is unavailable!");
        console.log(err.toString());
     }
  }

  function followSetpoint(x,y,z){console.log(x+" "+y+" "+z);

      var msgdata = {};
      msgdata["twist"]={};
      msgdata.twist["twist"]={};
      msgdata.twist.twist["linear"]={};
      msgdata.twist.twist.linear["x"]=parseFloat(x+lat_offset);
      msgdata.twist.twist.linear["y"]=parseFloat(y+long_offset);
      msgdata.twist.twist.linear["z"]=parseFloat(z);
      msgdata.twist.twist["angular"]={};
      msgdata.twist.twist.angular["z"]=0;
      msgdata["yaw_valid"]=false;
      msgdata["async"]=true;
      $.ajax({
              type: "POST",
              dataType: "json",
              headers: { 'Authentication-Token': token },
              data: JSON.stringify(msgdata),
              url: restPath+"/ros/"+namespace+"/navigation/position_set_global",
              success: function(data){
              if (data.success){
                  console.log("success")
                  }
              }


          });
  }


$(".start").click(function(){

    gps_follow=1;
    $(".toast").html("Follow me enabled!!");
    $(".toast").show();
    setTimeout(function(){
        $(".toast").hide(20);
    },3000);

});

$(".stop").click(function(){
    gps_follow=0;
    positionHold();
    $(".toast").html("Follow me disabled!!");
    $(".toast").show();
    setTimeout(function(){
        $(".toast").hide(20);
    },3000);

});
$(".lat-plus").click(function(){


    if(gps_follow)
    {
        lat_offset += parseFloat($("#offset").val())*0.00001;
        console.log(lat_offset);
    }
});


$(".lat-minus").click(function(){

    if(gps_follow)
    {

        lat_offset -= parseFloat($("#offset").val())*0.00001;
        console.log(lat_offset);

    }
});

$(".long-plus").click(function(){

     if(gps_follow)
     {

        long_offset += parseFloat($("#offset").val())*0.00001;
        console.log(long_offset);

    }

    });

$(".long-minus").click(function(){

    if(gps_follow)
    {

        long_offset -= parseFloat($("#offset").val())*0.00001;
        console.log(long_offset);

    }

});


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

$(".nudge").click(function(){

    $(".nudge-box").toggle(100);
});
