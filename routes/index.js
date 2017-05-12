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

var register = require('./register.js');
var login = require('./login.js');

//首页
app.get('/', function(req, res, next) {
  //检索数据库，查找此人的头像
  if (req.session.login == "1") {
    //如果登陆了
    var account = req.session.account;
    var login = true;
  } else {
    //没有登陆
    var account = "";  //制定一个空用户名
    var login = false;
  }
  //已经登陆了，那么就要检索数据库，查登陆这个人的头像
  db.find("users", {account: account}, function (err, result) {
    if (result.length == 0) {
      var avatar = "moren.jpg";
    } else {
      var avatar = result[0].avatar;
    }
    res.render("index", {
      "login": login,
      "account": account,
      "active": "首页",
      "avatar": avatar    //登录人的头像
    });
  });
});

//显示注册页面
app.get('/register', register.showRegister);

//处理注册业务
app.post('/doregister', register.doRegister);

//显示登录页面
app.get('/login', login.showLogin);

//处理登录业务
app.post('/dologin', login.doLogin);

module.exports = app;
