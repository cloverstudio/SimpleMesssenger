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

var AddToConversation = function(){}

_.extend(AddToConversation.prototype,RequestHandlerBase.prototype);

AddToConversation.prototype.attach = function(router){

    var self = this;

   /**
     * @api {post} /api/v1/conversation/add/[conversationid] Add users to conversation
     * @apiName Add users to conversation
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription Add users to existing conversation. Can select add to existing conversation or create new one.
     * @apiParam {makeNew} false to existing one, true to make one new
     * @apiParam {array} users array of users ids.
     * @apiParamExample {json} Request-Example:
            {
                makeNew: true,
                users: [
                    "563a0cc46cb168c8e9c4071a",
                    "563a0cc46cb168c8e9c4071a"
                ]
            }
     * @apiSuccessExample Success-Response:
    
{
    success: 1,
    data: {
        conversation: {
            __v: 0,
            owner: '563a1130b75fb0d5eb4b5a22',
            name: 'testiCqIm,
            thename...',
            created: 1446646065228,
            _id: '563a1131b75fb0d5eb4b5a2a',
            avatar: {
                file: 'EDDggQd7MoK6LpKQQ84PWbQVVdpjexYh',
                thumb: 'EDDggQd7MoK6LpKQQ84PWbQVVdpjexYh'
            },
            users: [
                '563a1130b75fb0d5eb4b5a22',
                '563a1130b75fb0d5eb4b5a22',
                '563a1130b75fb0d5eb4b5a1f',
                '563a1130b75fb0d5eb4b5a20',
                '563a1130b75fb0d5eb4b5a21'
            ]
        }
    }
}

    */

    router.post('/:conversationid',authenticator,function(request,response){

        var conversationId = request.params.conversationid;

        // check new password
        var validateError = 0;

        if(_.isEmpty(conversationId))
            validateError = Const.resCodeAddToConversationNoConversationID;
            
        if(_.isEmpty(request.body.users))
            validateError = Const.resCodeAddToConversationNoUser;

        if(validateError != 0){
                        
            self.successResponse(response,Const.resCodeAddToConversationNoUser);
            
            return;
            
        }
        
        var conversationModel = ConversationModel.get();
        
        async.waterfall([
            
            function (done) {
                
                var result = {};
                
                var conversation = conversationModel.findOne({_id:conversationId},function(err, resultConvesation) {
        
                    if(err){

                        self.successResponse(response,Const.resCodeAddToConversationWrongConversationID);
                        
                        return;
                        
                    }
                            
                    if(!result){
                        
                        self.successResponse(response,Const.resCodeAddToConversationWrongConversationID);
                        
                        return;
                        
                    }
                    
                    var userIdFromRequest = request.user.id;
                    
                    if(resultConvesation.users.indexOf(userIdFromRequest) == -1){

                        self.successResponse(response,Const.resCodeAddToConversationWrongUserID);
                        
                        return;
                        
                    }
                    
                    result.conversation = resultConvesation;
                    
                    done(err,result);
                                
                });
                
            },
            function (result,done){
                
                // convert telnum to userid
                var userIdsOrig = request.body.users;
                var telNums = [];
                var userIds = [];
                
                if(_.isEmpty(userIdsOrig)){
                    done(null,result);
                    return;    
                }
                
                
                for(var i = 0 ; i < userIdsOrig.length ; i++){
                    
                    if(!Utils.isObjectId(userIdsOrig[i])){
                        
                        telNums.push(userIdsOrig[i]);
                        
                    }else{
                        userIds.push(userIdsOrig[i]);
                    }
                    
                }
                
                if(telNums.length == 0){
                    done(null,result);
                    return;    
                }
                
                
                UserModel.get().find({
                
                    telNumber:{$in:telNums},
                    
                },function(err,resultUsers){
                    
                    _.forEach(resultUsers,function(resultUser){
                        
                        userIds.push(resultUser._id);
                                              
                    });              
                                        
                    request.body.users = userIds;
                    
                    done(err,result);
    
                });     
                        
                  
            },
            function (result,done){
                                
                var users = result.conversation.users;
                
                _.forEach(request.body.users,function(userid){
                    
                    users.push(userid);
                    
                })
                
                users = _.uniq(users);
                result.usersUpdated = users;
                
                var makeNewCconversation = request.body.makeNew;
                
                if(_.isEmpty(makeNewCconversation) || makeNewCconversation === false || makeNewCconversation === 0)
                    makeNewCconversation = false;
                else
                    makeNewCconversation = true;
                         
                if(makeNewCconversation == true){
                                                      
                    // call new conversation API
                    var params = {
                        users : users
                    };
                    
                    var CreateNewConversation = require("./logics/CreateNewConversation");
                    
                    var logic = new CreateNewConversation();
                            
                    logic.execute(request.user._id,users,false,null,function(resultCreateNewConversation){
                                    
                        if(!result){
                            done("Failed to create new conversation",result)
                            
                        }else{
                            
                            result.conversation = resultCreateNewConversation;
                            
                            done(null,result)
                        }
                    });
                    
                }else{
                    
                    var type = result.conversation.type;
    
                    if(type == Const.chatTypePrivate && result.conversation.users.length > 2)
                        type = Const.chatTypeGroup;
                        
                    result.conversation.update({
                        users : users,
                        type : type
                    },{},function(err,resutlSave){
                        
                        result.conversation = result.conversation.toObject()
                        result.conversation.type = type;
                        result.conversation.users = users;
                        done(err,result);
                        
                    })
                   
                }
                
            }
        
        ],function(err,result){
                        
            if(err){
                console.log(err);
                self.errorResponse(response,Const.httpCodeServerError);
                return;
            }
            
            
            // populate with users
            UserModel.getUsersByIdForResponse(result.usersUpdated,function(resultUsers){
                                
                result.conversation.users = resultUsers;
            
                self.successResponse(response,Const.responsecodeSucceed,{
                    conversation: result.conversation
                });
                
                // send socket
                _.forEach(request.body.users,function(userId){
                    
                    SocketAPIHandler.emitToUser(
                        userId,
                        Const.emitCommandNewConversation,
                        {conversation:result.conversation}
                    );
                     
                });

                SocketAPIHandler.emitToUser(
                    request.user._id,
                    Const.emitCommandNewConversation,
                    {conversation:result.conversation}
                );
                 
                     
            });
            
        });
            
                
    });

}

new AddToConversation().attach(router);
module["exports"] = router;
