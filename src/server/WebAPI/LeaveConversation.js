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

   /**
     * @api {get} /api/v1/conversation/leave/[conversationid] Leave from conversation
     * @apiName Leave from conversation
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription Leave from joined conversation.
     * @apiSuccessExample Success-Response:
    
{
    success: 1,
    data: {
        ok: true,
        conversation: {
            ok: 1,
            nModified: 1,
            n: 1
        }
    }
}

    */
    
    router.post('/:conversationid',authenticator,function(request,response){

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
            
            if(loginUserId == conversation.owner.toString()){
                
                conversationModel.remove({
                    _id : conversation.id
                },function(err,removeResult){

                    if(err){
                        console.log(err);
                        self.errorResponse(response,Const.httpCodeServerError);
                        return;
                    }
                    
                    self.successResponse(response,{
                        ok: true,
                        conversation: removeResult
                    });
                    
                });
                
            }else{
                          
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
                
            }
      
        });

    });

}

new LeaveConversation().attach(router);
module["exports"] = router;
