var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var Const = require("../lib/consts");
var Utils = require('../lib/utils');

var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");


var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');
var SpikaBridge = require('../lib/SpikaBridge');

var SendMessage = function(){}

_.extend(SendMessage.prototype,RequestHandlerBase.prototype);

SendMessage.prototype.attach = function(router){

    var self = this;

   /**
     * @api {post} /api/v1/message/send/ Send Message
     * @apiName Send message
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription Send message to a conversation

     * @apiParam {String} conversationId ConversationID to send message
     * @apiParam {String} message Message to send 
     * @apiParamExample {json} Request-Example:
            {
                conversationId: "563a0cc46cb168c8e9c4071a",
                message: "hello"
            }
     * @apiSuccessExample Success-Response:
{
    success: 1,
    data: {
        message: {
            __v: 0,
            user: '564b3e3e6e7e47e8a1206b59',
            userID: '564b3e3c6e7e47e8a1206b49',
            roomID: '564b3e3e6e7e47e8a1206b58',
            message: 'test',
            type: 1,
            created: 1447771710089,
            _id: '564b3e3e6e7e47e8a1206b5a',
            seenBy: [
                
            ]
        }
    }
}
    */

    router.post('',authenticator,function(request,response){

        var conversationId = request.body.conversationId;
        var message = request.body.message;

        // check new password
        var validateError = 0;

        if(_.isEmpty(conversationId))
            validateError = Const.resCodeSendMessageNoConversationID;
            
        if(_.isEmpty(message))
            validateError = Const.resCodeSendMessageEmptyMessage;

        if(validateError != 0){
                        
            self.successResponse(response,validateError);
            
            return;
            
        }
        
        SpikaBridge.sendNewMessage(request.user,conversationId,message,function(result){

            self.successResponse(response,Const.responsecodeSucceed,{
                message: result.message
            });
            
        });
                  
    });

}

new SendMessage().attach(router);
module["exports"] = router;
