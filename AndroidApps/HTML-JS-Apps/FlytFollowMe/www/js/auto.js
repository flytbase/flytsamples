



var watchID;
var geoLoc;
var count=0;
var gps_follow=0;
var namespace;
var globalLat, globalLong;
var latitude,longitude,myLatlng,map,mapSmall;
var isinitMap=0;
var videoip;
var slide=true;
var marker;
var markerSmall;

var lat_offset=0.0 , long_offset=0.0;


try{
 marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.CIRCLE,scale: 5, fillColor: 'red',strokeColor: 'red',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: false});
 markerSmall = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.CIRCLE,scale: 5, fillColor: 'red',strokeColor: 'red',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: false});



}

catch(err){

$("#msg").html("No internet connection:  " + err);

$("#msg").show();
$("#msg").fadeOut(2000);


}

//$(".rth").attr("disabled",true);

//$("#button-takeoff").on('click', clickOne)


$(document).ready(function(){

    console.log("device is ready");



    $(".app-container").hide();

    if(navigator.geolocation){
                   // timeout at 60000 milliseconds (60 seconds)
                   var options = {timeout :60000, enableHighAccuracy: true};
                   geoLoc = navigator.geolocation;
                   watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
                }

                else{
                   alert("Sorry, browser does not support geolocation!");
                }



});



//$("#image-stream").click(function(){
//
//    $("#map").hide();
////    $("#map-small").show(200);
//    $("#image-stream").attr("style","position:absolute;height:auto;width:100%;left:0px;top:0px;z-index:-1;");
////    $("#main-controls").hide();
////    $("#main-controls2").hide();
//
//
//});

//$("#map-small").click(function(){
//
//    $("#map-small").hide();
//    $("#map").show(200);
//
//    $("#image-stream").attr("style","position:absolute;height:25%;top:50px;width:20%;right:2%;z-index:1000;");
//
//
//    try{
//        map.setCenter(new google.maps.LatLng(globalLat,globalLong));
//        map.setZoom(19);
//    }
//    catch(err){
//        $("#msg").html("No internet connection:  " + err);
//        //console.log("tttt"+err);
//        $("#msg").show();
//        $("#msg").fadeOut(2000);
//
//    }
//});


$("#video_expand").on('click', click1)


function click1(){

//$("#map").hide();
    //    $("#map-small").show(200);
        $("#image-stream").attr("style","position:absolute;height:97%;width:auto;left:0px;top:0px;z-index:1000;");
        $(".expand").addClass("ion-arrow-shrink compress");
        $(".compress").removeClass("ion-arrow-expand expand");
        $("#video_expand").attr("style","position:absolute; right:310px; top:0px; z-index:1000;");
        $("#video_expand").off('click').on('click', click2)
        console.log("expand");

}


function click2(){

    console.log("shrink");
        // $("#map-small").hide();
            $("#map").show(200);

            $("#image-stream").attr("style","position:absolute;height:25%;top:50px;width:20%;right:2%;z-index:1000;");
            $(".compress").addClass("ion-arrow-expand expand");
            $(".expand").removeClass("ion-arrow-shrink compress");
            $("#video_expand").attr("style","position:absolute; right:20px; top:25px; z-index:1000;");

            $("#video_expand").off('click').on('click', click1)


            try{
                map.setCenter(new google.maps.LatLng(globalLat,globalLong));
                map.setZoom(19);
            }
            catch(err){
                $("#msg").html("No internet connection:  " + err);
                //console.log("tttt"+err);
                $("#msg").show();
                $("#msg").fadeOut(2000);

            }

}

//$("#video_expand").click(function(){
//    $("#map").hide();
//    //    $("#map-small").show(200);
//        $("#image-stream").attr("style","position:absolute;height:auto;width:100%;left:0px;top:0px;z-index:-1;");
//        $(".expand").addClass("ion-arrow-shrink compress");
//        $("compress").removeClass("ion-arrow-expand expand");
//
//
//});
//
//$(".compress").click(function(){
//
//    console.log("shrink");
//    // $("#map-small").hide();
//        $("#map").show(200);
//
//        $("#image-stream").attr("style","position:absolute;height:25%;top:50px;width:20%;right:2%;z-index:1000;");
//
//
//        try{
//            map.setCenter(new google.maps.LatLng(globalLat,globalLong));
//            map.setZoom(19);
//        }
//        catch(err){
//            $("#msg").html("No internet connection:  " + err);
//            //console.log("tttt"+err);
//            $("#msg").show();
//            $("#msg").fadeOut(2000);
//
//        }
//
//});





 function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    if(gps_follow){

        followSetpoint(latitude,longitude,parseFloat($("#alt").val()));
    }

    //console.log("Latitude : " + latitude + " Longitude: " + longitude);

    count++;
    $("#lat").html("lat : " + latitude);
    $("#long").html( "long : " + longitude);

     if(isinitMap){
        latlng = new google.maps.LatLng(latitude,longitude);
                marker.setPosition(latlng);
                marker.setMap(map);
                markerSmall.setPosition(latlng);
                markerSmall.setMap(mapSmall);

     }

 }

 function errorHandler(err) {
    if(err.code == 1) {
       alert("Error: Access is denied!");
    }

    else if( err.code == 2) {
       alert("Error: Position is unavailable!");
       console.log(err);
    }
 }






function followSetpoint(x,y,z){
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
                        data: JSON.stringify(msgdata),
                        url: "http://"+ip+"/ros/"+namespace+"/navigation/position_set_global",
                        success: function(data){
                        if (data.success){
                            console.log("success")
                            }
                        }
                    });
}

function positionHold(){
var msgdata={};
$.ajax({
    type: "POST",
    dataType: "json",
    data: JSON.stringify(msgdata),
    url: "http://"+ip+"/ros/"+namespace+"/navigation/position_hold",
    success: function(data){
        console.log(data);
         $("#msg").html("Follow me disabled");
           $("#msg").show();
           $("#msg").fadeOut(1500);
    }
});


}

$(".submit").click(function(){


    ip=$("#ip").val();


//    console.log(isNaN(ip));

    if($("#ip").val()==="" ){
    $("#msg").html("please enter valid ip address");
    $("#msg").show();
    $("#msg").fadeOut(1500);
    console.log(" no ip");

    }



    else{

        ip=$("#ip").val()+":9090";
            console.log(ip);
            getNamespace();

        videoip = ip.substring(0,ip.lastIndexOf(":"));

        $("#slider").hide();
    }




});

$('#ex1').slider({
	formatter: function(value) {
		return 'Current value: ' + value;
	}
});

$(".start").click(function(){

    gps_follow=1;
    console.log("start");
    $("#msg").html("Follow me enabled");
   $("#msg").show();
   $("#msg").fadeOut(1500);
   $(".start").addClass("button-assertive");
   $(".start").removeClass("button-calm");
   $(".stop").addClass("button-calm");
       $(".stop").removeClass("button-assertive");






});

$(".stop").click(function(){

    gps_follow=0;
    positionHold();
    $(".stop").addClass("button-assertive");
    $(".stop").removeClass("button-calm");
      $(".start").addClass("button-calm");
       $(".start").removeClass("button-assertive");


});

var marker1;
var marker1Small;
var latlng1;

function getNamespace(){
var msgdata = {};
   $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify(msgdata),
      url: "http://"+ip+"/ros/get_global_namespace",
      success: function(data){
          if(data.success){
          $(".ip-div").hide();
          $(".space").hide();
          $(".app-container").show(100);
          $("#msg").hide();
          namespace=data.param_info.param_value;
           getParam("is_simulation_environment");



          try{
              initMap();
              marker1 = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: true});
              marker1Small = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: true});
          }

          catch(err){
               $("#msg").html("Failed initmap:  "+ err);
             $("#msg").show();
             $("#msg").fadeOut(2000);

          }

           $("#msg").html("Connected to drone");
           $("#msg").show();
           $("#msg").fadeOut(2000);


         $("#image-stream").attr("src","http://"+videoip+":8080/stream?topic=/"+namespace+"/flytcam/image_capture&width=320&height=240&rate=2");


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
//            var marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0),disableDoubleClickZoom: true});
//            var latlng ;
//            var flag = 0;
//            var flag1 = 0;
           // var waypointsquare = [];
//            marker.setMap(map);


            //marker1.setMap(map);

         listenerGlobalPosition.subscribe(function(message) {


                        globalLat =message.latitude;
                        globalLong =message.longitude;



//                        console.log(globalLat);
//                        console.log(globalLong);
//                        var temp=new google.maps.LatLng(message.latitude,message.longitude);
//                        if (flag){
//                            draw(latlng,temp,'#0000AA');
//                        }
//                        else
//                            flag=1;
//
//
                        try{
                            latlng1 = new google.maps.LatLng(message.latitude,message.longitude);
                            marker1.setPosition(latlng1);
                            marker1.setMap(map);
                            marker1Small.setPosition(latlng1);
                            marker1Small.setMap(mapSmall);
                        }

                        catch(err){
//                            $("#msg").html("No internet connection:  " + err);
//                            //console.log("tttt"+err);
//                            $("#msg").show();
//                            $("#msg").fadeOut(2000);


                        }


//
//                        if(!flag1){
//                        map.setCenter(new google.maps.LatLng(message.latitude,message.longitude));
//                        map.setZoom(16);
//                        flag1=1;
//                        }
//
//
//                        if(globalLat<waypointsquare[0].lat() & globalLat>waypointsquare[1].lat()& globalLong>waypointsquare[0].lng() & globalLong<waypointsquare[1].lng() ){
//                        executing=true;
//                        }

//

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

//                        var listenerExtendedState = new ROSLIB.Topic({
//                                   ros :ros,
//                                   name : '/'+namespace+'/mavros/extended_state',
//                                   messageType : 'mavros_msgs/ExtendedState',
//                                   throttle_rate: 200
//                           });
//
//
//                           listenerExtendedState.subscribe(function(message) {
//                               var landed_state=message.landed_state;
//
//
//                               if (landed_state==2 ){
//                                       $(".take_off").addClass("ion-arrow-down-a land");
//                                       $(".land").removeClass("ion-arrow-up-a take_off");
//
//                                }
//
//
//                                       else if(landed_state==1){
//                                       $(".land").addClass("ion-arrow-up-a take_off");
//                                       $(".take-off").removeClass("ion-arrow-down-a land");
//
//                               }
//
//                           });



         }

         },

         error:function(){console.log("errrrrrrrrrrrrrror");
                  $("#msg").html("Failed to Connect. Retry! ");
                              $("#msg").show();
                              $("#msg").fadeOut(3500);

            }
         });
}





$("#button-takeoff").click(function(){




    console.log("yaa");


     var msgdata={};
            msgdata["takeoff_alt"]=parseFloat($("#alt").val());
            $.ajax({
               type: "POST",
               dataType: "json",
               data: JSON.stringify(msgdata),
               url: "http://"+ip+"/ros/"+namespace+"/navigation/take_off",
               success: function(data){console.log(data);
                   if(data.success){
//                        $(".take_off").addClass("ion-arrow-down-a land");
//                        $(".land").removeClass("ion-arrow-up-a take_off");
//                        $("#button-takeoff").off('click').on('click', clickTwo)
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

     });




$("#button-land").click(function(){


     $(".land").attr("disabled",true);

     gps_follow=0;

    var msgdata={};

        $.ajax({
               type: "POST",
               dataType: "json",
               data: JSON.stringify(msgdata),
               url: "http://"+ip+"/ros/"+namespace+"/navigation/land",
               success: function(data){

                   if(data.success){

                        $(".land").attr("disabled",false);
//                        $(".land").addClass("ion-arrow-up-a take_off");
//                        $(".take_off").removeClass("ion-arrow-down-a land");
                        //$("#button-takeoff").off('click').on('click', clickOne)
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
     });


function initMap() {




//        $(".list").show(100);




        myLatlng = new google.maps.LatLng(18.5940829,73.91060829999999);






        mapSmall=new google.maps.Map(document.getElementById('map-small'), {
                           zoom: 19,
                           center: myLatlng,
                           zoomControl: false,
                           streetViewControl: false,
                           disableDoubleClickZoom: true,
                           mapTypeControl: false


                         });

         setTimeout(function(){$("#map-small").hide();},2000);


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
//console.log(globalLat);
mapSmall.setCenter(new google.maps.LatLng(globalLat,globalLong));

map.setCenter(new google.maps.LatLng(globalLat,globalLong));
map.setZoom(19);
}

catch(err){

$("#msg").html("No internet connection:  " + err);

$("#msg").show();
$("#msg").fadeOut(2000);
console.log("jbghkbhjknjk");



}

});




$("#button_slide").click(function(){


if(slide==true){

$("#slider").hide();
$("#btn_slide").text(" ||| ")
slide=false;

}
else{

$("#slider").show();
$("#btn_slide").text("Nudge ||| ")

slide=true;
}


});

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

                    if(data.param_info.param_value==0){

                        $("#offset").val(1);
                        $("#alt").val(5.0);

                    }

                    else{

                        $("#offset").val(5);
                        $("#alt").val(30.0);

                    }

                    break;
                }
            }
        },
                error: function(){


                }
            });
 }
