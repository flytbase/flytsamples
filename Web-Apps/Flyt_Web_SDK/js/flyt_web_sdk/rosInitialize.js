

var restPath=localStorage.getItem("restPath");
var wsPath=localStorage.getItem("wsPath");
var namespace=localStorage.getItem("namespace");
var token=localStorage.getItem("token");
var auth=localStorage.getItem("auth");

function rosInitialize(){
    ros = new ROSLIB.Ros({
      url : wsPath +'/websocket'
    });


    ros.on('connection', function() {
        console.log('Connected to websocket server.');
        setTimeout(function(){socketCallback();},3000);

    });

    ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      console.log('Connection to websocket server closed.');
    });

    if(auth){
	    var rauth = new ROSLIB.Message({
             "op": "auth",
             "mac" : localStorage.getItem('token'),

        });

	    ros.authenticate(rauth);
    }
}

