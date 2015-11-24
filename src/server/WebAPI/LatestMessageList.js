var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var Const = require("../lib/consts");
var Utils = require('../lib/utils');

var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var LogDeleteMessageModel = require('../Models/LogDeleteMessage');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");

var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');
var SpikaBridge = require('../lib/SpikaBridge');

var LatestMessageList = function(){}

_.extend(LatestMessageList.prototype,RequestHandlerBase.prototype);

LatestMessageList.prototype.attach = function(router){

    var self = this;


    /**
     * @api {get} /message/latest/:roomID/:lastMessageID Get all latest messages
     * @apiName Get all latest messages of the room
     * @apiGroup WebAPI
     * @apiDescription Get all latest message from the room

     * @apiParam {String} RoomID ID of room
     * @apiParam {String} lastMessageID MessageID of last message already shown. To get last 50 message put this param 0
     *
     * @apiSuccess {String} Token
     * @apiSuccess {String} User Model of loginned user
     *     
     * @apiSuccessExample Success-Response:
{
    "success": 1,
    "data": {
        "ok": true,
        "lastDeletedMessageId": "564dce47ca03401d1c36432d",
        "messages": [
            {
                "_id": "564dd046a72626cd1c10cf9e",
                "user": {
                    "_id": "564b1f0c6d8463e192831fe4",
                    "userID": "5638c0a71b659fc060941d87",
                    "name": "KenYasue",
                    "avatarURL": "/spika/img/noavatar.png",
                    "token": "tuBKTp9nTtMSZGdZT3AmfbtH",
                    "created": 1447763724451,
                    "__v": 0
                },
                "userID": "5638c0a71b659fc060941d87",
                "roomID": "564dc411cfe0f40504086221",
                "message": "d",
                "localID": "_ODVw6rVsCiE9IXlL24V9EZACKszn5WGc",
                "type": 1,
                "created": 1447940166454,
                "__v": 0,
                "seenBy": []
            },
            {
                "_id": "564dd046a72626cd1c10cf9d",
                "user": {
                    "_id": "564b1f0c6d8463e192831fe4",
                    "userID": "5638c0a71b659fc060941d87",
                    "name": "KenYasue",
                    "avatarURL": "/spika/img/noavatar.png",
                    "token": "tuBKTp9nTtMSZGdZT3AmfbtH",
                    "created": 1447763724451,
                    "__v": 0
                },
                "userID": "5638c0a71b659fc060941d87",
                "roomID": "564dc411cfe0f40504086221",
                "message": "d",
                "localID": "_AzVD2m6f7p21fvxMtfOMNI2qFS2Uhnxt",
                "type": 1,
                "created": 1447940166220,
                "__v": 0,
                "seenBy": []
            }
        ]
    }
}
    */
    
    router.get('/:roomID/:lastMessageID',authenticator,function(request,response){
        
        console.log("lastMessageID",request.params);
        
        var Handler = require('../../../modules_customised/spika/src/server/WebAPI/LatestMessageListHandler').handler;
        var SpikaResnponse = Handler.logic(request,response,function(err,result){
                                
            if(err){
                
                self.errorResponse(response,Const.httpCodeServerError);
                
            }else{
                
                // get last deleted message
                var logModel = LogDeleteMessageModel.get();
        
                var query = logModel.find({
                    conversationId:request.params.roomID
                }).sort({'created': 'desc'});        
                
                query.exec(function(err,data){
                    
                    console.log("lastMessageID query result",data);


                    var lastDeletedMessageId = null;
                    if(data.length > 0){
                        lastDeletedMessageId = data[0]._id;
                    }
                    
                    self.successResponse(response,{
                        ok: true,
                        lastDeletedMessageId:lastDeletedMessageId,
                        messages: result.messages
                    });
                    
                });   
                
            }
                        
        });
        
    });

}

new LatestMessageList().attach(router);
module["exports"] = router;
