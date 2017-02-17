


var restPath=localStorage.getItem("restPath");
var wsPath=localStorage.getItem("wsPath");
var namespace=localStorage.getItem("namespace");
var token=localStorage.getItem("token");
var auth=localStorage.getItem("auth");
var watchID;
var geoLoc;
var count=0;
var gps_follow=0;
var namespace;
var globalLat, globalLong;
var latitude,longitude,myLatlng,map,mapSmall;
var isinitMap=0;
var slide=true;
var marker;
var markerSmall;

var lat_offset=0.0 , long_offset=0.0;

var videoip = restPath.substring(0,restPath.lastIndexOf(":"));

try{
 marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.CIRCLE,scale: 5, fillColor: 'red',strokeColor: 'red',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: false});
 markerSmall = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.CIRCLE,scale: 5, fillColor: 'red',strokeColor: 'red',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: false});



}

catch(err){

$("#msg").html("No internet connection:  " + err);

$("#msg").show();
$("#msg").fadeOut(2000);
}
try{
              initMap();
              console.log("Came here");
              marker1 = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: true});
              marker1Small = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0,0), icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale: 5, fillColor: 'blue',strokeColor: 'blue',strokeWeight: 1, fillOpacity:1  },disableDoubleClickZoom: true});
          }

          catch(err){
              console.log("Not here");
               $("#msg").html("Failed initmap:  "+ err);
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
                        headers: { 'Authentication-Token':token },
                        dataType: "json",
                        data: JSON.stringify(msgdata),
                        url: restPath+"/ros/"+namespace+"/navigation/position_set_global",
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
    headers: { 'Authentication-Token':token },
    dataType: "json",
    data: JSON.stringify(msgdata),
    url: restPath+"/ros/"+namespace+"/navigation/position_hold",
    success: function(data){
        console.log(data);
         $("#msg").html("Follow me disabled");
           $("#msg").show();
           $("#msg").fadeOut(1500);
    }
});


}





//$('#ex1').slider({
//	formatter: function(value) {
//		return 'Current value: ' + value;
//	}
//});

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






$("#button-takeoff").click(function(){




    console.log("yaa");


     var msgdata={};
            msgdata["takeoff_alt"]=parseFloat($("#alt").val());
            $.ajax({
               type: "POST",
               headers: { 'Authentication-Token':token },
               dataType: "json",
               data: JSON.stringify(msgdata),
               url: restPath+"/ros/"+namespace+"/navigation/take_off",
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
               headers: { 'Authentication-Token':token },
               dataType: "json",
               data: JSON.stringify(msgdata),
               url: restPath+"/ros/"+namespace+"/navigation/land",
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
        headers: { 'Authentication-Token':token },
        dataType: "json",
        data: JSON.stringify(msgdata),
        url: restPath+"/ros/"+namespace+"/param/param_get",
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