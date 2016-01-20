var namespace="";
var ip = "localhost:9090";


$(document).ready(function() {

   $("#msg").hide();
   var msgdata = {};
   $.ajax({
      type: "POST",
      dataType: "json",
      data: JSON.stringify(msgdata),
      url: "http://"+ip+"/ros/get_global_namespace",
      success: function(data){
          if(data.success){
              namespace=data.param_info.param_value;

              var ros = new ROSLIB.Ros({
                url : 'ws://'+ip+'/websocket'
              });               ros.on('connection', function() {
                console.log('Connected to websocket server.');
              });               ros.on('error', function(error) {
                console.log('Error connecting to websocket server: ', error);
              });               ros.on('close', function() {
                console.log('Connection to websocket server closed.');
              });

            var listenerLocalPosition = new ROSLIB.Topic({
                      ros :ros,
                      name : '/'+namespace+'/mavros/local_position/local',
                      messageType : 'geometry_msgs/TwistStamped',
                      throttle_rate: 200
              });

              listenerLocalPosition.subscribe(function(message) {

                      $("#posx").html(message.twist.linear.x);
                      $("#posy").html(message.twist.linear.y);
                      $("#posz").html(message.twist.linear.z);
//                      $('#velx').text(round(message.twist.angular.x,3));
//                      $('#vely').text(round(message.twist.angular.y,3));
//                      $('#velz').text(round(message.twist.angular.z,3));
              });

        }
    }
});



});




$("#square").click(function(){


    var msgdata={};
     msgdata["app_name"]="demoapp2";
     msgdata["arguments"]="3";
     dim = $("#dimension").val();
     if(dim)
     {
        msgdata["arguments"]= dim;
     }

     $.ajax({
        type: "POST",
        dataType: "json",
        data: JSON.stringify(msgdata),
        url: "http://"+ip+"/ros/"+namespace+"/navigation/exec_script",
        success: function(data){
            console.log("success");
            console.log(data);
            if(data.success)
            {
                    $("#msg").html("Script Started Executing");
                    $("#msg").show();
                    $("#msg").fadeOut(1500);
            }
            else
            {
                    $("#msg").html("Could Not Start Script");
                    $("#msg").show();
                    $("#msg").fadeOut(1500);
            }

        },
        error: function(data){
            console.log("error");
            console.log(data);
            $("#msg").html("Error Starting Script");
            $("#msg").show();
            $("#msg").fadeOut(1500);
        }
     });


});

