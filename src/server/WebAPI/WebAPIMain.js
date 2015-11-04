var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var _ = require('lodash');

var init = require('../lib/init.js');

var WebAPIMain ={

    init: function(app){

        var self = this;

        app.use('/',express.static(__dirname + '/../../../public'));
        app.use(bodyParser.json());

        router.use("/user/signin", require('./SignIn'));
        router.use("/user/signin/uuid", require('./SignInUUID'));
        
        router.use("/user/signup", require('./SignUp'));
        router.use("/user/resetpassword", require('./ResetPassword'));
        router.use("/test", require('./Test'));

        router.use("/user/updateprofile", require('./UpdateProfile'));
        router.use("/user/changepassword", require('./ChangePassword'));

        router.use("/search/user", require('./SearchUser'));

        router.use("/file", require('./FileAPI'));

        router.use("/conversation/new", require('./NewConversation'));
        router.use("/conversation/add", require('./AddToConversation'));
        router.use("/conversation/list", require('./ConversationList'));
        router.use("/conversation/leave", require('./LeaveConversation'));

        app.use(init.urlPrefix, router);

    }
}

module["exports"] = WebAPIMain;
