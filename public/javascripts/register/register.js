/**
 * Created by Administrator on 2017-3-5.
 */
$("input").focus(function(){
    $("#error").fadeOut();
});
$("#register").click(function(){
    //注册按钮的事件，用ajax提交表单
    $.post("/doregister",{
        "account" : $("#account").val(),
        "password" : $("#password").val(),
        "pwdConfirm": $("#pwdConfirm").val()
    }, function(result){
        if(result == "1"){
            //注册成功
            alert("注册成功！将自动跳转到首页");
            window.location = "/";
        }else if(result == "-1"){
            //用户名被占用
            $("#error").fadeIn();
            $("#error").html("此用户名已被注册，请重新输入！");
        }else if(result == "-3"){
            //服务器错误
        }else if(result == "0") {   //两次输入密码不一致
            $("#error").fadeIn();
            $("#error").html("两次输入的密码不一致，请检查！");
        }
    });
});
