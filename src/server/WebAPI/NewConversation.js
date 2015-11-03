var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');
var validator = require('validator');
var fs = require('fs-extra');
var lwip = require('lwip');

var RequestHandlerBase = require('./RequestHandlerBase');
var init = require('../lib/init');
var Const = require("../lib/consts");
var Utils = require('../lib/utils');

var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");

var CreateNewConversation = require("./logics/CreateNewConversation");

var NewConversation = function(){};
_.extend(NewConversation.prototype,RequestHandlerBase.prototype);

NewConversation.prototype.attach = function(router){

    var self = this;
    
    router.post('/',authenticator,function(request,response){
    
        var logic = new CreateNewConversation();
                
        logic.execute(request.user._id,request.body.users,function(result){
                        
            if(!result){
                self.errorResponse(response,Const.httpCodeServerError);
                
            }else{
                self.successResponse(response,{
                    ok: true,
                    conversation: result
                });
            }
        });

    });

}


new NewConversation().attach(router);
module["exports"] = router;
