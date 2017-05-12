/**
 * Created by Administrator on 2017-3-5.
 */
$("input").focus(function(){
    $("#error").fadeOut();
});

$("#login").click(function(){
    //注册按钮的事件，用ajax提交表单
    $.post("/dologin",{
        "account" : $("#account").val(),
        "password" : $("#password").val()
    },function(result){
        if(result == "1"){
            //登录成功
            window.location = "/";
        }else if(result == "-1"){
            $("#error").fadeIn();
            $("#error").html("此账号不存在!");
        }else if(result == "-2"){
            $("#error").fadeIn();
            $("#error").html("密码错误,请重新输入！");
        }
    });
});
