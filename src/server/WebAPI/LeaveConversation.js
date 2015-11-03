var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");

var LeaveConversation = function(){}

_.extend(LeaveConversation.prototype,RequestHandlerBase.prototype);

LeaveConversation.prototype.attach = function(router){

    var self = this;

    router.get('/:conversationid',authenticator,function(request,response){

        var conversationId = request.params.conversationid;
        var loginUserId = request.user.get("id");
        
        var conversationModel = ConversationModel.get();
        
        conversationModel.findOne({_id:conversationId},function(err, conversation) {
        
            if(err){
        
                self.successResponse(response,{
                    ok: false,
                    validationError: "Invalid conversation id"
                });
                
                return;
            }
                    
            if(!conversation){
                
                self.successResponse(response,{
                    ok: false,
                    validationError: "Invalid conversation id"
                });
                
                return;
                
            }
            
            var newUsersList = [];
            
            _.forEach(conversation.users,function(userid){
                
                if(userid != loginUserId)
                    newUsersList.push(userid);
                
            });
                        
            conversation.update({
                users:newUsersList
            },{},function(err,updateResult){
                
                if(err){
                    console.log(err);
                    self.errorResponse(response,Const.httpCodeServerError);
                    return;
                }
                
                self.successResponse(response,{
                    ok: true,
                    conversation: updateResult
                });
            
            });
      
        });

    });

}

new LeaveConversation().attach(router);
module["exports"] = router;
