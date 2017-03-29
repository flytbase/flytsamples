(function ($) {

    "use strict";
    $(document).ready(function () {


        /*==Left Navigation Accordion ==*/
        if ($.fn.dcAccordion) {
            $('#nav-accordion').dcAccordion({
                eventType: 'click',
                autoClose: true,
                saveState: true,
                disableLink: true,
                speed: 'slow',
                showCount: false,
                autoExpand: true,
                classExpand: 'dcjq-current-parent'
            });
        }
        /*==Slim Scroll ==*/
        if ($.fn.slimScroll) {
            $('.event-list').slimscroll({
                height: '305px',
                wheelStep: 20
            });
            $('.conversation-list').slimscroll({
                height: '360px',
                wheelStep: 35
            });
            $('.to-do-list').slimscroll({
                height: '300px',
                wheelStep: 35
            });
        }
        /*==Nice Scroll ==*/
        if ($.fn.niceScroll) {


            $(".leftside-navigation").niceScroll({
                cursorcolor: "#1FB5AD",
                cursorborder: "0px solid #fff",
                cursorborderradius: "0px",
                cursorwidth: "3px"
            });

            $(".leftside-navigation").getNiceScroll().resize();
            if ($('#sidebar').hasClass('hide-left-bar')) {
                $(".leftside-navigation").getNiceScroll().hide();
            }
            $(".leftside-navigation").getNiceScroll().show();

            $(".right-stat-bar").niceScroll({
                cursorcolor: "#1FB5AD",
                cursorborder: "0px solid #fff",
                cursorborderradius: "0px",
                cursorwidth: "3px"
            });

        }

//        /*==Easy Pie chart ==*/
//        if ($.fn.easyPieChart) {

//            $('.notification-pie-chart').easyPieChart({
//                onStep: function (from, to, percent) {
//                    $(this.el).find('.percent').text(Math.round(percent));
//                },
//                barColor: "#39b6ac",
//                lineWidth: 3,
//                size: 50,
//                trackColor: "#efefef",
//                scaleColor: "#cccccc"

//            });

//            $('.pc-epie-chart').easyPieChart({
//                onStep: function(from, to, percent) {
//                    $(this.el).find('.percent').text(Math.round(percent));
//                },
//                barColor: "#5bc6f0",
//                lineWidth: 3,
//                size:50,
//                trackColor: "#32323a",
//                scaleColor:"#cccccc"

//            });

//        }

        /*== SPARKLINE==*/
        if ($.fn.sparkline) {

            $(".d-pending").sparkline([3, 1], {
                type: 'pie',
                width: '40',
                height: '40',
                sliceColors: ['#e1e1e1', '#8175c9']
            });



            var sparkLine = function () {
                $(".sparkline").each(function () {
                    var $data = $(this).data();
                    ($data.type == 'pie') && $data.sliceColors && ($data.sliceColors = eval($data.sliceColors));
                    ($data.type == 'bar') && $data.stackedBarColor && ($data.stackedBarColor = eval($data.stackedBarColor));

                    $data.valueSpots = {
                        '0:': $data.spotColor
                    };
                    $(this).sparkline($data.data || "html", $data);


                    if ($(this).data("compositeData")) {
                        $spdata.composite = true;
                        $spdata.minSpotColor = false;
                        $spdata.maxSpotColor = false;
                        $spdata.valueSpots = {
                            '0:': $spdata.spotColor
                        };
                        $(this).sparkline($(this).data("compositeData"), $spdata);
                    };
                });
            };

            var sparkResize;
            $(window).resize(function (e) {
                clearTimeout(sparkResize);
                sparkResize = setTimeout(function () {
                    sparkLine(true)
                }, 500);
            });
            sparkLine(false);



        }



//        if ($.fn.plot) {
//            var datatPie = [30, 50];
//            // DONUT
//            $.plot($(".target-sell"), datatPie, {
//                series: {
//                    pie: {
//                        innerRadius: 0.6,
//                        show: true,
//                        label: {
//                            show: false

//                        },
//                        stroke: {
//                            width: .01,
//                            color: '#fff'

//                        }
//                    }




//                },

//                legend: {
//                    show: true
//                },
//                grid: {
//                    hoverable: true,
//                    clickable: true
//                },

//                colors: ["#ff6d60", "#cbcdd9"]
//            });
//        }



        /*==Collapsible==*/
        $('.widget-head').click(function (e) {
            var widgetElem = $(this).children('.widget-collapse').children('i');

            $(this)
                .next('.widget-container')
                .slideToggle('slow');
            if ($(widgetElem).hasClass('ico-minus')) {
                $(widgetElem).removeClass('ico-minus');
                $(widgetElem).addClass('ico-plus');
            } else {
                $(widgetElem).removeClass('ico-plus');
                $(widgetElem).addClass('ico-minus');
            }
            e.preventDefault();
        });




        /*==Sidebar Toggle==*/

        $(".leftside-navigation .sub-menu > a").click(function () {
            var o = ($(this).offset());
            var diff = 80 - o.top;
            if (diff > 0)
                $(".leftside-navigation").scrollTo("-=" + Math.abs(diff), 500);
            else
                $(".leftside-navigation").scrollTo("+=" + Math.abs(diff), 500);
        });



        $('.sidebar-toggle-box .fa-bars').click(function (e) {

            $(".leftside-navigation").niceScroll({
                cursorcolor: "#1FB5AD",
                cursorborder: "0px solid #fff",
                cursorborderradius: "0px",
                cursorwidth: "3px"
            });

            $('#sidebar').toggleClass('hide-left-bar');
            if ($('#sidebar').hasClass('hide-left-bar')) {
                $(".leftside-navigation").getNiceScroll().hide();
                $('#sidebar').css("width","60");
                $('.dashboardElement').hide();
            }
            else{
                $('#sidebar').css("width","240");
                $('.dashboardElement').show(500);
            }

            $(".leftside-navigation").getNiceScroll().show();
            $('#main-content').toggleClass('merge-left');
            e.stopPropagation();
            if ($('#container').hasClass('open-right-panel')) {
                $('#container').removeClass('open-right-panel')
            }
            if ($('.right-sidebar').hasClass('open-right-bar')) {
                $('.right-sidebar').removeClass('open-right-bar')
            }

            if ($('.header').hasClass('merge-header')) {
                $('.header').removeClass('merge-header')
            }


        });
        $('.toggle-right-box .fa-bars').click(function (e) {
            $('#container').toggleClass('open-right-panel');
            $('.right-sidebar').toggleClass('open-right-bar');
            $('.header').toggleClass('merge-header');

            e.stopPropagation();
        });

        $('.header,#main-content,#sidebar').click(function () {
            if ($('#container').hasClass('open-right-panel')) {
                $('#container').removeClass('open-right-panel')
            }
            if ($('.right-sidebar').hasClass('open-right-bar')) {
                $('.right-sidebar').removeClass('open-right-bar')
            }

            if ($('.header').hasClass('merge-header')) {
                $('.header').removeClass('merge-header')
            }


        });


        $('.panel .tools .fa').click(function () {
            var el = $(this).parents(".panel").children(".panel-body");
            if ($(this).hasClass("fa-chevron-down")) {
                $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
                el.slideUp(200);
            } else {
                $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
                el.slideDown(200); }
        });



        $('.panel .tools .fa-times').click(function () {
            $(this).parents(".panel").parent().remove();
        });

        // tool tips

        $('.tooltips').tooltip();

        // popovers

        $('.popovers').popover();


    });


})(jQuery);


$(".sidebar-arm").click(function(){

    var msgdata={};
    $.ajax({
       type: "GET",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
//       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/arm",
       success: function(data){console.log(data);
           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Arm message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System armed. ATTENTION!',
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
                           title: 'Arm message rejected ',
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
               error: function(data){
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

$(".sidebar-disarm").click(function(){

    var msgdata={};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/disarm",
       success: function(data){
           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Disarm message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System disarmed. AT EASE!!',
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
                           title: 'Disarm message rejected ',
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

$(".sidebar-land").click(function(){

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

$(".sidebar-takeoff").click(function(){
    var msgdata={};
    msgdata["takeoff_alt"]=4.0;
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


$(".sidebar-hover").click(function(){
    var msgdata={};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/navigation/position_hold",
       success: function(data){console.log(data);

           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Hover message recieved by FlytPOD ',
                           // (string | mandatory) the text inside the notification
                           text: 'System set to hover.',
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
                           title: 'Hover message rejected ',
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


$(".sidebar-accel").click(function(){
    sensorCalibration(1);
});

$(".sidebar-gyro").click(function(){
    sensorCalibration(2);
});

$(".sidebar-mag").click(function(){
    sensorCalibration(3);
    $("#calibimage").attr("src","images/gallery/images/mag_calibration_figure8.png");
});

$(".sidebar-level").click(function(){
    sensorCalibration(7);
});
function sensorCalibration(id){
    var module;
    switch(id){
    case 1:module="Accelerometer";
        break;
    case 2:module="Gyrometer";
        break;
    case 3:module="Magnetometer";
        break;
    }

    var msgdata = {};
    msgdata['module_calibrate']=id;
    console.log(msgdata);
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/setup/module_calibration",
       success: function(data){
           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Calibration started',
                           // (string | mandatory) the text inside the notification
                           text: module+' calibration started successfully',
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
                           title: 'Calibration message failed',
                           // (string | mandatory) the text inside the notification
                           text: module+' calibration failed to start. Retry! ',
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

}



function motorTest(id){

    var msgdata = {};
    msgdata['actuator_id']=id;
    msgdata['time_s']=2;
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/setup/actuator_testing",
       success: function(data){
           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Rotating motor',
                           // (string | mandatory) the text inside the notification
                           text: 'Rotating motor '+id+'.',
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
                           title: 'Rotating motor failed',
                           // (string | mandatory) the text inside the notification
                           text: 'Failed to run command. Retry! ',
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
}
function motor1(){
    motorTest(1);
}

function motor2(){
    motorTest(2);
}
function motor3(){
    motorTest(3);
}
function motor4(){
    motorTest(4);
}
function motor5(){
    motorTest(5);
}
function motor6(){
    motorTest(6);
}
function motor7(){
    motorTest(7);
}
function motor8(){
    motorTest(8);
}

//$("#log-out").click(function(){
//    sessionStorage.removeItem('token');
//    window.location.href = 'http://'+ip+'/logout';
//});

$(".sidebar-reboot").click(function(){
    var msgdata = {};
    msgdata['reboot_mode']=1;
    $.ajax({
       type: "POST",
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/setup/autopilot_reboot",
       success: function(data){
           if (data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Reebooting autopilot',
                           // (string | mandatory) the text inside the notification
                           text: 'Rebooting Autopilot to apply changes. PLEASE WAIT!',
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
                           title: 'Reboot failed',
                           // (string | mandatory) the text inside the notification
                           text: 'Retry. ',
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });

           }
       },
               error:function(){
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
var flag=1;
// $(".leftside-navigation").mouseenter(function(){
// //    if(flag){
// //        $( '.sidebar-toggle-box .fa-bars' ).trigger( "click" );
// //        flag=0
// //    }
// //    setTimeout(function(){
// //        flag=1;
// //    },500);



//     $(".leftside-navigation").niceScroll({
//         cursorcolor: "#1FB5AD",
//         cursorborder: "0px solid #fff",
//         cursorborderradius: "0px",
//         cursorwidth: "3px"
//     });

//     $('#sidebar').removeClass('hide-left-bar');
//     if ($('#sidebar').hasClass('hide-left-bar')) {
//         $(".leftside-navigation").getNiceScroll().hide();
//         $('#sidebar').css("width","60");
//         $('.dashboardElement').hide();
//     }
//     else{
//         $('#sidebar').css("width","240");
//         $('.dashboardElement').show(500);
//     }

//     $(".leftside-navigation").getNiceScroll().show();
//     $('#main-content').toggleClass('merge-left');
// //    e.stopPropagation();
//     if ($('#container').hasClass('open-right-panel')) {
//         $('#container').removeClass('open-right-panel')
//     }
//     if ($('.right-sidebar').hasClass('open-right-bar')) {
//         $('.right-sidebar').removeClass('open-right-bar')
//     }

//     if ($('.header').hasClass('merge-header')) {
//         $('.header').removeClass('merge-header')
//     }





// });
// $(".leftside-navigation").mouseleave(function(){

// //    if(flag){
// //        $( '.sidebar-toggle-box .fa-bars' ).trigger( "click" );
// //        flag=0
// //    }
// //    setTimeout(function(){
// //        flag=1;
// //    },500);

//     $(".leftside-navigation").niceScroll({
//         cursorcolor: "#1FB5AD",
//         cursorborder: "0px solid #fff",
//         cursorborderradius: "0px",
//         cursorwidth: "3px"
//     });

//     $('#sidebar').addClass('hide-left-bar');
//     if ($('#sidebar').hasClass('hide-left-bar')) {
//         $(".leftside-navigation").getNiceScroll().hide();
//         $('#sidebar').css("width","60");
//         $('.dashboardElement').hide();
//     }
//     else{
//         $('#sidebar').css("width","240");
//         $('.dashboardElement').show(500);
//     }

//     $(".leftside-navigation").getNiceScroll().show();
//     $('#main-content').toggleClass('merge-left');
// //    e.stopPropagation();
//     if ($('#container').hasClass('open-right-panel')) {
//         $('#container').removeClass('open-right-panel')
//     }
//     if ($('.right-sidebar').hasClass('open-right-bar')) {
//         $('.right-sidebar').removeClass('open-right-bar')
//     }

//     if ($('.header').hasClass('merge-header')) {
//         $('.header').removeClass('merge-header')
//     }
// });


$("#download-params").click(function(){
    saveParam();

    setTimeout(function(){ window.location.href = "http://"+restPath+"/flytconsole/download/flyt_params.yaml";},1000);
});


$(".upload-button").click(function(){
    var data = new FormData($("#fform")[0]);

//    $.each(jQuery('#file')[0].files, function(i, file) {
//        data.append('file-'+i, file);
//    });


    $.ajax({
        url: restPath+'/flytconsole/upload',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
//        async: false,
        type: 'POST',
        success: function(data){
            if(data.success){

                $.gritter.add({
                            // (string | mandatory) the heading of the notification
                            title: 'File Uploaded Successfully ',
                            // (string | mandatory) the text inside the notification
                            text: 'Good Job!',
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
                            title: 'File Upload Failed ',
                            // (string | mandatory) the text inside the notification
                            text: 'Check uploaded file format',
                            // (string | optional) the image to display on the left
                            image: 'images/avatar-mini.png',
                            // (bool | optional) if you want it to fade out on its own or just sit there
                            sticky: false,
                            // (int | optional) the time you want it to be alive for before fading out
                            time: ''
                        });
            }
        },
        error: function(data){
            $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'File Upload Failed ',
                        // (string | mandatory) the text inside the notification
                        text: 'Check connection. Retry!',
                        // (string | optional) the image to display on the left
                        image: 'images/avatar-mini.png',
                        // (bool | optional) if you want it to fade out on its own or just sit there
                        sticky: false,
                        // (int | optional) the time you want it to be alive for before fading out
                        time: ''
                    });
        }
    });

    setTimeout(function(){paramLoad();},1000);


});

function paramLoad()
{
    var msgdata = {};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/param/param_load",
       success: function(data){
           if(data.success){

               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Parameters loaded',
                           // (string | mandatory) the text inside the notification
                           text: 'Parameters loaded from uploaded file.',
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
                               image: 'images/avatar-mini.jpg',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });
}

function saveParam(){
    var msgdata = {};
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/param/param_save",
       success: function(data){
           console.log(data);
           if(data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Parameters saved',
                           // (string | mandatory) the text inside the notification
                           text: 'All Parameters saved in EEPROM.',
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
                           title: 'Parameter save failed',
                           // (string | mandatory) the text inside the notification
                           text: 'Failed to save values to EEPROM. ',
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
                               image: 'images/avatar-mini.jpg',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }

           });
}

$(".dashboard-button").click(function(){
  flagDashboardPlot=true;
  flagPagePlot=false;
  $(".dashboard-section").show(200);
  $(".video-section").hide();
  $(".plot-section").hide();
}); 

$(".video-button").click(function(){
  flagDashboardPlot=false;
  flagPagePlot=false;
  $(".dashboard-section").hide();
  $(".video-section").show(200);
  $(".plot-section").hide();
}); 

$(".plot-button").click(function(){
  flagDashboardPlot=false;
  flagPagePlot=true;
  $(".dashboard-section").hide();
  $(".video-section").hide();
  $(".plot-section").show(200);
});


function setParam(id,value){
//    console.log(value);
    var msgdata = {};
    msgdata['param_info']={};
    msgdata.param_info['param_id']=id;
    msgdata.param_info['param_value']=value+'';
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/param/param_set",
       success: function(data){
           // console.log("xssss");
           if(data.success){
              // if (id=="RC_MAP_POSCTL_SW"|id=="RC_POSCTL_TH"|id=="RC_MAP_MODE_SW"|id=="RC_MAP_OFFB_SW"|id=="RC_OFFB_TH"|id=="RC_ASSIST_TH"|id=="RC_MAP_RETURN_SW"){

               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Parameter set',
                           // (string | mandatory) the text inside the notification
                           text: 'Parameter '+id+' has been set with value '+value,
                           // (string | optional) the image to display on the left
                           image: 'images/avatar-mini.png',
                           // (bool | optional) if you want it to fade out on its own or just sit there
                           sticky: false,
                           // (int | optional) the time you want it to be alive for before fading out
                           time: ''
                       });
             // }
           }
           else{
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Parameter set failed',
                           // (string | mandatory) the text inside the notification
                           text: 'Parameter '+id+' set failed to set value '+value+'. Retry! ',
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
                               image: 'images/avatar-mini.jpg',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });
}

function reboot(){
    var msgdata = {};
    msgdata['reboot_mode']=1;
    $.ajax({
       type: "POST",
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/setup/autopilot_reboot",
       success: function(data){
           if (data.success){
               $.gritter.add({
                           // (string | mandatory) the heading of the notification
                           title: 'Reebooting autopilot',
                           // (string | mandatory) the text inside the notification
                           text: 'Rebooting Autopilot to apply changes',
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
                           title: 'Reboot failed',
                           // (string | mandatory) the text inside the notification
                           text: 'Retry. ',
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
                               image: 'images/avatar-mini.jpg',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });


}

function getParam(id){
    var msgdata = {};
    msgdata['param_id']=id;
    $.ajax({
       type: "POST",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       data: JSON.stringify(msgdata),
       url: restPath+"/ros/"+namespace+"/param/param_get",
       success: function(data){
           if (data.success){
//                console.log(data.param_info.param_value);
               switch(id){
               case "SYS_AUTOSTART":
                   setFrame(data.param_info.param_value);
                   break;
               case "BAT_N_CELLS":
                   minVolt=parseInt(data.param_info.param_value)*3.2;
                   maxVolt=parseInt(data.param_info.param_value)*4.2;
                   break;
                case "ob_track_ct":
                  // console.log(parseInt(data.param_info.param_value));
                   $("#ob_track_ct_tb").val(parseInt(data.param_info.param_value));
                   // $("#ctv").html(data.param_info.param_value + ' ]');
                   global_ob_track_ct=Math.round(data.param_info.param_value);
                   
                   break;
               case "ob_track_at":
                  // console.log(parseInt(data.param_info.param_value));
                   $("#ob_track_at_tb").val(parseInt(data.param_info.param_value));
                   global_ob_track_at=Math.round(data.param_info.param_value);
                   // $("#atv").html(data.param_info.param_value + ' ]');
                   break;
               case "ob_track_ir":
                  // console.log(parseInt(data.param_info.param_value));
                   $("#ob_track_ir_tb").val(parseInt(data.param_info.param_value));
                   global_ob_track_ir=Math.round(data.param_info.param_value);
                   // $("#irv").html(data.param_info.param_value + ' ]');
                   break;
               case "ob_track_mr":
                  // console.log(parseInt(data.param_info.param_value));
                   $("#ob_track_mr_tb").val(parseInt(data.param_info.param_value));
                   global_ob_track_mr=Math.round(data.param_info.param_value);
                   // $("#mrv").html(data.param_info.param_value + ' ]');
                   break;
               case "ob_track_gimbal_follow":
                   // console.log(data.param_info.param_value);
                  if(parseInt(data.param_info.param_value)) 
                    { 
                      $(".start-follow").addClass("stop-follow btn-danger");
                      $(".stop-follow").removeClass("start-follow btn-success");
                      $(".stop-follow").html("Stop");
                    }
                    else
                    { 
                      $(".stop-follow").addClass("start-follow btn-success");
                      $(".start-follow").removeClass("stop-follow btn-danger");
                      $(".start-follow").html("Start");
                    }
                   break;
               case "ob_track_mode":
                   // console.log(data.param_info.param_value);
                  global_ob_track_mode=parseInt(data.param_info.param_value); 
                    
                  break;
                case "ob_track_tolerance_inner":
                  $("#ob_track_tolerance_inner").val(data.param_info.param_value);
                  break;

                case "ob_track_tolerance_outer":
                  $("#ob_track_tolerance_outer").val(data.param_info.param_value);
                  break;
                case "ob_track_vrange":
                  $("#ob_track_vrange_tb").val(parseInt(data.param_info.param_value));
                  global_ob_track_vrange=Math.round(data.param_info.param_value);
                  break;
                case "ob_track_hrange":
                  $("#ob_track_hrange_tb").val(parseInt(data.param_info.param_value));
                  global_ob_track_hrange=Math.round(data.param_info.param_value);
                  break;
                case "ob_track_srange":
                  $("#ob_track_srange_tb").val(parseInt(data.param_info.param_value));
                  global_ob_track_srange=Math.round(data.param_info.param_value);
                  break;
                case "ob_track_compensate":
                  $('#ob_track_compensate').bootstrapSwitch('state', parseInt(data.param_info.param_value));
                  break;

                  // if(parseInt(data.param_info.param_value))$("#ob_track_compensate").prop('checked',true);
                  // else $("#ob_track_compensate").prop('checked',false).trigger("change");

                case "ob_track_tld_learning_disabled":
                  $('#ob_track_tld_learning_disabled').bootstrapSwitch('state', 1-parseInt(data.param_info.param_value));
                  break;

                  // if(parseInt(data.param_info.param_value))$("#ob_track_tld_learning_disabled").prop('checked',false).trigger("change");
                  // else $("#ob_track_tld_learning_disabled").prop('checked',true).trigger("change");
                case "ob_track_tld_detector_disabled":
                  $('#ob_track_tld_detector_disabled').bootstrapSwitch('state', 1-parseInt(data.param_info.param_value));
                  break;
                  // if(parseInt(data.param_info.param_value))$("#ob_track_tld_detector_disabled").prop('checked',false).trigger("change");
                  // else $("#ob_track_tld_detector_disabled").prop('checked',true).trigger("change");
                case "ob_track_tld_new_object":
                  $('#ob_track_tld_new_object').bootstrapSwitch('state', parseInt(data.param_info.param_value));
                  break;
                  // if(parseInt(data.param_info.param_value))$("#ob_track_tld_new_object").prop('checked',true).trigger("change");
                  // else $("#ob_track_tld_new_object").prop('checked',false).trigger("change");
                case "ob_track_parameter_i":
                  $("#ob_track_parameter_i").val(data.param_info.param_value);
                  break;
                case "ob_track_parameter_p":
                  $("#ob_track_parameter_p").val(data.param_info.param_value);
                  break;
                case "ob_track_parameter_d":
                  $("#ob_track_parameter_d").val(data.param_info.param_value);
                  break;
                case "ob_track_parameter_kp":
                  $("#ob_track_parameter_kp").val(data.param_info.param_value);
                  break;
                case "ob_track_parameter_kd":
                  $("#ob_track_parameter_kd").val(data.param_info.param_value);
                  break;
				        case "ob_track_parameter_ki":
                  $("#ob_track_parameter_ki").val(data.param_info.param_value);
                  break;
				        case "ob_track_gimbal_angle":
                  $("#ob_track_gimbal_angle").val(data.param_info.param_value);
                  break;
				        case "ob_track_x_max":
                  $("#ob_track_x_max").val(data.param_info.param_value);
                  break;
                case "vis_servo_loop_rate":
                  $("vis_servo_loop_rate").val(data.param_info.param_value);
                  break;
               }
           }
       },
               error: function(){
                   $.gritter.add({
                               // (string | mandatory) the heading of the notification
                               title: 'Failed to contact flytpod ',
                               // (string | mandatory) the text inside the notification
                               text: 'Retry',
                               // (string | optional) the image to display on the left
                               image: 'images/avatar-mini.jpg',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });
}



function getAllParams(){
    $.ajax({
       type: "GET",
       headers: { 'Authentication-Token': sessionStorage.getItem('token') },
       dataType: "json",
       url: restPath+"/ros/"+namespace+"/param/param_get_all",
       success: function(data){
            
            var multiplier;
           for(var asd=0;asd<data.param_list.length;asd++){
                var param_id=data.param_list[asd].param_id;
                var param_value=data.param_list[asd].param_value;
                

              switch(param_id){
               // case "BAT_N_CELLS":
               //     minVolt=parseInt(param_value)*3.2;
               //     maxVolt=parseInt(param_value)*4.2;
               //     break;
                case "ob_track_ct":
                  // console.log(parseInt(param_value));
                   $("#ob_track_ct_tb").val(parseInt(param_value));
                   // $("#ctv").html(param_value + ' ]');
                   global_ob_track_ct=Math.round(param_value);
                   
                   break;
               case "ob_track_at":
                  // console.log(parseInt(param_value));
                   $("#ob_track_at_tb").val(parseInt(param_value));
                   global_ob_track_at=Math.round(param_value);
                   // $("#atv").html(param_value + ' ]');
                   break;
               case "ob_track_ir":
                  // console.log(parseInt(param_value));
                   $("#ob_track_ir_tb").val(parseInt(param_value));
                   global_ob_track_ir=Math.round(param_value);
                   // $("#irv").html(param_value + ' ]');
                   break;
               case "ob_track_mr":
                  // console.log(parseInt(param_value));
                   $("#ob_track_mr_tb").val(parseInt(param_value));
                   global_ob_track_mr=Math.round(param_value);
                   // $("#mrv").html(param_value + ' ]');
                   break;
               case "ob_track_gimbal_follow":
                   // console.log(param_value);
                  if(parseInt(param_value)) 
                    { 
                      $(".start-follow").addClass("stop-follow btn-danger");
                      $(".stop-follow").removeClass("start-follow btn-success");
                      $(".stop-follow").html("Stop");
                    }
                    else
                    { 
                      $(".stop-follow").addClass("start-follow btn-success");
                      $(".start-follow").removeClass("stop-follow btn-danger");
                      $(".start-follow").html("Start");
                    }
                   break;
               case "ob_track_mode":
                   // console.log(param_value);
                  global_ob_track_mode=parseInt(param_value); 
                    
                  break;
                case "ob_track_tolerance_inner":
                  $("#ob_track_tolerance_inner").val(param_value);
                  break;

                case "ob_track_tolerance_outer":
                  $("#ob_track_tolerance_outer").val(param_value);
                  break;
                case "ob_track_vrange":
                  $("#ob_track_vrange_tb").val(parseInt(param_value));
                  global_ob_track_vrange=Math.round(param_value);
                  break;
                case "ob_track_hrange":
                  $("#ob_track_hrange_tb").val(parseInt(param_value));
                  global_ob_track_hrange=Math.round(param_value);
                  break;
                case "ob_track_srange":
                  $("#ob_track_srange_tb").val(parseInt(param_value));
                  global_ob_track_srange=Math.round(param_value);
                  break;
                case "ob_track_compensate":
                  $('#ob_track_compensate').bootstrapSwitch('state', parseInt(param_value));
                  break;

                  // if(parseInt(param_value))$("#ob_track_compensate").prop('checked',true);
                  // else $("#ob_track_compensate").prop('checked',false).trigger("change");

                case "ob_track_tld_learning_disabled":
                  $('#ob_track_tld_learning_disabled').bootstrapSwitch('state', 1-parseInt(param_value));
                  break;

                  // if(parseInt(param_value))$("#ob_track_tld_learning_disabled").prop('checked',false).trigger("change");
                  // else $("#ob_track_tld_learning_disabled").prop('checked',true).trigger("change");
                case "ob_track_tld_detector_disabled":
                  $('#ob_track_tld_detector_disabled').bootstrapSwitch('state', 1-parseInt(param_value));
                  break;
                  // if(parseInt(param_value))$("#ob_track_tld_detector_disabled").prop('checked',false).trigger("change");
                  // else $("#ob_track_tld_detector_disabled").prop('checked',true).trigger("change");
                case "ob_track_tld_new_object":
                  $('#ob_track_tld_new_object').bootstrapSwitch('state', parseInt(param_value));
                  break;
                  // if(parseInt(param_value))$("#ob_track_tld_new_object").prop('checked',true).trigger("change");
                  // else $("#ob_track_tld_new_object").prop('checked',false).trigger("change");
                case "ob_track_parameter_i":
                  $("#ob_track_parameter_i").val(param_value);
                  break;
                case "ob_track_parameter_p":
                  $("#ob_track_parameter_p").val(param_value);
                  break;
                case "ob_track_parameter_d":
                  $("#ob_track_parameter_d").val(param_value);
                  break;
                case "ob_track_parameter_kp":
                  $("#ob_track_parameter_kp").val(param_value);
                  break;
                case "ob_track_parameter_kd":
                  $("#ob_track_parameter_kd").val(param_value);
                  break;
                case "ob_track_parameter_ki":
                  $("#ob_track_parameter_ki").val(param_value);
                  break;
                case "ob_track_gimbal_angle":
                  $("#ob_track_gimbal_angle").val(param_value);
                  break;
                case "ob_track_x_max":
                  $("#ob_track_x_max").val(param_value);
                  break;
                case "vis_servo_loop_rate":
                  $("#vis_servo_loop_rate").val(param_value);
                  break;
                }


           }

           $.gritter.add({
                       // (string | mandatory) the heading of the notification
                       title: 'Parameter Received',
                       // (string | mandatory) the text inside the notification
                       text: 'Parameter get successful.',
                       // (string | optional) the image to display on the left
                       image: 'images/favicon.png',
                       // (bool | optional) if you want it to fade out on its own or just sit there
                       sticky: false,
                       // (int | optional) the time you want it to be alive for before fading out
                       time: ''
                   });
//            setTimeout(function(){$(".collapse-all").trigger('click');},1000);


       },
               error: function(){
                   $.gritter.add({
                               // (string | mandatory) the heading of the notification
                               title: 'Failed to contact flytpod ',
                               // (string | mandatory) the text inside the notification
                               text: 'Retry Get All Parameters',
                               // (string | optional) the image to display on the left
                               image: 'images/favicon.png',
                               // (bool | optional) if you want it to fade out on its own or just sit there
                               sticky: false,
                               // (int | optional) the time you want it to be alive for before fading out
                               time: ''
                           });
               }
           });
}




function round(value,decimal){
    var x=Math.pow(10,decimal);
    return Math.round(value*x)/x;
}
