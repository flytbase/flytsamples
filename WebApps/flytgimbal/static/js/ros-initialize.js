
var ros;
var ip = location.host
var auth=false;

if( ip.search('9090')){
  restProto = 'http://';
  wsProto = 'ws://';
}
else{
  restProto = 'https://';
  wsProto = 'wss://';
  auth=true;

}

restPath = restProto + ip;
wsPath = wsProto + ip;

function rosInitialize(){
    ros = new ROSLIB.Ros({
      url : wsPath +'/websocket'
    });


    ros.on('connection', function() {
      console.log('Connected to websocket server.');
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
		                 "mac" : sessionStorage.getItem('token'),

		             });

	    ros.authenticate(rauth);
    }
    setTimeout(function(){socketCallback();},1000);
}

