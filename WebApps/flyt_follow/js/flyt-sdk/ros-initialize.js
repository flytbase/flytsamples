
var ros;
var auth=false;
var restProto, restPath, wsProto, wsPath;

$(document).ready(function(){


    restProto = 'https://';
    wsProto = 'wss://';
    auth=true;


    restPath = restProto + ip;
    wsPath = wsProto + ip;


    if (!sessionStorage.length) {
      // Ask other tabs for session storage
        localStorage.setItem('getSessionStorage', Date.now());
    };

    window.addEventListener('storage', function(event) {

      // console.log('storage event', event);

        if (event.key == 'getSessionStorage') {
          // Some tab asked for the sessionStorage -> send it

            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            localStorage.removeItem('sessionStorage');

        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
          // sessionStorage is empty -> fill it

            var data = JSON.parse(event.newValue);

            for (key in data) {
                sessionStorage.setItem(key, data[key]);
            }

          // showSessionStorage();
        }
    });
});



function login(user, pass){
    var msgdata={};
    msgdata['username']=user;
    msgdata['email']=user;
    msgdata['password']=pass;
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(msgdata),
        url: restPath+"/login",
        success: function(data){

            afterLogin(data);

            if (data.response.errors){
                

            }else{
                sessionStorage.setItem('namespace',user);
                sessionStorage.setItem('token',data.response.user.authentication_token);
              
                setNamespace();
            }

        },error:function(data){console.log(data);}
    });

}


      // })();

function setNamespace(){

    // $(".modelname").html(sessionStorage.drone);
    namespace=sessionStorage.getItem('namespace');

    var msgdata = {};
    msgdata['username'] = namespace;
    $.ajax({
        type: "POST",
        headers: {'Authentication-Token': sessionStorage.getItem('token')},
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(msgdata),
        url: restPath+"/getname", 
        success: function(data){

            sessionStorage.setItem('drone',data.drone);
          
        },
        error: function(data){
          // console.log("error in get user name");
          // console.log(data);
          // if(data.status == '401')
          //   window.location.href = restPath+"/logout?next=login";
        }

      });

  rosInitialize();
}


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
    setTimeout(function(){socketCallback();},3000);
}

