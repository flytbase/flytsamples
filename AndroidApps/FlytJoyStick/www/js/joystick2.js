

var namespace="";
var ip = "192.168.1.114:9090";
var joystick, joystick2;



$(document).ready(function() {
//    $(".joystick-container").hide();

});


$(".submit").click(function(){

    ip=$("#ip").val()+":9090";
    console.log(ip);
    getNamespace();

});

$(".start").click(function(){

    $(".joystick-container-explain").hide(100);
});

function init(){


    ip=$("#ip").val()+":9090";
    console.log(ip);
    //getNamespace();
    $(".ip-div").hide();
    $(".space").hide();
    $(".joystick-container").show(100);
    $(".joystick-container-explain").show(100);
    $("#msg").hide();



}

function getNamespace(){
    var msgdata = {};
    $.ajax({
       type: "POST",
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: "http://"+ip+"/ros/get_global_namespace",
       success: function(data){
           if(data.success){
           init();
           $("#msg").html("Connected");
           $("#msg").show();
           $("#msg").fadeOut(1500);

               namespace=data.param_info.param_value;

                console.log(namespace);






          namespace=data.param_info.param_value;




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

                        var listenerExtendedState = new ROSLIB.Topic({
                               ros :ros,
                               name : '/'+namespace+'/mavros/battery',
                               messageType : 'mavros_msgs/BatteryStatus'
                       });

                       listenerExtendedState.subscribe(function(message) {

                            if(message.landed_state==2){
                                 $(".takeoff").addClass("land");
                                                    $(".land").removeClass("takeoff");
                                                    $(".land").text(" Land");
                            }else if(message.landed_state==1){
                                $(".land").addClass("takeoff");
                                                    $(".takeoff").removeClass("land");
                                                    $(".takeoff").text(" Takeoff");
                            }
                       });


                       var listenerBatteryStatus = new ROSLIB.Topic({
                                   ros :ros,
                                   name : '/'+namespace+'/mavros/battery',
                                   messageType : 'mavros_msgs/BatteryStatus'
                           });

                           listenerBatteryStatus.subscribe(function(message) {



                                var batteryPercentage=parseInt((round(message.voltage,2)-batMin)*100/(batMax-batMin));

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



                           });

          }
      },

      error:function(){console.log("errrrrrrrrrrrrrror");
               $("#msg").html("Failed to Connect. Retry! ");
                           $("#msg").show();
                           $("#msg").fadeOut(3500);
          }
  });



}
var x,y,z,zang,flag=0;


function joyjoy(){
    var x=0;
    var y=0;
    var z=0;
    var yawrate=0;
//    var max_velx = 5, max_dx = 150;
//    var max_vely = 5, max_dy = 150;
//    var max_velz = 0.5, max_dz = 150;
//    var max_yawrate = 0.5, max_dyawrate = 150;
//    var deadBand = 40;



    if(flag){

    velocitySetpoint(x,y,z,yawrate);
    flag--;
     $(".disarm").attr("disabled",true);
    }
}




$('.up').bind( "touchstart", function(e){
        velocitySetpoint(0,0,-1,0);
           $(".up").removeClass("button-positive");
           $(".up").addClass("button-assertive");

});



$('.hold1 ,.hold2').bind( "touchstart", function(e){
        velocitySetpoint(0,0,0,0);
           $(".hold").removeClass("button-positive");
           $(".hold").addClass("button-assertive");

});

$('.right, .up, .down , .left ,.yaw-left,.yaw-right, .front ,.back, .hold1, .hold2').bind( "touchend", function(e){
velocitySetpoint(0,0,0,0);
    $(this).addClass("button-positive");
    $(this).removeClass("button-assertive");

});


$(".down").bind( "touchstart", function(e){
    velocitySetpoint(0,0,1,0);
    $(".down").removeClass("button-positive");
    $(".down").addClass("button-assertive");
});

$(".front").bind( "touchstart", function(e){
    velocitySetpoint(1,0,0,0);
    $(".front").removeClass("button-positive");
    $(".front").addClass("button-assertive");
});

$(".back").bind( "touchstart", function(e){
    velocitySetpoint(-1,0,0,0);
    $(".back").removeClass("button-positive");
    $(".back").addClass("button-assertive");
});

$(".left").bind( "touchstart", function(e){
    velocitySetpoint(0,-1,0,0);
    $(".left").removeClass("button-positive");
    $(".left").addClass("button-assertive");
});

$(".right").bind( "touchstart", function(e){
    velocitySetpoint(0,1,0,0);
    $(".right").removeClass("button-positive");
    $(".right").addClass("button-assertive");
});

$(".yaw-left").bind( "touchstart", function(e){
    velocitySetpoint(0,0,0,-0.5);
    $(".yaw-left").removeClass("button-positive");
    $(".yaw-left").addClass("button-assertive");
});

$(".yaw-right").bind( "touchstart", function(e){
    velocitySetpoint(0,0,0,0.5);
    $(".yaw-right").removeClass("button-positive");
    $(".yaw-right").addClass("button-assertive");
});
function velocitySetpoint(x,y,z,zang){
    console.log(x+" "+y+" "+z+" "+zang);
    var msgdata={};
    msgdata["twist"]={};
    msgdata.twist["twist"]={};
    msgdata.twist.twist["linear"]={};
    msgdata.twist.twist.linear["x"]=parseFloat(x);
    msgdata.twist.twist.linear["y"]=parseFloat(y);
    msgdata.twist.twist.linear["z"]=parseFloat(z);
    msgdata.twist.twist["angular"]={};
    msgdata.twist.twist.angular["z"]=parseFloat(zang);
    msgdata["tolerance"]=2.00;
    msgdata["async"]=true;
    msgdata["relative"]=false;
    msgdata["yaw_rate_valid"]=true;
//    console.log(msgdata);

    $.ajax({
        type: "POST",
        dataType: "json",
        data: JSON.stringify(msgdata),
        url: "http://"+ip+"/ros/"+namespace+"/navigation/velocity_set",
        success: function(data){
            console.log(data);
            if (data.success){
                console.log("velocity set -- "+ msgdata.twist.twist.linear.x+" "+ msgdata.twist.twist.linear.y+" "+ msgdata.twist.twist.linear.z);
            }
        }
    });


}


$(".col").on("click","button.takeoff",function(){
    var msgdata={};
        msgdata["takeoff_alt"]=3.00;
        $.ajax({
           type: "POST",
           dataType: "json",
           data: JSON.stringify(msgdata),
           url: "http://"+ip+"/ros/"+namespace+"/navigation/take_off",
           success: function(data){console.log(data);
               if(data.success){
                    $(".takeoff").addClass("land");
                    $(".land").removeClass("takeoff");
                    $(".land").text(" Land");
                    $("#msg").html("Taking off ");
                           $("#msg").show();
                           $("#msg").fadeOut(3500);
//                           $(".disarm").attr("disabled",true);
                }else{
                    $("#msg").html("Take off rejected! ");
                           $("#msg").show();
                           $("#msg").fadeOut(3500);

                }
        }
    });

});

$(".col").on("click","button.land",function(){


    var msgdata={};

    $.ajax({
           type: "POST",
           dataType: "json",
           data: JSON.stringify(msgdata),
           url: "http://"+ip+"/ros/"+namespace+"/navigation/land",
           success: function(data){

               if(data.success){

                    $(".land").addClass("takeoff");
                    $(".takeoff").removeClass("land");
                    $(".takeoff").text(" Takeoff");

                    $("#msg").html("Landing ");
                           $("#msg").show();
                           $("#msg").fadeOut(3500);
//                    $(".disarm").attr("disabled",false);

               }else{
                    $("#msg").html("Land rejected! ");
                   $("#msg").show();
                   $("#msg").fadeOut(3500);

                }
           }
       });


});

$(".disarm").click(function(){
    var msgdata={};
        $.ajax({
           type: "POST",
           dataType: "json",
           data: JSON.stringify(msgdata),
           url: "http://"+ip+"/ros/"+namespace+"/navigation/disarm",
           success: function(data){
               if(data.success){
//                   alert("Disarm message sent");
                   $(".land").addClass("takeoff");
                   $(".takeoff").removeClass("land");
                   $(".takeoff").text(" Take off");


               }
           }
       });
});
