
var namespace;
var map,marker;

$(document).ready(function(){

    getNamespace();

    var myOptions = {zoom:3,center:new google.maps.LatLng(18.594,73.910),mapTypeId: google.maps.MapTypeId.ROADMAP ,disableDoubleClickZoom: true};
    map = new google.maps.Map(document.getElementById("gmap"), myOptions);

});



function getNamespace(){

    $.ajax({
       type: "GET",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       url: restPath+"/ros/get_global_namespace",
       success: function(data){
           if(data.success){
                namespace=data.param_info.param_value;

               rosInitialize();
            }
       },
       error: function(){
           setTimeout(function(){getNamespace();},1000);
       }
   });

}


function socketCallback(){

    var listenerGlobalPosition = new ROSLIB.Topic({
            ros :ros,
            name : '/'+namespace+'/mavros/global_position/global',
            messageType : 'sensor_msgs/NavSatFix',
            throttle_rate: 1000
    });

    marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0)});

    listenerGlobalPosition.subscribe(function(message) {

        latLng = new google.maps.LatLng(message.latitude,message.longitude);
        marker.setPosition(latLng);

        marker.setMap(map);
         
     });
}