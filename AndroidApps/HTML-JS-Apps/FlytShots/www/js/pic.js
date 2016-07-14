

var myLatlng,map,mapSmall, latitude, longitude;
var a, radius,lat_final,long_final;
var poly,circle,x,y,xy;
var line=[], lineSmall=[];
var x1,y1,z1;
var z1deg;
var batMin,batCells,batMax;
var videoip;
var globalLat,globalLong;
var simEnv;

var earth_rad=6371000;

var lat_radg,lon_radg,sin_lat,cos_lat;

var waypointsList=[];
var defaultAlt=5.0,defaultTime=0.0,defaultRadius=4.0,defaultOrbit=0.0,defaultYaw=0.0;
var waypoint=[],waypointSmall=[];

var pi=Math.PI;
var disconnectTimeout;
var listenerBatteryStatus, listenerState;



$(document).ready(function(){
    $(".heading").html("FlytShots");
    $(".app-container").hide();

    $(".execute").attr("disabled",true);

    $(".select_list").hide();


//    $(".list").hide();

});







$(".disconnect").click(function(){


    $(".app-container").hide();
    $(".space").show();
    $(".nav-bar").hide();
    $(".ip-div").show();
    $("#msg").html("Disconnected");
    $("#msg").show();
    $("#msg").fadeOut(1500);
    listenerBatteryStatus.unsubscribe(function(message){console.log(message);});
    listenerState.unsubscribe();
//$("#connect-page").toggle(500);


});



$("#same_device").click(function(){



});

$("#same_device").click(function(){



});

$("#new_device").click(function(){

$("#newDevice-page").show(500);

});


$(".submit").click(function(){


//    $(".nav-bar").show();
//    alert("hii");
    ip=$("#ip").val()+":9090";
    console.log(ip);
    getNamespace();
    videoip = ip.substring(0,ip.lastIndexOf(":"));
//    $(".ip-div").hide();



});


$('.pitch-down, .pitch-up, .yaw-left , .yaw-right ').bind( "touchend", function(e){
    gimbalVelocitySetpoint(0,0,0);
    $(this).addClass("button-balanced");
    $(this).removeClass("button-assertive");

});

$(".pitch-down").bind( "touchstart", function(e){
    gimbalVelocitySetpoint(0,-0.1,0);
    $(this).removeClass("button-balanced");
    $(this).addClass("button-assertive");
});
$(".pitch-up").bind( "touchstart", function(e){
    gimbalVelocitySetpoint(0,0.1,0);
    $(this).removeClass("button-balanced");
    $(this).addClass("button-assertive");
});
$(".yaw-left").bind( "touchstart", function(e){
    gimbalVelocitySetpoint(0,0,-0.2);
    $(this).removeClass("button-balanced");
    $(this).addClass("button-assertive");
});
$(".yaw-right").bind( "touchstart", function(e){
    gimbalVelocitySetpoint(0,0,0.2);
    $(this).removeClass("button-balanced");
    $(this).addClass("button-assertive");
});
function gimbalVelocitySetpoint(x,y,z){
    var msgdata = {};
                msgdata["pose"]={};
                msgdata.pose["twist"]={};
                msgdata.pose.twist["angular"]={};
                msgdata.pose.twist.angular["x"]=parseFloat(x);
                msgdata.pose.twist.angular["y"]=parseFloat(y);
                msgdata.pose.twist.angular["z"]=parseFloat(z);
                msgdata["do_rate"]=true;
                $.ajax({
                        type: "POST",
                        dataType: "json",
                        data: JSON.stringify(msgdata),
                        url: "http://"+ip+"/ros/"+namespace+"/navigation/gimbal_set",
                        success: function(data){
                        if (data.success){
                            console.log("success")
                            }
                        }
                    });
}


function initMap() {


        $(".ip-div").hide();
        $(".space").hide();
        $(".app-container").show(100);
        $("#msg").hide();
        $(".list").show(100);




        myLatlng = new google.maps.LatLng(0,0);


        mapSmall=new google.maps.Map(document.getElementById('map-small'), {
                           zoom: 16,
                           center: google.maps.LatLng(0,0),  // Center the map on Chicago, USA.
                           zoomControl: false,
                           streetViewControl: false,
                           disableDoubleClickZoom: true,
                           mapTypeControl: false


                         });

         setTimeout(function(){$("#map-small").hide();},2000);
//        $("#map-small").trigger("click");

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: myLatlng,  // Center the map on Chicago, USA.
          zoomControl: false,
          streetViewControl: false,
          disableDoubleClickZoom: true,
          mapTypeControl: false


        });






        mapDoubleClickEvent();



}


function mapDoubleClickEvent()
{
google.maps.event.addListener(map, 'dblclick', function(event){

         latitude = event.latLng.lat();
         longitude = event.latLng.lng();

        var b = new google.maps.LatLng(latitude,longitude);
//        var b=google.maps.LatLng(18.5397376,73.9063512);
        console.log("b" + b);

        //console.log(z1deg);

        $(".execute").attr("disabled",false);

        one();

        if(a=="Cable Camera"){
            addWaypoints(event.latLng);
            console.log(waypointsList);
            plotWaypoints();
            $(".orbit-now").addClass("ion-merge cable");
            $(".orbit-now").removeClass("ion-planet orbit-now");
        }

        if(a=="Orbit"){
        $(".select").trigger("change");
        drawCircle(event.latLng);
        $(".cable").addClass("ion-planet orbit-now");
        $(".cable").removeClass("ion-merge cable");


        }



        });

}

//alert("image");

$("#image-stream").click(function(){

    $("#map").hide();
    $("#map-small").show(200);
    $("#image-stream").attr("style","position:absolute;height:100%;width:100%;left:0px;top=0px;z-index:-1;");
    $("#main-controls").hide();
    $("#main-controls2").hide();


});

$("#map-small").click(function(){

    $("#map-small").hide();
    $("#map").show(200);

    $("#image-stream").attr("style","position:absolute;height:25%;top:50px;width:20%;left:150px;z-index:1000;");

    map.setCenter(new google.maps.LatLng(globalLat,globalLong));
    map.setZoom(16);
    $("#main-controls").show(200);
    $("#main-controls2").show(200);

});



$("#button-click").on('click', start_rec)


function start_rec(){
alert("start");
$("#button-click").off('click').on('click', stop_rec)
}


function stop_rec(){
alert("stop");
$("#button-click").off('click').on('click', start_rec)

}


$("#button-execute").on('click', firstClick)

function firstClick(){

console.log("first");

if(simEnv==1){

console.log("flytsim")
 one();

    if(a=="Orbit"){

        getCircumPoints();


        var string= "";

        //        for(var i=0;i<waypointsList.length;i++){
        //        string+= waypointsList[i].x_lat + " " + waypointsList[i].y_long+ " ";
        //
        //    //    console.log(string);
        //        }
                string=circle.getCenter().lat()+" "+circle.getCenter().lng()+" "+circle.getRadius()+" "+0.5+" ";



                console.log("fsim");

                var msgdata = {};
                msgdata["app_name"]="demoapp5";
                msgdata["arguments"]= string;

        //        $("#button-execute").off('click').on('click', secondClick)

                $.ajax({
                        type: "POST",
                        dataType: "json",
                        data: JSON.stringify(msgdata),
                        url: "http://"+ip+"/ros/"+namespace+"/navigation/exec_script",
                        success: function(data){
                        if (data.success){
                            console.log("success");



                             $(".square-box").hide(500);

                             $("#msg").html("Script Started Executing");
                             $("#msg").show();
                             $("#msg").fadeOut(1500);
                            }
                        }
                    });



    }

        if(a=="Cable Camera"){

            var string= "";

                    for(var i=0;i<waypointsList.length;i++){
                    string+= waypointsList[i].x_lat + " " + waypointsList[i].y_long+ " ";

                    console.log(string);
                    }
//                    string=circle.getRadius()+" "+0.5+" ";



                    console.log("cable");

                    var msgdata = {};
                    msgdata["app_name"]="demoapp6";
                    msgdata["arguments"]= string;

            //        $("#button-execute").off('click').on('click', secondClick)

                    $.ajax({
                            type: "POST",
                            dataType: "json",
                            data: JSON.stringify(msgdata),
                            url: "http://"+ip+"/ros/"+namespace+"/navigation/exec_script",
                            success: function(data){
                            if (data.success){
                                console.log("success");



                                 $(".square-box").hide(500);

                                 $("#msg").html("Script Started Executing");
                                 $("#msg").show();
                                 $("#msg").fadeOut(1500);
                                }
                            }
                        });

    }

}

if(simEnv==0){
console.log("while flying");

    one();

    if(a=="Orbit"){

        getCircumPoints();
        plotWaypoints();
        console.log("while flying");
                waypointsList[0].is_current=true;
                    var msgdata1 = {};
                    msgdata1["waypoints"]=waypointsList;

                    $.ajax({
                       type: "POST",
                       dataType: "json",
                       data: JSON.stringify(msgdata1),
                       url: "http://"+ip+"/ros/"+namespace+"/navigation/waypoint_set",
                       success: function(data){
                           if(data.success){
                           var msgdata2 = {};
                                       $.ajax({
                                          type: "POST",
                                          dataType: "json",
                                          data: JSON.stringify(msgdata2),
                                          url: "http://"+ip+"/ros/"+namespace+"/navigation/waypoint_execute",
                                          success: function(data){console.log(data);
                                              if(data.success){

                                              }
                                          },
                                                  error: function(){

                                                  }
                                       });

                           }
                       },
                               error: function(){

                               }
                    });


    }

    if(a=="Cable Camera"){
            console.log("while flying");
                    waypointsList[0].is_current=true;
                        var msgdata1 = {};
                        msgdata1["waypoints"]=waypointsList;

                        $.ajax({
                           type: "POST",
                           dataType: "json",
                           data: JSON.stringify(msgdata1),
                           url: "http://"+ip+"/ros/"+namespace+"/navigation/waypoint_set",
                           success: function(data){
                               if(data.success){
                               var msgdata2 = {};
                                           $.ajax({
                                              type: "POST",
                                              dataType: "json",
                                              data: JSON.stringify(msgdata2),
                                              url: "http://"+ip+"/ros/"+namespace+"/navigation/waypoint_execute",
                                              success: function(data){console.log(data);
                                                  if(data.success){

                                                  }
                                              },
                                                      error: function(){

                                                      }
                                           });

                               }
                           },
                                   error: function(){

                                   }
                        });


        }



}

//$(".execute").addClass("ion-pause pause");
//$(".pause").removeClass("ion-android-send execute");

// one();
//
//    if(a=="Orbit"){
//
//        getCircumPoints();
//
//
//        var string= "";
//
//        //        for(var i=0;i<waypointsList.length;i++){
//        //        string+= waypointsList[i].x_lat + " " + waypointsList[i].y_long+ " ";
//        //
//        //    //    console.log(string);
//        //        }
//                string=circle.getRadius()+" "+0.5+" ";
//
//
//
//                console.log("fsim");
//
//                var msgdata = {};
//                msgdata["app_name"]="demoapp5";
//                msgdata["arguments"]= string;
//
//        //        $("#button-execute").off('click').on('click', secondClick)
//
//                $.ajax({
//                        type: "POST",
//                        dataType: "json",
//                        data: JSON.stringify(msgdata),
//                        url: "http://"+ip+"/ros/"+namespace+"/navigation/exec_script",
//                        success: function(data){
//                        if (data.success){
//                            console.log("success");
//
//
//
//                             $(".square-box").hide(500);
//
//                             $("#msg").html("Script Started Executing");
//                             $("#msg").show();
//                             $("#msg").fadeOut(1500);
//                            }
//                        }
//                    });
//
//
//
//    }
//
//        if(a=="Cable Camera"){
//
//            var string= "";
//
//                    for(var i=0;i<waypointsList.length;i++){
//                    string+= waypointsList[i].x_lat + " " + waypointsList[i].y_long+ " ";
//
//                    console.log(string);
//                    }
////                    string=circle.getRadius()+" "+0.5+" ";
//
//
//
//                    console.log("cable");
//
//                    var msgdata = {};
//                    msgdata["app_name"]="demoapp6";
//                    msgdata["arguments"]= string;
//
//            //        $("#button-execute").off('click').on('click', secondClick)
//
//                    $.ajax({
//                            type: "POST",
//                            dataType: "json",
//                            data: JSON.stringify(msgdata),
//                            url: "http://"+ip+"/ros/"+namespace+"/navigation/exec_script",
//                            success: function(data){
//                            if (data.success){
//                                console.log("success");
//
//
//
//                                 $(".square-box").hide(500);
//
//                                 $("#msg").html("Script Started Executing");
//                                 $("#msg").show();
//                                 $("#msg").fadeOut(1500);
//                                }
//                            }
//                        });
//
//    }
//



}


function secondClick(){

console.log("second ");

$("#button-execute").off('click').on('click', firstClick)

var msgdata = {};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: "http://"+ip+"/ros/"+namespace+"/navigation/waypoint_pause",
       success: function(data){
           if(data.success){



            $(".pause").addClass("ion-android-send execute");
            $(".pause").removeClass("ion-pause pause");

            $("#msg").html("Script Stopped Executing");
            $("#msg").show();
            $("#msg").fadeOut(1500);


            }
           }
           });

}



//












$(".locate").click(function(){

mapSmall.setCenter(new google.maps.LatLng(globalLat,globalLong));
map.setCenter(new google.maps.LatLng(globalLat,globalLong));
map.setZoom(16);
})



$(".select").change(function(){
    if(circle)
        circle.setMap(null);
    deleteFligtpath();
    deleteMarkers();
    waypointsList=[];
    waypoint=[];

});

function one(){
a = $(".select").find(":selected").text();
console.log(a);


}




function drawCircle(){
var citymap = {
        city: {
         // center: circleLatLng,
          center: {lat: latitude, lng: longitude},

          population: 2714856
        }

    };

 for (var city in citymap) {
           // Add the circle for this city to the map.
             circle = new google.maps.Circle({
             strokeColor: '#FF0000',
             strokeOpacity: 0.8,
             strokeWeight: 2,
             fillColor: '#FF0000',
             fillOpacity: 0.35,
             map: map,
             center: citymap[city].center,
             radius: 30, //Math.sqrt(citymap[city].population) * 10,
             draggable: true,
             geodesic: false,
             editable: true



           });
            circle.setMap(map);
            console.log(latitude);
            console.log(longitude);


         }

google.maps.event.addListener(circle, 'radius_changed', function() {

  radius = circle.getRadius();
  console.log(circle.getRadius());
});

google.maps.event.addListener(circle, 'center_changed', function() {
  circle.getCenter();

  center_lat = circle.getCenter().lat();
  center_lng = circle.getCenter().lng();

  console.log("center lat " + center_lat);
  console.log("center long " + center_lng);


});

getCircumPoints();



}


function getCircumPoints(){
var cx=0, cy=0;


var dq, dqT;


//alert("here");

   dq = (20/circle.getRadius());
   console.log(dq);

   dqT = (2 * pi)/(Math.trunc((2 * pi)/ dq));
   console.log(dqT);

   console.log("radius" + circle.getRadius());


   centerInit();

   waypointsList=[];
   for(var i=0;i < ((2 * pi)/dqT);i++){

   x = cx + circle.getRadius() * Math.cos(i * dqT);
   y = cy + circle.getRadius() * Math.sin(i * dqT);

//   console.log(x);
//   console.log(y);



   centerConvert();

   }
   waypointsList.push(waypointsList[0]);

   console.log(waypointsList);

}

function centerInit(){


   lat_radg = latitude * (pi/180);
   lon_radg = longitude * (pi/180);
   sin_lat = Math.sin(lat_radg);
   cos_lat = Math.cos(lat_radg);
}


function centerConvert(){

    var x_rad = x / earth_rad;
    var y_rad = y / earth_rad;

    var c = Math.sqrt(x_rad * x_rad + y_rad * y_rad);

    var sin_c = Math.sin(c);
    var cos_c = Math.cos(c);

    var lat_rad;
    var lon_rad;

    lat_rad = Math.asin(cos_c * sin_lat + (x_rad * sin_c * cos_lat) / c);
    lon_rad = (lon_radg + Math.atan2(y_rad * sin_c, c * cos_lat * cos_c - x_rad * sin_lat * sin_c));
//    console.log("lat rad" + lat_rad);

    lat_final = lat_rad *(180.0/pi);

//    console.log("lon rad   " + lon_rad  );



//    console.log(lat_final);

    long_final = lon_rad *(180.0/pi);
//    console.log(long_final);

    xy = new google.maps.LatLng(lat_final, long_final);

    console.log(xy.lat());
    console.log(xy.lng());
    addWaypoints(xy);



}


function draw(lat1,lat2,color) {

    var flightPlanCoordinates = [
        lat1,
            lat2
    ];
    var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: false,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 2
    });
    var flightPathSmall = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: false,
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
    line.push(flightPath);
    flightPath.setMap(map);
    lineSmall.push(flightPathSmall);
    flightPathSmall.setMap(mapSmall);

}


function plotWaypoints(){


    deleteFligtpath();
    deleteMarkers();
    for (var i=0; i< waypointsList.length; i++){
        waypoint[i]=new google.maps.Marker({draggable:true, icon:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+(i+1)+'|e74c3c|000000',position: new google.maps.LatLng(waypointsList[i].x_lat,waypointsList[i].y_long)});
        waypointSmall[i]=new google.maps.Marker({draggable:true, icon:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+(i+1)+'|e74c3c|000000',position: new google.maps.LatLng(waypointsList[i].x_lat,waypointsList[i].y_long)});

        if(i){
            draw(new google.maps.LatLng(waypointsList[i-1].x_lat,waypointsList[i-1].y_long),new google.maps.LatLng(waypointsList[i].x_lat,waypointsList[i].y_long),'#ffff00');
        }

        waypointSmall[i].setMap(mapSmall);
        waypoint[i].setMap(map);


    }
}


function deleteFligtpath(){
    for(var i=0;i<line.length;i++){
       line[i].setMap(null);
       lineSmall[i].setMap(null);
    }
}

function deleteMarkers(){
    for(var j=waypoint.length-1;j>=0;j--){
            waypoint[j].setMap(null);
            waypoint.splice(j,1);

            waypointSmall[j].setMap(null);
            waypointSmall.splice(j,1);
        }
}
function updateWaypoint(temp){
    waypointsList[temp].x_lat=waypoint[temp].position.lat();
    waypointsList[temp].y_long=waypoint[temp].position.lng();


    plotWaypoints();
}



var c=0;
function getNamespace(){
var msgdata = {};
   $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify(msgdata),
      url: "http://"+ip+"/ros/get_global_namespace",
      success: function(data){
          if(data.success){
          initMap();

           $(".nav-bar").show();

           $("#msg").html("Connected");
                       $("#msg").show();
                       $("#msg").fadeOut(1500);

              namespace=data.param_info.param_value;
              getParam("BAT_N_CELLS");
              getParam("BAT_V_CHARGED");
              getParam("BAT_V_EMPTY");
              getParam("is_simulation_environment");

              $("#image-stream").attr("src","http://"+videoip+":8080/stream?topic=/"+namespace+"/flytcam/image_capture");
              $(".select_list").show(300);
                console.log(namespace);




              var ros = new ROSLIB.Ros({
                url : 'ws://'+ip+'/websocket'
              });               ros.on('connection', function() {
                console.log('Connected to websocket server.');
              });               ros.on('error', function(error) {
                console.log('Error connecting to websocket server: ', error);
              });               ros.on('close', function() {
              });               ros.on('close', function() {
                console.log('Connection to websocket server closed.');
              });



             listenerState = new ROSLIB.Topic({
                         ros :ros,
             //            name : '/'+namespace+'/flyt/state',
             //            messageType : 'mavros_msgs/State',
                          name : '/'+namespace+'/mavros/imu/data_euler',
                          messageType : 'geometry_msgs/TwistStamped',
                         throttle_rate: 200
                 });


                 listenerState.subscribe(function(message) {



                         clearTimeout(disconnectTimeout);
                         disconnectTimeout=window.setTimeout(function(){


                         $(".app-container").hide();
                         $(".nav-bar").hide();
                         $(".space").show();
                         $(".ip-div").show();
                         $("#msg").html("Disconnected");
                        $("#msg").show();
                        $("#msg").fadeOut(1500);
                        listenerBatteryStatus.unsubscribe(function(message){console.log(message);});

                         },2000);

                  });


              listenerBatteryStatus = new ROSLIB.Topic({
                         ros :ros,
                         name : '/'+namespace+'/mavros/battery',
                         messageType : 'mavros_msgs/BatteryStatus'
                 });

                 listenerBatteryStatus.subscribe(function(message) {
//                      $(".battery-label").html("<i class='fa fa-bolt'> </i>  "+round(message.voltage,2)+" V");
//                      $(".battery-label").removeClass("label-default");
//                     $(".battery-label").addClass("label-warning");
//
//
//
//                     $('#voltage').text(round(message.voltage,2));
//                     $('#current').text(round(message.current,2));
//                     $('#remaining').text(round(message.remaining,2));


                      var batteryPercentage=parseInt((round(message.voltage,2)-batMin)*100/(batMax-batMin));
//                     if(batteryPercentage<0){
//                         batteryPercentage=0;
//                     }
                     if(batteryPercentage<25){
                         $(".battery_full").removeClass("ion-battery-full ion-battery-half ion-battery-low");
                         $(".battery_full").addClass("ion-battery-empty");
                     }else if(batteryPercentage<50){
                         $(".battery_full").removeClass("ion-battery-full ion-battery-empty ion-battery-half");
                         $(".battery_full").addClass("ion-battery-low");
                     }else if(batteryPercentage<75){
                         $(".battery_full").addClass("ion-battery-half");
                         $(".battery_full").removeClass("ion-battery-full ion-battery-low ion-battery-empty");
                     }else{
                         $(".battery_full").removeClass("ion-battery-empty ion-battery-half ion-battery-low ");
                         $(".battery_full").addClass("ion-battery-full");
                     }

                     $(".battery_full").html(" "+batteryPercentage+"% ");
//                     $("li").attr("data-percent",(batteryPercentage+2)+"%");
//
//                     $('.progress-stat-bar li').each(function () {
//                         $(this).find('.progress-stat-percent').animate({
//                             height: $(this).attr('data-percent')
//                         }, 1000);
//                     });

                     /*Knob*/


                 });


            var listenerGlobalPosition = new ROSLIB.Topic({
                 ros :ros,
                 name : '/'+namespace+'/mavros/global_position/global',
                 messageType : 'sensor_msgs/NavSatFix',
                 throttle_rate: 1000
            });
            var marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg  },disableDoubleClickZoom: true});
            var markerSmall = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg  },disableDoubleClickZoom: true});
//                                    marker.setIcon("{path: http://google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg  }");

            var latlng ;
            var flag = 0;
            var flag1 = 0;
            var waypointsquare = [];
            marker.setMap(mapSmall);
            marker.setMap(map);


         listenerGlobalPosition.subscribe(function(message) {


                        globalLat =message.latitude;
                        globalLong =message.longitude;
                        c=c+1;
//                        console.log(c,globalLat);
//
//                        console.log(c,globalLong);
                        var temp=new google.maps.LatLng(message.latitude,message.longitude);
                        if (flag){
                            draw(latlng,temp,'#0000AA');

                        }
                        else
                            flag=1;


                        latlng = new google.maps.LatLng(message.latitude,message.longitude);
                        marker.setPosition(latlng);
                        marker.setIcon({path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg } );
                        markerSmall.setPosition(latlng);
                        markerSmall.setIcon({path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1, rotation: z1deg } );

                        markerSmall.setMap(mapSmall);
                        marker.setMap(map);

                        if(!flag1){
                        mapSmall.setCenter(new google.maps.LatLng(message.latitude,message.longitude));
                        mapSmall.setZoom(16);
                        map.setCenter(new google.maps.LatLng(message.latitude,message.longitude));
                        map.setZoom(16);

                        flag1=1;
                        }

//
//                        if(globalLat<waypointsquare[0].lat() & globalLat>waypointsquare[1].lat()& globalLong>waypointsquare[0].lng() & globalLong<waypointsquare[1].lng() ){
//                        executing=true;
//                        }



         });

         var listenerGlobalPositionRaw = new ROSLIB.Topic({
                                ros :ros,
                                name : '/'+namespace+'/mavros/global_position/raw/fix',
                                messageType : 'sensor_msgs/NavSatFix',
                                throttle_rate: 1000
                        });
                         var flag1=0;
                         var gpsTimeout;

                        listenerGlobalPositionRaw.subscribe(function(message) {
                            $("#hdop").text(Math.sqrt(message.position_covariance[4]));
                            $("#sat").text(message.status.status);
                            if(gpsTimeout)clearTimeout(gpsTimeout);

                            if(Math.sqrt(message.position_covariance[4])===0){


                            $(".locate").attr("disabled",true);
                            $(".gps_locked").attr("disabled",true);
                           // $(".gps_locked").addClass("ion-unlocked gps_unlocked");
                            //$(".gps_unlocked").removeClass("ion-locked gps_locked");

                            }
                            else if(Math.sqrt(message.position_covariance[4])<14){

                            $(".locate").attr("disabled",false);
                            $(".gps_locked").attr("disabled",false);
//                            $(".gps_unlocked").addClass("ion-unlocked gps_locked");
//                            $(".gps_locked").removeClass("ion-locked gps_unlocked");

                             }
                             else{

                           $(".locate").attr("disabled",true);
                           $(".gps_locked").attr("disabled",true);
//                           $(".gps_locked").addClass("ion-unlocked gps_unlocked");
//                           $(".gps_unlocked").removeClass("ion-locked gps_locked");
                             }
                            gpsTimeout=setTimeout(function(){

                            $(".locate").attr("disabled",true);
                            $(".gps_locked").attr("disabled",true);
                            },3000);

                         });



         var listenerLocalPosition = new ROSLIB.Topic({
                                ros :ros,
                                name : '/'+namespace+'/mavros/local_position/local',
                                messageType : 'geometry_msgs/TwistStamped',
                                throttle_rate: 200
                        });


                        listenerLocalPosition.subscribe(function(message) {
//console.log(message.twist.linear.x);
                        var xpos,ypos,zpos;
                        var xang,yang,zang;
                        var dist_home;
                        var hor_speed;

                        xpos = round(message.twist.linear.x,3);
                        ypos = round(message.twist.linear.y,3);
                        zpos = round(message.twist.linear.z,3);
                        xang = round(message.twist.angular.x,3);
                        yang = round(message.twist.angular.y,3);
                        zang = round(message.twist.angular.z,1);

                        dist_home = Math.sqrt(xpos * xpos + ypos * ypos + zpos * zpos);

                        hor_speed = Math.sqrt(xang * xang + yang * yang);

//$('#altitude').text("hii");

                        $('#altitude').text(-zpos) + "m";

                        $('#home').text(round(dist_home,1)) +"m";
                        //console.log(round(dist_home,3));
                        $('#h_speed').text(round(hor_speed,1)) +"m/s";
                        //console.log("hor" + hor_speed);
                        $('#v_speed').text(zang) + "m/s";
                        //console.log(zang);



//                                $('#posx').text(round(message.twist.linear.x,3));
//                                $('#posy').text(round(message.twist.linear.y,3));
//                                $('#posz').text(round(message.twist.linear.z,3));
//                                $('#velx').text(round(message.twist.angular.x,3));
//                                $('#vely').text(round(message.twist.angular.y,3));
//                                $('#velz').text(round(message.twist.angular.z,3));
                        });


            var listenerImu = new ROSLIB.Topic({
                                ros :ros,
                                name : '/'+namespace+'/mavros/imu/data_euler',
                                messageType : 'geometry_msgs/TwistStamped',
                                throttle_rate: 200
                        });


                        listenerImu.subscribe(function(message) {
//console.log(message.twist.linear.x);




                        x1 = round(message.twist.linear.x,3);
                        y1 = round(message.twist.linear.y,3);
                        z1 = round(message.twist.linear.z,3);
//                        xang = round(message.twist.angular.x,3);
//                        yang = round(message.twist.angular.y,3);
//                        zang = round(message.twist.angular.z,3);

//                        console.log("x is" + x1);
//                        console.log("y is" + y1);
//                        console.log("z is" + z1);

                        //z1deg = 90;
                        z1deg = z1 * ( 180 / pi);
//                        console.log("degree" + z1deg);

//$('#altitude').text("hii");




//                                $('#posx').text(round(message.twist.linear.x,3));
//                                $('#posy').text(round(message.twist.linear.y,3));
//                                $('#posz').text(round(message.twist.linear.z,3));
//                                $('#velx').text(round(message.twist.angular.x,3));
//                                $('#vely').text(round(message.twist.angular.y,3));
//                                $('#velz').text(round(message.twist.angular.z,3));
                        });






         }

         }
         });



}



function addWaypoints(latLng){


    var newWaypoint={};
    newWaypoint["frame"]=3;
    newWaypoint["command"]=16;
    newWaypoint["is_current"]=false;
    newWaypoint["autocontinue"]=true;
    newWaypoint["param1"]=defaultTime;
    newWaypoint["param2"]=defaultRadius;
    newWaypoint["param3"]=defaultOrbit;
    newWaypoint["param4"]=defaultYaw;
    newWaypoint["x_lat"]=latLng.lat();
    newWaypoint["y_long"]=latLng.lng();
    newWaypoint["z_alt"]=defaultAlt;

    waypointsList.push(newWaypoint);
    plotWaypoints();





}




$("#button-takeoff").on('click', clickOne)

function clickOne() {


     $(".take_off").attr("disabled",true);


     var msgdata={};
            msgdata["takeoff_alt"]=15.00;
            $.ajax({
               type: "POST",
               dataType: "json",
               data: JSON.stringify(msgdata),
               url: "http://"+ip+"/ros/"+namespace+"/navigation/take_off",
               success: function(data){console.log(data);
                   if(data.success){
                        $(".take_off").attr("disabled",false);
                        $(".take_off").addClass("ion-arrow-down-a land");
                        $(".land").removeClass("ion-arrow-up-a take_off");
                        $("#button-takeoff").off('click').on('click', clickTwo)
                        console.log("takeoff");


                }

                else{

                $(".take_off").attr("disabled",false);

                }

            },

            error: function(){

            $(".take_off").attr("disabled",false);

            }
        });
}

function clickTwo() {

     $(".land").attr("disabled",true);

    var msgdata={};

        $.ajax({
               type: "POST",
               dataType: "json",
               data: JSON.stringify(msgdata),
               url: "http://"+ip+"/ros/"+namespace+"/navigation/land",
               success: function(data){

                   if(data.success){

                        $(".land").attr("disabled",false);
                        $(".land").addClass("ion-arrow-up-a take_off");
                        $(".take_off").removeClass("ion-arrow-down-a land");
                        $("#button-takeoff").off('click').on('click', firstClick)
                        console.log("land");


                   }

                   else{

                   $(".land").attr("disabled",false);
                   }


               },

               error: function(){

               $(".land").attr("disabled",false);

               }
           });

}

function round(value,decimal){
    var x=Math.pow(10,decimal);
    return Math.round(value*x)/x;
}


function getParam(id){
     var msgdata = {};
     msgdata['param_id']=id;
     $.ajax({
        type: "POST",
        headers: { 'Authentication-Token': sessionStorage.getItem('token') },
        dataType: "json",
        data: JSON.stringify(msgdata),
        url: "http://"+ip+"/ros/"+namespace+"/param/param_get",
        success: function(data){
            if (data.success){
                 console.log(data.param_info.param_value);
                switch(id){
                case "BAT_N_CELLS":
                    batCells=data.param_info.param_value;
                    break;
                case "BAT_V_CHARGED":
                    batMax=batCells*data.param_info.param_value;
                    break;
                case "BAT_V_EMPTY":
                    batMin=batCells*data.param_info.param_value;
                    break;
                case "is_simulation_environment":
                    simEnv=data.param_info.param_value;
                    break;
                }
            }
        },
                error: function(){


                }
            });
 }

$(".gps-locked").click(function(){

    $("#gps-data").toggle(300);
    if($('#settings-page').is(':visible'))
    {
        $("#settings-page").toggle(300);
    }
});

$(".settings").click(function(){

    $("#settings-page").toggle(300);

    if($('#gps-data').is(':visible'))
        {
            $("#gps-data").toggle(300);
        }
});


$("#select").change(function(){


        one();

        if(a=="Cable Camera"){

        $(".mode-icon").addClass("ion-merge");
        $(".mode-icon").removeClass("ion-planet");

        }

        if(a=="Orbit"){
        $(".mode-icon").addClass("ion-planet");
        $(".mode-icon").removeClass("ion-merge");

        }

});

$(".abort").click(function(){


    if(a=="Cable Camera"){

    setParam("demoapp6","stop");
            }

    else if(a=="Orbit"){

        setParam("demoapp5","stop");
            }
});


function setParam(id,value){
 //    console.log(value);
     var msgdata = {};
     msgdata['param_info']={};
     msgdata['param_info']['param_id']=id;
     msgdata['param_info']['param_value']=value+'';
     $.ajax({
        type: "POST",
//        headers: { 'Authentication-Token': sessionStorage.getItem('token') },
        dataType: "json",
        data: JSON.stringify(msgdata),
        url: "http://"+ip+"/ros/"+namespace+"/param/param_set",
        success: function(data){
//            console.log("xssss");
            if(data.success){
                if(id=="demoapp5"){

                    $("#msg").html("Mission aborted");
                   $("#msg").show();
                   $("#msg").fadeOut(1500);

                }
            }
        }
    });
}


function socketCallback(){
     console.log("in-config");



    var listenerState = new ROSLIB.Topic({
            ros :ros,
//            name : '/'+namespace+'/flyt/state',
//            messageType : 'mavros_msgs/State',
             name : '/'+namespace+'/mavros/imu/data_euler',
             messageType : 'geometry_msgs/TwistStamped',
            throttle_rate: 200
    });


    listenerState.subscribe(function(message) {


        console.log("socket");
        $(".conn_status").removeClass("ion-thumbsdown");
        $(".conn_status").addClass("ion-thumbsup ");


            clearTimeout(disconnectTimeout);
            disconnectTimeout=window.setTimeout(function(){


                $(".conn_status").removeClass("ion-thumbsup");
                $(".conn_status").addClass("ion-thumbsdown");
            });

     });

 }