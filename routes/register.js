/**
 * Created by Administrator on 2017-3-6.
 */
var express = require('express');
var app = express();

var formidable = require("formidable");
var db = require("../models/db.js");
var md5 = require("../models/md5.js");
var path = require("path");
var fs = require("fs");
var gm = require("gm");
var bodyParser = require("body-parser");
var session = require('express-session');

//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//显示注册页面
exports.showRegister = function (req, res) {
    res.render('register/register', {
        "login": req.session.login == "1" ? true : false,
        "account": req.session.login == "1" ? req.session.account : "",
        "active": "注册"
    });
};

//处理注册业务
exports.doRegister = function (req, res) {
    var account = req.body.account;
    var password = req.body.password;
    var pwdConfirm = req.body.pwdConfirm;
    if (password != pwdConfirm) {
        res.send("0");
        return;
    }
    //查询数据库中是不是有这个人
    db.find("users", {"account": account}, function (err, result) {
        if (err) {
            res.send("-3"); //服务器错误
            return;
        }
        if (result.length != 0) {
            res.send("-1"); //此用户名已被注册
            return;
        }
        //没有相同的人，就可以执行接下来的代码了：
        //设置md5加密
        password = md5(md5(password) + "倪培燕");

        //现在可以证明，用户名没有被占用
        db.insertOne("users", {
            "account": account,
            "password": password,
            "avatar": "moren.jpg"
        }, function (err, result) {
            if (err) {
                res.send("-3"); //服务器错误
                return;
            }
            req.session.login = "1";
            req.session.account = account;

            res.send("1"); //注册成功，写入session
        });
    });
};

/*var form = new formidable.IncomingForm();
 form.parse(req, function (err, fields, files) {
 //得到表单之后做的事情
 var account = fields.account;
 var password = fields.password;

 console.log(account,password);
 });
 });*/
