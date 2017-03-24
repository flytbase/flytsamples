var restPath=localStorage.getItem("restPath");
var wsPath=localStorage.getItem("wsPath");
var namespace=localStorage.getItem("namespace");
var token=localStorage.getItem("token");
var auth=localStorage.getItem("auth");

$(document).ready(function(){
    function checkWidth(){
        var left=($(window).width()-200)/2+10;
        var top=($(window).height()-300)/2+40;
        $(".login-body").attr("style","left:"+left+"px;top:"+top+"px;");
    }
    checkWidth();
    $(window).resize(checkWidth);
    if(localStorage.getItem("token")){
        getNamespace();
    }

});

$(".connect").click(function(){
//    if($(".username").val()==""){
        restPath="http://"+$('.login-url').val();
        wsPath="ws://"+$('.login-url').val();
        auth='false';
        getNamespace();

//    }
//    else{
//        restPath="https://"+$(".login-url").val();
//        wsPath="wss://"+$(".login-url").val();
//        login($(".username").val(),$(".password").val());
//        auth='true';
//    }
    localStorage.setItem('auth',auth);
    localStorage.setItem('restPath',restPath);
    localStorage.setItem('wsPath',wsPath);

    $(".toast").html("Connecting!!!!!!!");
    $(".toast").show();
});


function login(user, pass){console.log(user+" "+pass);



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


            if (data.response.errors){
                if (data.response.errors.email){

                    $(".toast").html(data.response.errors.email[0]);
                    $(".toast").show();
                    setTimeout(function(){
                        $(".toast").hide(20);
                    },3000);
                }else if(data.response.errors.password){

                    $(".toast").html(data.response.errors.password[0]);
                    $(".toast").show();
                    setTimeout(function(){
                        $(".toast").hide(20);
                    },3000);
                }

            }else{
                localStorage.setItem('token',data.response.user.authentication_token);
                getNamespace();
            }

        },error:function(data){console.log(data);
            $(".toast").html("Login Failed! Retry!!");
            $(".toast").show();
            setTimeout(function(){
                $(".toast").hide(20);
            },3000);
        }
    });

}

function getNamespace(){

    $.ajax({
        type: "GET",
        headers: { 'Authentication-Token': localStorage.getItem('token') },
        dataType: "json",
        url: restPath+"/ros/get_global_namespace",
        success: function(data){
            localStorage.setItem('namespace',data.param_info.param_value);
            window.location.replace("app.html");
        },
        error: function(){
        }
    });
}