var ip = location.host;
var videoip=ip.substring(0,ip.lastIndexOf(":"));
var videoLink="";
var namespace,disconnectTimeout,minVolt,maxVolt,mapDash,livegps=[],rotation=0;
var line=[];
var image123="images/quad_icon.png";
var currentLocation;
var currentLocationLatLng;
var sonarToggle;
var gauge,plot2;
var flagDashboardPlot=true,flagPagePlot=false;
var plotMin=-2,plotMax=2;
var landed_state=1;
var global_ob_track_ct, global_ob_track_at, global_ob_track_mr, global_ob_track_ir, global_ob_track_hrange, global_ob_track_srange, global_ob_track_vrange,global_ob_track_mode;
// var random;
var jcrop_api;

var finalroll=[], finalpitch=[],finalyaw=[],finalSpeedroll=[], finalSpeedpitch=[],finalSpeedyaw=[],finalposx=[],finalposy=[],finalposz=[],finalvelx=[],finalvely=[],finalvelz=[];
jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};
$("#HUDw").rotate(0.1);


$(document).ready(function(){

// get_video_list();

    // $( '.sidebar-toggle-box .fa-bars' ).trigger( "click" );
    $(".video-page-div").hide();
   $("#video-select").select2();

    $("#color, #circle, #tld, #centroid, #setpoint, #locPos").hide();
    $(".start-centroid").trigger("click");

        getNamespace();
        $("input[type=\"checkbox\"], input[type=\"radio\"]").not(".roll, .pitch, .yaw, .roll-speed, .pitch-speed, .yaw-speed, .posx, .posy, .posz, .velx, .vely, .velz").bootstrapSwitch();

    // $('input[type="checkbox"],[type="radio"]').not('#create-switch').bootstrapSwitch();
    $("[name='sonar-1']").bootstrapSwitch();


});

function graphPlot(){
    var plotList=[],plotColors=[];
        if($(".roll").is(":checked")){plotList.push(finalroll);plotColors.push("#668b8b");}
        if($(".pitch").is(":checked")){plotList.push(finalpitch);plotColors.push("#db7093");}
        if($(".yaw").is(":checked")){plotList.push(finalyaw);plotColors.push("#a2cd5a");}
        if($(".roll-speed").is(":checked")){plotList.push(finalSpeedroll);plotColors.push("#008b8b");}
        if($(".pitch-speed").is(":checked")){plotList.push(finalSpeedpitch);plotColors.push("#00cdcd");}
        if($(".yaw-speed").is(":checked")){plotList.push(finalSpeedyaw);plotColors.push("#ff7256");}
        if($(".posx").is(":checked")){plotList.push(finalposx);plotColors.push("#7b68ee");}
        if($(".posy").is(":checked")){plotList.push(finalposy);plotColors.push("#ad79ba");}
        if($(".posz").is(":checked")){plotList.push(finalposz);plotColors.push("#8fbc8f");}
        if($(".velx").is(":checked")){plotList.push(finalvelx);plotColors.push("#ffb6c1");}
        if($(".vely").is(":checked")){plotList.push(finalvely);plotColors.push("#c6e2ff");}
        if($(".velz").is(":checked")){plotList.push(finalvelz);plotColors.push("#00f00f");}

   plot2 = $.plot($("#plot-reatltime-chart #plot-reatltime-chartContainer"),[finalroll], {
            series: {
                lines: {
                    show: true,
                    fill: false
                },
                shadowSize: 0
            },
            yaxis: {
                 min: plotMin,
                 max: plotMax,
                ticks: 10
            },
            xaxis: {
                show: false
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#f9f9f9",
                borderWidth: 1,
                borderColor: "#eeeeee"
            },
            colors: plotColors,
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false
            }
        });

        

        plot2.setData(plotList);

        // console.log(plot2);
        plot2.draw();


}


function drawDash(lat1,lat2,color) {

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
    flightPath.setMap(mapDash);
}

var flag=0;
function getNamespace(){

    var msgdata = {};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/get_global_namespace",
       success: function(data){
           if(data.success){
                namespace=data.param_info.param_value;
               //  $("#flytpod-name").val(namespace);          
               // $("#flytName").html(namespace);
               // $(".name-widget").addClass("tar");
               // getParam("SYS_AUTOSTART");
               // getParam("BAT_N_CELLS");
               // getParam("PWM_MIN");
               //  getParam("PWM_MAX");

               // getParam("SENS_BOARD_ROT");
               // // getParam("SENS_EXT_MAG_ROT");
               //  get_video_list();
               //  getParam('ob_track_ct');
               //  getParam('ob_track_at');
               //  getParam('ob_track_ir');
               //  getParam('ob_track_mr');
               //  getParam('ob_track_follow');
               //  getParam('ob_track_kp');
               //  getParam('ob_track_kd');
               //  getParam('ob_track_vel_xy_min');
               //  getParam('ob_track_vel_xy_max');
               //  getParam('ob_track_mode');
               //  getParam('ob_track_tolerance_inner');
               //  getParam('ob_track_tolerance_outer');
               //  getParam('ob_track_hrange');           
               //  getParam('ob_track_srange');           
               //  getParam('ob_track_vrange');              
               //  getParam("ob_track_compensate");
               //  getParam("ob_track_tld_learning_disabled");
               //  getParam("ob_track_tld_detector_disabled");
               //  getParam("ob_track_tld_new_object");
                // getParam('ob_track_tld_clear_model');
                // getParam('ob_track_tld_import_model');
                // getParam('ob_track_tld_export_model');
                

          // $("#dashboard-img").attr("src","http://"+videoip+":8080/stream?topic=/"+namespace+"/flytcam/image_capture&width=320&height=240&rate=2&type=ros_compressed");

               rosInitialize();
            // setTimeout(function(){
            //     $(".video-section").hide();
            //     $(".plot-section").hide();
            //     setInterval(function(){graphPlot();},200);
            // },2000);

            }
       },
       error: function(){
           getNamespace();
       }
           });
}

function get_video_list(){
    $.ajax({
   type: "GET",
   dataType: "json",
   url: "http://"+videoip+":8080/list_streams",
   success: function(data){
    
    // console.log(data);
    // console.log(data["stream2"]);

        for(var i=1;i<(Object.keys(data).length+1);i++){
            $("#video-select").append($('<option>', {
                value: i,
                text: data["stream"+i]
            }));
        }

  

   },
   error: function(){
       console.log("Error in GET");
   }
});


}

$("#video-select").change(function(){
    // console.log($(this).children(":selected").html());
    videoLink=$(this).children(":selected").html()+"";
    // console.log(videoLink);

});


function socketCallback(){

    sonarToggle = new ROSLIB.Topic({
        ros : ros,
        name : '/msg',
        messageType : 'std_msgs/Int32MultiArray'
    });

    sonarToggle.subscribe(function(message){
      console.log(message);
    });


    // var listenerBatteryStatus = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/mavros/battery',
    //         messageType : 'mavros_msgs/BatteryStatus'
    // });
    var listenerSonar = new ROSLIB.Topic({
        ros : ros,
        name : '/sonar',
        messageType : 'std_msgs/Int32MultiArray'
    });

    listenerSonar.subscribe(function(message) {

      $("#table-sonar1").text(message.data[0]);
      $("#table-sonar2").text(message.data[1]);
      $("#table-sonar3").text(message.data[2]);
      $("#table-sonar4").text(message.data[3]);
      $("#table-sonar5").text(message.data[4]);
      $("#table-sonar6").text(message.data[5]);

      var sonar1=parseInt(100-message.data[0]*100/400);
      var sonar2=parseInt(100-message.data[1]*100/400);
      var sonar3=parseInt(100-message.data[2]*100/400);
      var sonar4=parseInt(100-message.data[3]*100/400);
      var sonar5=parseInt(100-message.data[4]*100/400);
      var sonar6=parseInt(100-message.data[5]*100/400);
      // console.log(sona);

        $(" .sonar1-p1").height((100-sonar1)+"%");
        $(" .sonar2-p1").height((100-sonar2)+"%");
        $(" .sonar3-p1").height((100-sonar3)+"%");
        $(" .sonar4-p1").height((100-sonar4)+"%");
        $(" .sonar5-p1").height((100-sonar5)+"%");
        $(" .sonar6-p1").height((100-sonar6)+"%");
      if (sonar1 > 80){

        $(" .sonar1-p2").height((sonar1-80)+"%");
        $(" .sonar1-p3").height("30%");
        $(" .sonar1-p4").height("50%");
      } else if(sonar1 >50){
        $(" .sonar1-p2").height("0%");
        $(" .sonar1-p3").height((sonar1-50)+"%");
        $(" .sonar1-p4").height("50%");
      }else{
        $(" .sonar1-p2").height("0%");
        $(" .sonar1-p3").height("0%");
        $(" .sonar1-p4").height(sonar1+"%");
      }


      if (sonar2 > 80){

        $(" .sonar2-p2").height((sonar2-80)+"%");
        $(" .sonar2-p3").height("30%");
        $(" .sonar2-p4").height("50%");
      } else if(sonar2 >50){
        $(" .sonar2-p2").height("0%");
        $(" .sonar2-p3").height((sonar2-50)+"%");
        $(" .sonar2-p4").height("50%");
      }else{
        $(" .sonar2-p2").height("0%");
        $(" .sonar2-p3").height("0%");
        $(" .sonar2-p4").height(sonar2+"%");
      }

      if (sonar3 > 80){

        $(" .sonar3-p2").height((sonar3-80)+"%");
        $(" .sonar3-p3").height("30%");
        $(" .sonar3-p4").height("50%");
      } else if(sonar3 >50){
        $(" .sonar3-p2").height("0%");
        $(" .sonar3-p3").height((sonar3-50)+"%");
        $(" .sonar3-p4").height("50%");
      }else{
        $(" .sonar3-p2").height("0%");
        $(" .sonar3-p3").height("0%");
        $(" .sonar3-p4").height(sonar3+"%");
      }

      if (sonar4 > 80){

        $(" .sonar4-p2").height((sonar4-80)+"%");
        $(" .sonar4-p3").height("30%");
        $(" .sonar4-p4").height("50%");
      } else if(sonar4 >50){
        $(" .sonar4-p2").height("0%");
        $(" .sonar4-p3").height((sonar4-50)+"%");
        $(" .sonar4-p4").height("50%");
      }else{
        $(" .sonar4-p2").height("0%");
        $(" .sonar4-p3").height("0%");
        $(" .sonar4-p4").height(sonar4+"%");
      }

      if (sonar5 > 80){

        $(" .sonar5-p2").height((sonar5-80)+"%");
        $(" .sonar5-p3").height("30%");
        $(" .sonar5-p4").height("50%");
      } else if(sonar5 >50){
        $(" .sonar5-p2").height("0%");
        $(" .sonar5-p3").height((sonar5-50)+"%");
        $(" .sonar5-p4").height("50%");
      }else{
        $(" .sonar5-p2").height("0%");
        $(" .sonar5-p3").height("0%");
        $(" .sonar5-p4").height(sonar5+"%");
      }

      if (sonar6 > 80){

        $(" .sonar6-p2").height((sonar6-80)+"%");
        $(" .sonar6-p3").height("30%");
        $(" .sonar6-p4").height("50%");
      } else if(sonar2 >50){
        $(" .sonar6-p2").height("0%");
        $(" .sonar6-p3").height((sonar6-50)+"%");
        $(" .sonar6-p4").height("50%");
      }else{
        $(" .sonar6-p2").height("0%");
        $(" .sonar6-p3").height("0%");
        $(" .sonar6-p4").height(sonar6+"%");
      }
      // console.log(sonar2);

    });


    var listenerBatteryStatus = new ROSLIB.Topic({
            ros :ros,
            name : '/'+namespace+'/mavros/battery',
            messageType : 'mavros_msgs/BatteryStatus'
    });

    listenerBatteryStatus.subscribe(function(message) {
         $(".battery-label").html("<i class='fa fa-bolt'> </i>  "+round(message.voltage,2)+" V");
         $(".battery-label").removeClass("label-default");
        $(".battery-label").addClass("label-warning");




         var batteryPercentage=parseInt((round(message.voltage,2)-minVolt)*100/(maxVolt-minVolt));
        if(batteryPercentage<0){
            batteryPercentage=0;
        }
        if(batteryPercentage<40){
            $(".progress-stat-percent").removeClass("green1");
            $(".progress-stat-percent").addClass("orange");
            $(".battery-text").removeClass("battery-green");
            $(".battery-text").addClass("battery-red");
        }else{
            $(".progress-stat-percent").addClass("green1");
            $(".progress-stat-percent").removeClass("orange");
            $(".battery-text").addClass("battery-green");
            $(".battery-text").removeClass("battery-red");

        }

        $(".battery-text").html(batteryPercentage+"% ");
        $("li").attr("data-percent",(batteryPercentage+2)+"%");

        $('.progress-stat-bar li').each(function () {
            $(this).find('.progress-stat-percent').animate({
                height: $(this).attr('data-percent')
            }, 1000);
        });

        /*Knob*/


    });

    // var listenerLocPosSetpoint = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/mavros/setpoint_raw/target_local',
    //         messageType : 'mavros_msgs/PositionTarget'
    // });

    // listenerLocPosSetpoint.subscribe(function(message) {
    //     $('#posXSetpoint').text(round(message.position.x,3));
    //     $('#posYSetpoint').text(round(message.position.y,3));
    //     $('#posZSetpoint').text(round(message.position.z,3));
    //     $('#yawSetpoint').text(round(message.yaw,3));

    // });

    // var listenerSitlLocPosSetpoint = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/iris/vehicle_local_position_setpoint',
    //         messageType : 'px4/vehicle_local_position_setpoint'
    // });

    // listenerSitlLocPosSetpoint.subscribe(function(message) {

    //     $('#posXSetpoint').text(round(message.x,3));
    //     $('#posYSetpoint').text(round(message.y,3));
    //     $('#posZSetpoint').text(round(message.z,3));
    //     $('#yawSetpoint').text(round(message.yaw,3));

    // });

    // var listenerObjectCentroid = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/object/centroid',
    //         messageType : 'std_msgs/Float32MultiArray'
    // });

    // listenerObjectCentroid.subscribe(function(message) {
    //      $("#imageFrameX").html(round(message.data[0],3));
    //      $("#imageFrameY").html(round(message.data[1],3));
    //      $("#bodyFrameX").html(round(message.data[2],3));
    //      $("#bodyFrameY").html(round(message.data[3],3));
    //      $("#NEDFrameX").html(round(message.data[4],3));
    //      $("#NEDFrameY").html(round(message.data[5],3));

    //     /*Knob*/


    // });

   //  var listenerLocalPosition = new ROSLIB.Topic({
   //         ros :ros,
   //         name : '/'+namespace+'/mavros/local_position/local',
   //         messageType : 'geometry_msgs/TwistStamped',
   //         throttle_rate: 200
   // });

   //  var velxList=[],velyList=[],velzList=[],posxList=[],posyList=[],poszList=[];

   // listenerLocalPosition.subscribe(function(message) {
   //          // console.log(message);
   //         $('#posx').text(round(message.twist.linear.x,3));
   //         $('#posy').text(round(message.twist.linear.y,3));
   //         $('#posz').text(round(message.twist.linear.z,3));
   //         // $('#velx').text(round(message.twist.angular.x,3));
   //         // $('#vely').text(round(message.twist.angular.y,3));
   //         // $('#velz').text(round(message.twist.angular.z,3));
   //         if(flagPagePlot){
   //             if(velxList.length<200){
   //              posxList.push(round(message.twist.linear.x,3));
   //              posyList.push(round(message.twist.linear.y,3));
   //              poszList.push(round(message.twist.linear.z,3));
   //              velxList.push(round(message.twist.angular.x,3));
   //              velyList.push(round(message.twist.angular.y,3));
   //              velzList.push(round(message.twist.angular.z,3));
   //          }
   //          else{

   //              posxzList.shift();
   //              posyList.shift();
   //              poszList.shift();
   //              velxzList.shift();
   //              velyList.shift();
   //              velzList.shift();
   //          }

   //          finalvelx=[], finalvely=[],finalvelz=[],finalposx=[], finalposy=[],finalposz=[];
   //          for (var i = 0; i < velxList.length; ++i) {
   //              finalposx.push([i, posxList[i]]);
   //              finalposy.push([i, posyList[i]]);
   //              finalposz.push([i, poszList[i]]);
   //              finalvelx.push([i, velxList[i]]);
   //              finalvely.push([i, velyList[i]]);
   //              finalvelz.push([i, velzList[i]]);

   //          }
   //      }
   // });



    // var listenerRosout = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/rosout',
    //         messageType : 'rosgraph_msgs/Log',
    //         throttle_rate: 50
    // });

    // listenerRosout.subscribe(function(message) {

    //     var text= message.msg.search("FCU");
    //     if(text>=0){
    //         $(".rosout-messages,.sidebar-rosout-messages").append("\n--  "+message.msg);
    //         // $(".rosout-messages").animate({
    //         //     scrollTop:$(".rosout-messages")[0].scrollHeight - $(".rosout-messages").height()
    //         // },50);
    //         $(".sidebar-rosout-messages").animate({
    //             scrollTop:$(".sidebar-rosout-messages")[0].scrollHeight - $(".sidebar-rosout-messages").height()
    //         },50);

    //     } 
    // });
    // var listenerExtendedState = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/mavros/extended_state',
    //         messageType : 'mavros_msgs/ExtendedState',
    //         throttle_rate: 200
    // });


    // listenerExtendedState.subscribe(function(message) {
    //     landed_state=message.landed_state;

    //     if (landed_state==2 ){


    //             // $(".take-off").prop("disabled",false);
    //             $(".take-off").addClass("land");
    //             $(".land").removeClass("take-off");
    //             $(".land").attr("href","");
    //             $(".land").html("Land");

    //     }else if(landed_state==1){


    //             // $(".land").prop("disabled",false);
    //             $(".land").addClass("take-off");
    //             $(".take-off").removeClass("land");
    //             $(".take-off").attr("href","");
    //             $(".take-off").html("take-off");
    //     }

    // });

    var listenerState = new ROSLIB.Topic({
            ros :ros,
            name : '/'+namespace+'/flyt/state',
            messageType : 'mavros_msgs/State',
            throttle_rate: 200
    });


    listenerState.subscribe(function(message) {
        $(".vehicle-mode-text").html(message.mode);

         $(".con-label").html("<i class='fa fa-heart'> </i>  Connected");
        $(".con-label").removeClass("label-danger");
        $(".con-label").addClass("label-success");

        $(".connect-widget-text").html("Active");
        $(".connect-widget").addClass("orange");

        $(".connect-widget-logo").addClass("fa-heart");
        $(".connect-widget-logo").removeClass("fa-heart-o");

        setTimeout(function(){
            $(".connect-widget-logo").removeClass("fa-heart");
            $(".connect-widget-logo").addClass("fa-heart-o");
        },700);

            clearTimeout(disconnectTimeout);
            disconnectTimeout=window.setTimeout(function(){
                // gauge.set(0);
                flag=0;

                $(".con-label").html("<i class='fa fa-heart'> </i>  Disconnected");
                $(".con-label").removeClass("label-success");
               $(".con-label").addClass("label-danger");

                $(".connect-widget-text").html("Offline")
                $(".connect-widget").removeClass("orange");

                $(".arm-label").html("<i class='fa fa-warning'> </i>  Disarmed");
               $(".arm-label").addClass("label-default");
               $(".arm-label").removeClass("label-danger");
                $(".arm-label").removeClass("label-success");

                $(".mode-label").html("    Mode");
               $(".mode-label").addClass("label-default");
               $(".mode-label").removeClass("label-primary");


                $(".battery-label").html("<i class='fa fa-bolt'> </i>  0 V");
                $(".battery-label").addClass("label-default");
               $(".battery-label").removeClass("label-warning");

                $(".gps-label").html("<i class='fa fa-map-marker'> </i>  No GPS");
                $(".gps-label").removeClass("label-danger"," label-success");
                $(".gps-label").addClass("label-default");

                // $(".frame-label").html("<i class='fa fa-arrows'> </i>  Frame");
                // $(".frame-label").removeClass("label-info");
                // $(".frame-label").addClass("label-default");

                $(".gps-widget-text").html("No GPS");
                $(".gps-widget").removeClass("tar");

                $("#flytName").html("--");
                $(".name-widget").removeClass("tar");


                // getNamespace();


            },5000);


        if (message.armed){
             $(".arm-label").html("<i class='fa fa-warning'> </i>  Armed");
            $(".arm-label").removeClass("label-default");
            $(".arm-label").addClass("label-success");
            $(".arm-label").removeClass("label-danger");
        }
        else{
            $(".arm-label").html("<i class='fa fa-warning'> </i>  Disarmed");
           $(".arm-label").removeClass("label-default");
           $(".arm-label").addClass("label-danger");
            $(".arm-label").removeClass("label-success");

        }

         $(".mode-label").html("    "+message.mode);
        $(".mode-label").removeClass("label-default");
        $(".mode-label").addClass("label-primary");


    });


    // var listenerAttitude = new ROSLIB.Topic({
    //         ros :ros,
    //         name : '/'+namespace+'/mavros/imu/data_euler',
    //         messageType : 'geometry_msgs/TwistStamped',
    //         throttle_rate: 100
    // });

    // var rollList=[],pitchList=[],yawList=[],rollSpeedList=[],pitchSpeedList=[],yawSpeedList=[];
    // listenerAttitude.subscribe(function(message){
    //     // console.log(message);

    //     if(round(message.twist.linear.y,3)>-0.75 & round(message.twist.linear.y,3)<0.75 ){
    //             var calTop=parseInt(35+round(message.twist.linear.y,3)*33);
    //              // console.log(calTop+" "+message.twist.linear.y);
    //             $("#ground").css({top: calTop+"%"});
    //         }

    //     $("#HUDw").rotate(round(message.twist.linear.x,3)*(-57.2958));
    //     $("#img-roll-gauge").rotate(round(message.twist.linear.x,3)*-57.2958);
    //     $("#img-compass").rotate(round(message.twist.linear.z,3)*57.2958);
    //     $(".roll-value").html(round(message.twist.linear.x*57.2958,2)+" °");
    //     $(".yaw-value").html(round(message.twist.linear.z*57.2958,2)+" °");
    //     $(".pitch-value").html(round(message.twist.linear.y*57.2958,2)+" °");


    //         if(flagPagePlot|flagDashboardPlot){
    //         if(rollList.length<200){
    //             rollList.push(round(message.twist.linear.x,3));
    //             pitchList.push(round(message.twist.linear.y,3));
    //             yawList.push(round(message.twist.linear.z,3));
    //             rollSpeedList.push(round(message.twist.angular.x,3));
    //             pitchSpeedList.push(round(message.twist.angular.y,3));
    //             yawSpeedList.push(round(message.twist.angular.z,3));
    //         }
    //         else{

    //             rollList.shift();
    //             pitchList.shift();
    //             yawList.shift();
    //             rollSpeedList.shift();
    //             pitchSpeedList.shift();
    //             yawSpeedList.shift();
    //         }

    //         finalroll=[], finalpitch=[],finalyaw=[],finalSpeedroll=[], finalSpeedpitch=[],finalSpeedyaw=[];
    //         for (var i = 0; i < rollList.length; ++i) {
    //             finalroll.push([i, rollList[i]]);
    //             finalpitch.push([i, pitchList[i]]);
    //             finalyaw.push([i, yawList[i]]);
    //             finalSpeedroll.push([i, rollSpeedList[i]]);
    //             finalSpeedpitch.push([i, pitchSpeedList[i]]);
    //             finalSpeedyaw.push([i, yawSpeedList[i]]);

    //         }
    //     }
    //     var plot = $.plot($("#reatltime-chart #reatltime-chartContainer"),[finalroll,finalpitch,finalyaw], {
    //         series: {
    //             lines: {
    //                 show: true,
    //                 fill: false
    //             },
    //             shadowSize: 0
    //         },
    //         yaxis: {
    //              min: -3.5,
    //              max: +3.5,
    //             ticks: 10
    //         },
    //         xaxis: {
    //             show: false
    //         },
    //         grid: {
    //             hoverable: true,
    //             clickable: true,
    //             tickColor: "#f9f9f9",
    //             borderWidth: 1,
    //             borderColor: "#eeeeee"
    //         },
    //         colors: ["#ff0000","#00ff00","#0000ff"],
    //         tooltip: true,
    //         tooltipOpts: {
    //             defaultTheme: false
    //         }
    //     });

    //     if(flagDashboardPlot){
    //         plot.setData([finalroll,finalpitch,finalyaw]);
    //         plot.draw();
    //     }

        

    // });


//     var listenerGlobalPositionRaw = new ROSLIB.Topic({
//             ros :ros,
//             name : '/'+namespace+'/mavros/global_position/raw/fix',
//             messageType : 'sensor_msgs/NavSatFix',
//             throttle_rate: 1000
//     });


//     var gpsTimeout;
//     listenerGlobalPositionRaw.subscribe(function(message) {

//         if(gpsTimeout)clearTimeout(gpsTimeout);

//         if(Math.sqrt(message.position_covariance[4])===0){

//             $(".gps-label").html("<i class='fa fa-map-marker'> </i>  No GPS Lock");
//             $(".gps-label").removeClass("label-danger");
//             $(".gps-label").removeClass("label-success");
//             $(".gps-label").addClass("label-default");


//             $(".gps-widget-text").html("No GPS Lock");
//             $(".gps-widget").removeClass("tar");


//         }
//         else if(Math.sqrt(message.position_covariance[4])<14){
//             $(".gps-label").html("<i class='fa fa-map-marker'> </i>  GPS Lock");
//             $(".gps-label").removeClass("label-danger");
//             $(".gps-label").addClass("label-success");

//             $(".gps-widget-text").html("GPS Lock");
//             $(".gps-widget").addClass("tar");


//          }
//          else{

//             $(".gps-label").html("<i class='fa fa-map-marker'> </i>  No GPS Lock");
//             $(".gps-label").removeClass("label-success");
//             $(".gps-label").addClass("label-danger");

//             $(".gps-widget-text").html("No GPS Lock");
//             $(".gps-widget").removeClass("tar");
//          }

//         gpsTimeout=setTimeout(function(){
//             $(".gps-label").html("<i class='fa fa-map-marker'> </i>  No GPS");
//             $(".gps-label").removeClass("label-danger"," label-success");
//             $(".gps-label").addClass("label-default");
//             $(".gps-widget-text").html("No GPS ");
//             $(".gps-widget").removeClass("tar");
//         },2500);


//     });


}


$(".take-off-button").click(function(){

    var msgdata={};
    msgdata["takeoff_alt"]=3.00;
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/take_off",
       success: function(data){console.log(data);

           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Takeoff message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System set to Take off . LOOK OUT!!',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
           else{
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Takeoff message rejected ',
                           // (string | mandatory) the text inside the notification
                           text: 'System error',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
       },
               error: function(){
                   $.gritter.add({
                               // (string | mandatory) the heading of the notification
                               title: 'Failed to contact flytpod ',
                               // (string | mandatory) the text inside the notification
                               text: 'Retry',
                               // (string | optional) the image to display on the left
                               image: 'images/avatar-mini.png',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });
});

$(".land-button").click(function(){
    var msgdata={};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/land",
       success: function(data){

           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Land message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System set to land. LOOK OUT!!',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
           else{
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Land message rejected ',
                           // (string | mandatory) the text inside the notification
                           text: 'System error',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
       },
               error: function(){
                   $.gritter.add({
                               // (string | mandatory) the heading of the notification
                               title: 'Failed to contact flytpod ',
                               // (string | mandatory) the text inside the notification
                               text: 'Retry',
                               // (string | optional) the image to display on the left
                               image: 'images/avatar-mini.png',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });

});

$(".snapshot-container").on("click","img.gallery-img",function(){
    $("#modal-img").attr("src",$(this).attr("src"));
});


$(".start-video").click(function(){
    if(videoLink==""|videoLink=="none"){
        $(".stop-video").trigger("click");
    }else{
        $(".video-page-img-container").html("<br><button type='button' class='btn btn-info btn-lg snapshot' ><i class='fa fa-camera'></i></button><img id='video-page-img'src='' width=100% >");
        $("#video-page-img").attr("src","http://"+videoip+":8080/stream?topic="+videoLink+"&width=320&height=240&rate="+$("#image-rate").val()+"&type=ros_compressed");
        $(".video-page-div").show(200);
    } 
  // setTimeout(function(){jqcrop();},1000);
  
});


$(".stop-video").click(function(){
    // $(".video-page-obj-track-img").remove();
    $(".video-page-img-container").html("");

});
var onLoadFlag=1;


$(".start-obj-track-video").click(function(){
    $(".vanish").hide(200);

    // if (onLoadFlag==1){

      // $(".video-page-obj-track-img-container").html("<br><img id='video-page-obj-track-img' src='' width=100% >");//<br><img id='video-page-bin-img' src='' width=100% ><div class='row blanket' style='height:100%; width:100%;background-color:white;position:absolute;z-index:1000;'></div>");
    // }
    $(".video-page-obj-track-div").show(200);
    $(".video-page-obj-track-img-container").show(200);
    // $(".blanket").hide(200);
    // $("#video-page-obj-track-img").attr("src","http://"+videoip+":8080/stream?topic=/"+namespace+"/object/object_image&width=320&height=240&rate="+$("#image-rate").val());
    // $("#video-page-bin-img").attr("src","http://"+videoip+":8080/stream?topic=/"+namespace+"/object/bin_image&width=320&height=240&rate="+$("#image-rate").val());
                
    
    setTimeout(function(){
        if (onLoadFlag==1){
            if(global_ob_track_mode==1){
                $(".start-circle").trigger("click");
            }else if(global_ob_track_mode==0){
                $(".start-color").trigger("click");
            }
            else if(global_ob_track_mode==2){
                $(".start-tld").trigger("click");

            }
          jqcrop();

        }
        // console.log(jcrop_api);

        jcrop_api.setImage("http://"+videoip+":8080/stream?topic=/"+namespace+"/object/object_image&width=320&height=240&rate="+$("#image-rate").val()+"&type=ros_compressed");
        // console.log($('#video-page-obj-track-img').attr("src"));

        onLoadFlag++;   

    },1000);
  
});


$(".stop-obj-track-video").click(function(){
            // jcrop_api.setImage("",function(){console.log()});

  // jcrop_api.destroy();
    // $(".blanket").show(200);
    jcrop_api.setImage("");
    $(".video-page-obj-track-img-container").hide();
    $("#video-page-obj-track-img").attr("src","");
    // $("#video-page-bin-img").attr("src","");
    

});

$(".video-page-img-container").on("click","button.snapshot",function(){

    var d= new Date();
    $(".snapshot-container").append(" <div class='row item'><a href='#myModal' data-toggle='modal'><img class ='gallery-img' src='http://"+videoip+":8080/snapshot?topic="+videoLink+"&"+d.getTime()+"' /></a></div>");
});


function jqcrop(){
// jQuery(function jqcrop($){

    $('#video-page-obj-track-img').Jcrop({
        // onChange:   showCoords,
        onSelect:   finalCoords,
        // onRelease:  clearCoords
    }, function(){
        jcrop_api = this;
     });
}


// Publishing a Topic
// ------------------






// $('#coords').on('change','input',function(e){
//  var x1 = $('#x1').val(),
//      x2 = $('#x2').val(),
//      y1 = $('#y1').val(),
//      y2 = $('#y2').val();
//  jcrop_api.setSelect([x1,y1,x2,y2]);
// });
// });
  // Simple event handler, called from onChange and onSelect
  // event handlers, as per the Jcrop invocation above
  var cc;
function showCoords(c)
{
    // $('#x1').val(c.x);
    // $('#y1').val(c.y);
    // $('#x2').val(c.x2);
    // $('#y2').val(c.y2);
    // $('#w').val(c.w);
    // $('#h').val(c.h);
    // cc=c;
}


var count =0;
var selection = new ROSLIB.Message({ data : [0, 0, 0, 0] });
function finalCoords(c)
{
//   console.log($("#video-page-obj-track-img"+random).width());
// console.log($("#video-page-obj-track-img"+random).height());

    // selection.data[0] = Math.floor(JSON.parse(c.x)*320/parseInt($("#video-page-obj-track-img").width()));
    // selection.data[1] = Math.floor(JSON.parse(c.y)*240/parseInt($("#video-page-obj-track-img").height()));
    // selection.data[2] = Math.floor(JSON.parse(c.w)*320/parseInt($("#video-page-obj-track-img").width()));
    // selection.data[3] = Math.floor(JSON.parse(c.h)*240/parseInt($("#video-page-obj-track-img").height()));

    selection.data[0] = Math.floor(JSON.parse(c.x));
    selection.data[1] = Math.floor(JSON.parse(c.y));
    selection.data[2] = Math.floor(JSON.parse(c.w));
    selection.data[3] = Math.floor(JSON.parse(c.h));
    if ( (selection.data[2] > 0) || (selection.data[3] > 0) ) {
        objSelect.publish(selection);
    }


    jcrop_api.release();
    // count = count +1;
    // console.log(count);
    // $('#data').val(selection.z);
}

function clearCoords()
{

     // $('#coords input').val('');
}

$(".stop-track").click(function(){
console.log(selection);
    selection.data[0] = JSON.parse(0);
    selection.data[1] = JSON.parse(0);
    selection.data[2] = JSON.parse(0);
    selection.data[3] = JSON.parse(0);
    objSelect.publish(selection);
});


$(".zoom-in").click(function(){
  if(plotMax>1){
    plotMax-=5;
    plotMin+=5;
  }
});
$(".zoom-out").click(function(){
  // if(plotMax>1){
    plotMax+=5;
    plotMin-=5;
  // }
});
$(".uncheck-all").click(function(){
  $('.roll').attr('checked', false);
  $('.pitch').attr('checked', false);
  $('.yaw').attr('checked', false);
  $('.roll-speed').attr('checked', false);
  $('.pitch-speed').attr('checked', false);
  $('.yaw-speed').attr('checked', false);
  $('.posx').attr('checked', false);
  $('.posy').attr('checked', false);
  $('.posz').attr('checked', false);
  $('.velx').attr('checked', false);
  $('.vely').attr('checked', false);
  $('.velz').attr('checked', false);
});
// $("#track").click(function(){
//  finalCoords(cc);
// });
$(".takeoff").click(function(){
    // $(".take-off").prop("disabled",true);
    var msgdata={};
    msgdata["takeoff_alt"]=parseFloat($("#takeoffheight").val());
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/take_off",
       success: function(data){console.log(data);

           if(data.success){

               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Takeoff message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System set to Take off . LOOK OUT!!',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
           else{
                

               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Takeoff message rejected ',
                           // (string | mandatory) the text inside the notification
                           text: 'System error',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
       },
               error: function(){

                   $.gritter.add({
                               // (string | mandatory) the heading of the notification
                               title: 'Failed to contact flytpod ',
                               // (string | mandatory) the text inside the notification
                               text: 'Retry',
                               // (string | optional) the image to display on the left
                               image: 'images/avatar-mini.png',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });
});

$(".land").click(function(){
    var msgdata={};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/land",
       success: function(data){

           if(data.success){
            

               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Land message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System set to land. LOOK OUT!!',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
           else{
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Land message rejected ',
                           // (string | mandatory) the text inside the notification
                           text: 'System error',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
           }
       },
               error: function(){
                   $.gritter.add({
                               // (string | mandatory) the heading of the notification
                               title: 'Failed to contact flytpod ',
                               // (string | mandatory) the text inside the notification
                               text: 'Retry',
                               // (string | optional) the image to display on the left
                               image: 'images/avatar-mini.png',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });

});

// $(".video-page-obj-track-div").on("click","button.disarm",function(){
//     var msgdata={};
//     $.ajax({
//        type: "POST",
//        headers: { 'Authentication-Token': sessionStorage.getItem('token') },
//        dataType: "json",
//        data: JSON.stringify(msgdata),
//        url: restPath+"/ros/"+namespace+"/navigation/disarm",
//        success: function(data){
//            if(data.success){

//                 $(".disarm").prop("disabled",false);
//                 $(".disarm").addClass("take-off");
//                 $(".take-off").removeClass("disarm");
//                 $(".take-off").attr("href","#takeoff");

//                 $(".take-off").html("Take off");


//                $.gritter.add({
//                            // (string | mandatory) the heading of the notification
//                            title: 'Disarm message recieved by FlytPOD ',
//                            // (string | mandatory) the text inside the notification
//                            text: 'System disarmed. AT EASE!!',
//                            // (string | optional) the image to display on the left
//                            image: 'images/avatar-mini.png',
//                            // (bool | optional) if you want it to fade out on its own or just sit there
//                            sticky: false,
//                            // (int | optional) the time you want it to be alive for before fading out
//                            time: ''
//                        });
//            }
//            else{
//                $.gritter.add({
//                            // (string | mandatory) the heading of the notification
//                            title: 'Disarm message rejected ',
//                            // (string | mandatory) the text inside the notification
//                            text: 'System error',
//                            // (string | optional) the image to display on the left
//                            image: 'images/avatar-mini.png',
//                            // (bool | optional) if you want it to fade out on its own or just sit there
//                            sticky: false,
//                            // (int | optional) the time you want it to be alive for before fading out
//                            time: ''
//                        });
//            }
//        },
//                error: function(){
//                    $.gritter.add({
//                                // (string | mandatory) the heading of the notification
//                                title: 'Failed to contact flytpod ',
//                                // (string | mandatory) the text inside the notification
//                                text: 'Retry',
//                                // (string | optional) the image to display on the left
//                                image: 'images/avatar-mini.png',
//                                // (bool | optional) if you want it to fade out on its own or just sit there
//                                sticky: false,
//                                // (int | optional) the time you want it to be alive for before fading out
//                                time: ''
//                            });
//                }
//            });
// });
$(".save-param").click(function(){
    saveParam();
});
$(".col-md-4").on("click","button.start-follow",function(){
    setParam('ob_track_follow','1');
    $(".start-follow").addClass("stop-follow btn-danger");
    $(".stop-follow").removeClass("start-follow btn-success");
    $(".stop-follow").html("Stop");
})

$(".col-md-4").on("click","button.stop-follow",function(){
    setParam('ob_track_follow','0');
    $(".stop-follow").addClass("start-follow btn-success");
    $(".start-follow").removeClass("stop-follow btn-danger");
    $(".start-follow").html("Start");
})

// $("start-circle").click(function(){

//     setParam('ob_track_mode','1');
// });

// $("start-color").click(function(){

//     setParam('ob_track_mode','0');
// });


// $(".col-md-4").on("click","button.start-circle",function(){
//     setParam('ob_track_mode','1');
//     $(".start-circle").addClass("stop-circle btn-danger");
//     $(".stop-circle").removeClass("start-circle btn-success");
//     $(".stop-circle").html("Stop");
// })

// $(".col-md-4").on("click","button.stop-circle",function(){
//     // setParam('ob_track_mode','0');
//     $(".stop-circle").addClass("start-circle btn-success");
//     $(".start-circle").removeClass("stop-circle btn-danger");
//     $(".start-circle").html("Start");

//     stopTrack();
// })

$("#ob_track_kp, #ob_track_kd, #ob_track_vel_xy_min, #ob_track_vel_xy_max, #ob_track_tolerance_outer, #ob_track_tolerance_inner").change(function(){
    setParam($(this).attr("id"),$(this).val());
});

var firstCircleClickFlag=1;
$(".start-circle").click(function(){
    
    $("#color").hide();
    $("#tld").hide();
    $("#circle").show(200);
    $(".start-circle").addClass("btn-info");
    $(".start-color").removeClass("btn-info");
    $(".start-tld").removeClass("btn-info");
    setTimeout(function(){
        if (firstCircleClickFlag){
            $(".circle-sliders").ionRangeSlider({
                                             min: 1,
                                             max: 255,
                                             from: 50,
                                             type: 'single',
                                             step: 1,
                                             prettify: false
                                         });
        }
        $('#ob_track_ct').ionRangeSlider("update", {
                        from:global_ob_track_ct ,
                         onFinish: function (data) {
                            setParam("ob_track_ct",data.fromNumber);
                            $("#ob_track_ct_tb").val(parseInt(data.fromNumber));
                         }
                      });
        $('#ob_track_at').ionRangeSlider("update", {
                        from:global_ob_track_at ,
                         onFinish: function (data) {
                            setParam("ob_track_at",data.fromNumber);
                            $("#ob_track_at_tb").val(parseInt(data.fromNumber));

                         }
                      });
        $('#ob_track_ir').ionRangeSlider("update", {
                        from:global_ob_track_ir ,
                         onFinish: function (data) {
                            setParam("ob_track_ir",data.fromNumber);
                            $("#ob_track_ir_tb").val(parseInt(data.fromNumber));


                         }
                      });
        $('#ob_track_mr').ionRangeSlider("update", {
                        from:global_ob_track_mr ,
                         onFinish: function (data) {
                            setParam("ob_track_mr",data.fromNumber);
                            $("#ob_track_mr_tb").val(parseInt(data.fromNumber));

                         }
                      });
    },500);
    firstCircleClickFlag++;

        setParam('ob_track_mode','1');


});

var firstColorClickFlag=1;
$(".start-color").click(function(){

    $(".start-color").addClass("btn-info");
    $(".start-circle").removeClass("btn-info");
    $(".start-tld").removeClass("btn-info");
    $("#circle").hide();
    $("#tld").hide();
    $("#color").show(200);

    setTimeout(function(){
        if (firstColorClickFlag){
            $(".color-sliders").ionRangeSlider({
                                             min: 1,
                                             max: 125,
                                             from: 50,
                                             type: 'single',
                                             step: 1,
                                             prettify: false
                                         });
        }
        $('#ob_track_hrange').ionRangeSlider("update", {
                        from:global_ob_track_hrange ,
                         onFinish: function (data) {
                            setParam("ob_track_hrange",data.fromNumber);
                            $("#ob_track_hrange_tb").val(parseInt(data.fromNumber));
                         }
                      });
        $('#ob_track_srange').ionRangeSlider("update", {
                        from:global_ob_track_srange ,
                         onFinish: function (data) {
                            setParam("ob_track_srange",data.fromNumber);
                            $("#ob_track_srange_tb").val(parseInt(data.fromNumber));

                         }
                      });
        $('#ob_track_vrange').ionRangeSlider("update", {
                        from:global_ob_track_vrange ,
                         onFinish: function (data) {
                            setParam("ob_track_vrange",data.fromNumber);
                            $("#ob_track_vrange_tb").val(parseInt(data.fromNumber));


                         }
                      });
        },500);
    firstColorClickFlag++;
        setParam('ob_track_mode','0');



});



$(".start-tld").click(function(){
    
    $("#color").hide();
    $("#circle").hide();
    $("#tld").show(200);
    $(".start-tld").addClass("btn-info");
    $(".start-color").removeClass("btn-info");
    $(".start-circle").removeClass("btn-info");
   

    setParam('ob_track_mode','2');

    // $("#ob_track_tld_learning_disabled").prop('checked',true).trigger("change");

});




$("#ob_track_ct_tb, #ob_track_at_tb , #ob_track_ir_tb, #ob_track_mr_tb, #ob_track_hrange_tb, #ob_track_srange_tb, #ob_track_vrange_tb").change(function(){
    var id=$(this).attr("id")+'';
    var temp=id.substring(0,id.indexOf("_tb"));
    $("#"+temp).ionRangeSlider("update",{
        from:parseInt($(this).val())
    });
    setParam(temp,$(this).val());
});
$(".col-md-3").on("click","button.start-centroid",function(){
    $("#centroid").show(200);
    $(".start-centroid").addClass("stop-centroid btn-info");
    $(".stop-centroid").removeClass("start-centroid");

});
$(".col-md-3").on("click","button.stop-centroid",function(){
    $("#centroid").hide(200);
    $(".stop-centroid").addClass("start-centroid");
    $(".start-centroid").removeClass("stop-centroid btn-info");

});
$(".col-md-3").on("click","button.start-setpoint",function(){
    $("#setpoint").show(200);
    $(".start-setpoint").addClass("stop-setpoint btn-info");
    $(".stop-setpoint").removeClass("start-setpoint");
});
$(".col-md-3").on("click","button.stop-setpoint",function(){
    $("#setpoint").hide(200);
    $(".stop-setpoint").addClass("start-setpoint");
    $(".start-setpoint").removeClass("stop-setpoint btn-info");

});
$(".col-md-3").on("click","button.start-local-pos",function(){
    $("#locPos").show(200);
    $(".start-local-pos").addClass("stop-local-pos btn-info");
    $(".stop-local-pos").removeClass("start-local-pos");
});
$(".col-md-3").on("click","button.stop-local-pos",function(){
    $("#locPos").hide(200);
    $(".stop-local-pos").addClass("start-local-pos");
    $(".start-local-pos").removeClass("stop-local-pos btn-info");

});
$('#ob_track_compensate').on('switchChange.bootstrapSwitch', function(event, state) {
  setParam("ob_track_compensate",Number(state));
});
$('#ob_track_tld_learning_disabled').on('switchChange.bootstrapSwitch', function(event, state) {
  setParam("ob_track_tld_learning_disabled",Number(!state));
});
$('#ob_track_tld_detector_disabled').on('switchChange.bootstrapSwitch', function(event, state) {
  setParam("ob_track_tld_detector_disabled",Number(!state));
});
$('#ob_track_tld_new_object').on('switchChange.bootstrapSwitch', function(event, state) {
  setParam("ob_track_tld_new_object",Number(state));
});

// $('#ob_track_compensate').bind('change', function(){
//   if($(this).prop('checked'))  setParam("ob_track_compensate",1);
//   else setParam("ob_track_compensate",0);
// });

// $('#ob_track_tld_learning_disabled').bind('change', function(){
//   if($(this).prop('checked'))  setParam("ob_track_tld_learning_disabled",0);
//   else setParam("ob_track_tld_learning_disabled",1);
// });

// $('#ob_track_tld_detector_disabled').bind('change', function(){
//   if($(this).prop('checked'))  setParam("ob_track_tld_detector_disabled",0);
//   else setParam("ob_track_tld_detector_disabled",1);
// });

// $('#ob_track_tld_new_object').bind('change', function(){
//   if($(this).prop('checked'))  setParam("ob_track_tld_new_object",1);
//   else setParam("ob_track_tld_new_object",0);
// });

$(".clear-model").click(function(){

    setParam('ob_track_tld_clear_model','1');
});

$(".import-model").click(function(){

    setParam('ob_track_tld_import_model','1');
});

$(".export-model").click(function(){

    setParam('ob_track_tld_export_model','1');
});




var sonarData = new ROSLIB.Message({ data : [40, 0, 0, 1, 1, 1, 1, 20] });

$('#sonar-1').on('switchChange.bootstrapSwitch', function(event, state) {
  sonarData.data[5]=Number(state);
  sonarToggle.publish(sonarData);
  
});


$('#sonar-2').on('switchChange.bootstrapSwitch', function(event, state) {
  sonarData.data[6]=Number(state);
  sonarToggle.publish(sonarData);
  
});

$('#sonar-3').on('switchChange.bootstrapSwitch', function(event, state) {
  sonarData.data[3]=Number(state);
  sonarToggle.publish(sonarData);
  
});

$('#sonar-4').on('switchChange.bootstrapSwitch', function(event, state) {
  sonarData.data[4]=Number(state);
  sonarToggle.publish(sonarData);
  
});

$('#sonar-5').on('switchChange.bootstrapSwitch', function(event, state) {
  sonarData.data[1]=Number(state);
  sonarToggle.publish(sonarData);
  
});


$('#sonar-6').on('switchChange.bootstrapSwitch', function(event, state) {
  sonarData.data[2]=Number(state);
  sonarToggle.publish(sonarData);
  
});


$('#sonar-data-rate').change(function(){
  $("#rate-value").text("The current Data Rate is "+$(this).val()+" Hz");

  sonarData.data[0]=parseInt($(this).val());
  sonarToggle.publish(sonarData);
});

$('#sonar-data-threshold').change(function(){
  $("#threshold-value").text("The current Threshold is "+$(this).val()+" cm");

  sonarData.data[7]=parseInt($(this).val());
  sonarToggle.publish(sonarData);
});