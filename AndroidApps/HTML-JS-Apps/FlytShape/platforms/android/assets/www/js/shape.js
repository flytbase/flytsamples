

var ip = "192.168.1.110"
var map;
var triangle, rectangle, circle,line=[];
var contentString, vertices, northEast, southWest, contentString1;
var myLatlng;
var flag=0,lat,long,globalLat=0,globalLong=0;
var waypointrec = [], waypointpoly = [],waypointlist = [];
var waypointsquare = [];

var mode=0;

//mode 0 is for testing using FlytSim and mode 1 is for testing using FlytOS.
//Please set the mode above accordingly.

$(document).ready(function() {

        $(".app-container").hide();

        $(".zoom").attr("disabled",true);

        $(".take_off").attr("disabled",false);






});


$(".submit").click(function(){

    ip=$("#ip").val()+":9090";
    console.log(ip);
    getNamespace();

});


function initMap() {



    $(".ip-div").hide();
    $(".space").hide();
    $(".app-container").show(100);
    $("#msg").hide();


    myLatlng = new google.maps.LatLng(0,0);


    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    disableDoubleClickZoom: true

  });


google.maps.event.addListener(map, 'dblclick', function(event){

            latitude = event.latLng.lat();
            longitude = event.latLng.lng();


            if(flag==1){
            console.log("polygon");
                if(rectangle)rectangle.setMap(null);
                if(circle)circle.setMap(null);
                if(triangle)triangle.setMap(null);
                polygon();






            }
            if(flag==2){
            console.log("rectangele");

                if(rectangle)rectangle.setMap(null);
                if(circle)circle.setMap(null);
                if(triangle)triangle.setMap(null);
                rec();
                rectangle.setMap(map);
            }
            if(flag==3){
            console.log("cirle");
                if(rectangle)rectangle.setMap(null);
                if(circle)circle.setMap(null);
                if(triangle)triangle.setMap(null);
                cir();

            }

 });


}


$(".Polygon").click(function(){

     flag=1;
     $(".Rectangle").removeClass("button-balanced");
     $(".Polygon").addClass("button-balanced");




});

$(".Rectangle").click(function(){

    flag=2;
    $(".Polygon").removeClass("button-balanced");
    $(".Rectangle").addClass("button-balanced");



});



$(".zoom").click(function(){

    map.setCenter(new google.maps.LatLng(globalLat,globalLong));
    map.setZoom(16);



});

$(".execute").click(function(){

    get_vertex();






    var string= "";

    for(var i=0;i<waypointsList.length;i++){
    string+= waypointsList[i].x_lat + " " + waypointsList[i].y_long+ " ";
    }


    if(mode==0){

    console.log("fsim");

    var msgdata = {};
    msgdata["app_name"]="demoapp4";
    msgdata["arguments"]= string;


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


    if(mode==1){

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
});









function polygon(){



  var triangleCoords = [

    {lat: latitude, lng: longitude},
    {lat: latitude, lng: longitude+0.001},
    {lat: latitude+0.001, lng: longitude+0.0005},
    {lat: latitude, lng: longitude}

  ];

  // Construct the polygon.
    triangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    editable: true,
    draggable: true
  });
   triangle.setMap(map);

  google.maps.event.addListener(triangle, 'mousedown', function(e) {
      // Check if click was on a vertex control point
      if (e.vertex == undefined) {
        return;
      }
      deleteMenu.open(map, triangle.getPath(), e.vertex);
    });
  }











function rec(){
    rectangle = new google.maps.Rectangle({

    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    draggable: true,
    editable: true,
    zoom: 11,
    bounds: {
      north: latitude,
      south: latitude-0.001,
      east: longitude,
      west: longitude-0.001

    }
  });


  northEast = rectangle.getBounds().getNorthEast();
  southWest = rectangle.getBounds().getSouthWest();






  }




 function get_vertex(){


    if(flag==1)
    {
     vertices = triangle.getPath();

        waypointsList=[];
        for (var i =0; i < vertices.getLength(); i++) {
            var xy = vertices.getAt(i);

            addWaypoints(xy.lat(),xy.lng());
          }
          waypointsList.push(waypointsList[0]);
          console.log(waypointsList);
    }

    if(flag==2){


  northEast = rectangle.getBounds().getNorthEast();
  southWest = rectangle.getBounds().getSouthWest();

      waypointsList=[];
               addWaypoints(northEast.lat(),northEast.lng());
               addWaypoints(southWest.lat(),northEast.lng());
               addWaypoints(southWest.lat(),southWest.lng());
               addWaypoints(northEast.lat(),southWest.lng());
               addWaypoints(northEast.lat(),northEast.lng());

               console.log(waypointsList);
    }


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
           $("#msg").html("Connected");
                       $("#msg").show();
                       $("#msg").fadeOut(1500);

              namespace=data.param_info.param_value;
                console.log(namespace);
              var ros = new ROSLIB.Ros({
                url : 'ws://'+ip+'/websocket'
              });               ros.on('connection', function() {
                console.log('Connected to websocket server.');
              });               ros.on('error', function(error) {
                console.log('Error connecting to websocket server: ', error);
              });               ros.on('close', function() {
                console.log('Connection to websocket server closed.');
              });




            var listenerGlobalPosition = new ROSLIB.Topic({
                 ros :ros,
                 name : '/'+namespace+'/mavros/global_position/global',
                 messageType : 'sensor_msgs/NavSatFix',
                 throttle_rate: 1000
            });
            var marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0),disableDoubleClickZoom: true});
            var latlng ;
            var flag = 0;
            var flag1 = 0;
            var waypointsquare = [];
            marker.setMap(map);

         listenerGlobalPosition.subscribe(function(message) {


                        globalLat =message.latitude;
                        globalLong =message.longitude;
                        c=c+1;
                        //console.log(c,globalLat);
                        var temp=new google.maps.LatLng(message.latitude,message.longitude);
                        if (flag){
                            draw(latlng,temp,'#0000AA');
                        }
                        else
                            flag=1;


                        latlng = new google.maps.LatLng(message.latitude,message.longitude);
                        marker.setPosition(latlng);
                        marker.setMap(map);

                        if(!flag1){
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
                                throttle_rate: 300
                        });
                         var flag1=0;
                         var gpsTimeout;

                        listenerGlobalPositionRaw.subscribe(function(message) {

                            if(gpsTimeout)clearTimeout(gpsTimeout);

                            if(Math.sqrt(message.position_covariance[4])===0){

                            $(".zoom").attr("disabled",true);
                            $(".gps_locked").addClass("ion-unlocked gps_unlocked");
                            $(".gps_unlocked").removeClass("ion-locked gps_locked");

                            }
                            else if(Math.sqrt(message.position_covariance[4])<14){
                                $(".zoom").attr("disabled",false);
                                $(".gps_unlocked").addClass("ion-unlocked gps_locked");
                                $(".gps_locked").removeClass("ion-locked gps_unlocked");

                             }
                             else{
                               $(".zoom").attr("disabled",true);
                               $(".gps_locked").addClass("ion-unlocked gps_unlocked");
                               $(".gps_unlocked").removeClass("ion-locked gps_locked");
                             }
                            gpsTimeout=setTimeout(function(){
                                $(".zoom").attr("disabled",true);
                            },500);

                         });





         }

         }
         });
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

function addWaypoints(lat,lng){


    var newWaypoint={};
    newWaypoint["frame"]=3;
    newWaypoint["command"]=16;
    newWaypoint["is_current"]=false;
    newWaypoint["autocontinue"]=true;
    newWaypoint["param1"]=0.00;
    newWaypoint["param2"]=4.00;
    newWaypoint["param3"]=0.00;
    newWaypoint["param4"]=0.00;
    newWaypoint["x_lat"]=lat;
    newWaypoint["y_long"]=lng;
    newWaypoint["z_alt"]=5.00;

    waypointsList.push(newWaypoint);




}


$(".disarm").click(function(){
    var msgdata={};
        $.ajax({
           type: "POST",
           dataType: "json",
           data: JSON.stringify(msgdata),
           url: "http://"+ip+"/ros/"+namespace+"/navigation/disarm",
           success: function(data){
               if(data.success){

                   $(".land").addClass("ion-arrow-up-a take_off");
                   $(".take_off").removeClass("ion-arrow-down-a land");



               }
           }
       });
});

$("#button-takeoff").on('click', firstClick)

function firstClick() {


     $(".take_off").attr("disabled",true);
     $(".disarm").attr("disabled",true);


     var msgdata={};
            msgdata["takeoff_alt"]=5.00;
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
                        $("#button-takeoff").off('click').on('click', secondClick)
                        console.log("takeoff");
                        $(".disarm").attr("disabled",true);

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

function secondClick() {

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
                        $(".disarm").attr("disabled",false);

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

$("#tog").click(function(){

    if($("#tog").prop('checked') == true){
        mode=0;
    }else{
        mode=1;

    }
})
