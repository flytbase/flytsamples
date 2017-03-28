
// var map,marker;


$(document).ready(function(){
    rosInitialize();


});


function socketCallback(){




    // var listenerGlobalPosition = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/mavros/global_position/global',
    //         messageType : 'sensor_msgs/NavSatFix',
    //         throttle_rate: 1000
    // });

    // marker = new google.maps.Marker({draggable:true,position: new google.maps.LatLng(0, 0)});

    // listenerGlobalPosition.subscribe(function(message) {

    //     latLng = new google.maps.LatLng(message.latitude,message.longitude);
    //     marker.setPosition(latLng);

    //     marker.setMap(map);
         
    //  });

}

$(".takeoff").click(function(){
    var msgdata={};
    msgdata["takeoff_alt"]=5.00;
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
$(".land").click(function(){
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

