var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");

var ConversationList = function(){}

_.extend(ConversationList.prototype,RequestHandlerBase.prototype);

ConversationList.prototype.attach = function(router){

    var self = this;

   /**
     * @api {get} /api/v1/conversation/detail Conversation Detail
     * @apiName Get Conversation Detail
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription get conversation detail

     * @apiSuccessExample Success-Response:

{
    "success": 1,
    "data": {
        "ok": true,
        "conversation": {
            "_id": "564d7c593e84a5407599ce80",
            "owner": "5638c0a71b659fc060941d87",
            "name": "KenYasue,paw",
            "created": 1447918681714,
            "__v": 0,
            "lastMessage": {
                "created": 1447918689029,
                "type": 1,
                "message": "10",
                "conversationID": "564d7c593e84a5407599ce80",
                "roomID": "564d7c593e84a5407599ce80",
                "userID": "5638c0a71b659fc060941d87",
                "_id": "564d7c613e84a5407599ce8b"
            },
            "avatar": {
                "file": "",
                "thumb": ""
            },
            "users": [
                {
                    "_id": "5638c0a71b659fc060941d87",
                    "username": "kenyasue",
                    "displayName": "KenYasue"
                },
                {
                    "_id": "564d7c013e84a5407599ce7f",
                    "username": "",
                    "telNumber": "385989503635",
                    "displayName": "paw"
                }
            ]
        }
    }
}

    */
    
    router.get('/:conversationid',authenticator,function(request,response){

        var conversationId = request.params.conversationid;
        var conversationModel = ConversationModel.get();
        
        conversationModel.findOne({
            _id:conversationId
        },function(err,result){
            
            if(result){
                
                result = result.toObject();
                
                // populate with users
                UserModel.getUsersByIdForResponse(result.users,function(resultUsers){
                                    
                    result.users = resultUsers;
                
                    self.successResponse(response,{
                        ok: true,
                        conversation: result
                    });
                                             
                });
            
            } else {
                
                self.successResponse(response,{
                    ok: false,
                    conversation: null
                });
                
            }

        })
        
    });

}

new ConversationList().attach(router);
module["exports"] = router;
