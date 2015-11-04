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
    

   /**
     * @api {post} /api/v1/conversation/new New Conversation
     * @apiName Create New Conversation
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription Create new conversation
     * @apiParam {array} users array of users ids.
     * @apiParamExample {json} Request-Example:
        {
            users: [
                "563a0cc46cb168c8e9c4071d",
                "563a0cc46cb168c8e9c4071a",
                "563a0cc46cb168c8e9c4071b"
            ]
        }
     * @apiSuccessExample Success-Response:
    
            {
                success: 1,
                data: {
                    ok: true,
                    conversation: {
                        __v: 0,
                        owner: '563a0cc46cb168c8e9c4071d',
                        name: 'testuBfpS,
                        thename...',
                        created: 1446644932895,
                        _id: '563a0cc46cb168c8e9c40720',
                        avatar: {
                            file: '3kjh7pZAUZruXOMMWF4ejG674QZTDMvT',
                            thumb: '3kjh7pZAUZruXOMMWF4ejG674QZTDMvT'
                        },
                        users: [
                            '563a0cc46cb168c8e9c4071d',
                            '563a0cc46cb168c8e9c4071a',
                            '563a0cc46cb168c8e9c4071c',
                            '563a0cc46cb168c8e9c4071b'
                        ]
                    }
                }
            }

    */
    
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
