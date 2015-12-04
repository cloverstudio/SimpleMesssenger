var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var Const = require("../lib/consts");
var Utils = require('../lib/utils');

var RequestHandlerBase = require('./RequestHandlerBase');
var authenticator = require("./middleware/auth");

var DatabaseManager = require('../lib/DatabaseManager');
var UserModel = require('../Models/User');
var LogDeleteMessageModel = require('../Models/LogDeleteMessage');
var ConversationModel = require('../Models/Conversation');


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
        
        
        var Handler = require('../../../modules_customised/spika/src/server/WebAPI/LatestMessageListHandler').handler;
        var conversationModel = ConversationModel.get();
        var SpikaResnponse = Handler.logic(request,response,function(err,resultSpikaResponse){
                        
            if(err){
                
                self.errorResponse(response,Const.httpCodeServerError);
                
            }else{
                
                async.waterfall([
                    function(done){
                        
                        var result = {};
                        
                        // get conversation
                        conversationModel.findOne({_id:request.params.roomID},function(err,findConversationResult){
                        
                            if(err){
                                done(err,null);
                                return;
                            }
                            
                            if(!findConversationResult){
                                done("invalid converstaion",null);
                                return;
                            }
                            
                            result.conversation = findConversationResult.toObject();
                            
                            done(null,result);
                            
                        });
                        
                    },
                    function(result,done){
                        
                        // count 
                        var usersCount = result.conversation.users.length - 1;
                        
                        // search last message with the count
                        var spikaMessageModel = DatabaseManager.getModel("Spika/Message").model;
                        
                        var query = spikaMessageModel.find({
                            roomID:request.params.roomID,
                            "seenBy":{$exists: true, $gt: {$size: usersCount}}
                        }).sort({'created': 'desc'});        
                        
                        query.exec(function(err,data){
                            
                            
                            
                            if(err){
                                done(err,null);
                                return;
                            }
                            
                            if(data.length > 0){
                                result.lastMessage = data[0];                            
                            }else{
                                result.lastMessage =null;
                            }
                            
                            done(err,result);
                            
                        });   
                    
                    }
                ],
                function(err,result){
                    
                    if(err){
                        self.errorResponse(response,Const.httpCodeServerError);
                        return;
                    }

                    var lastDeletedMessageId = null;
                    if(result.lastMessage){
                        lastDeletedMessageId = result.lastMessage._id;
                    }
                    
                    self.successResponse(response,Const.responsecodeSucceed,{
                        lastDeletedMessageId:lastDeletedMessageId,
                        messages: resultSpikaResponse.messages
                    });
                    
                    
                }); 
                
            }
                        
        });
        
    });

}

new LatestMessageList().attach(router);
module["exports"] = router;
