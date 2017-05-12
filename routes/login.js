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

//显示登录页面
exports.showLogin = function (req, res) {
    res.render('login/login', {
        "login": req.session.login == "1" ? true : false,
        "account": req.session.login == "1" ? req.session.account : "",
        "active": "登录"
    });
};

//处理登录业务
exports.doLogin = function (req, res, next) {
    var account = req.body.account;
    var password = req.body.password;
    var jiamihou = md5(md5(password) + "倪培燕");
    //查询数据库，看看有没有个这个人
    db.find("users", {"account": account}, function (err, result) {
        if (err) {
            res.send("-5");
            return;
        }
        //找不到此账号
        if (result.length == 0) {
            res.send("-1"); //账号不存在
            return;
        }
        //有的话，进一步看看这个人的密码是否匹配
        if (jiamihou == result[0].password) {
            req.session.login = "1";
            req.session.account = account;
            res.send("1");  //登录成功
            return;
        } else {
            res.send("-2");  //密码错误
            return;
        }
    });
};
