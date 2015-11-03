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

var AddToConversation = function(){}

_.extend(AddToConversation.prototype,RequestHandlerBase.prototype);

AddToConversation.prototype.attach = function(router){

    var self = this;

    router.post('',authenticator,function(request,response){

        // check new password
        var validateError = '';

        if(_.isEmpty(request.body.conversationId))
            validateError = "Conversation id is empty";
            
        if(_.isEmpty(request.body.users))
            validateError = "Specify users";

        if(!_.isEmpty(validateError)){
                        
            self.successResponse(response,{
                ok: false,
                validationError: validateError
            });
            
            return;
            
        }
        
        var conversationModel = ConversationModel.get();
        
        async.waterfall([
            
            function (done) {
                
                var result = {};
                
                var conversation = conversationModel.findOne({_id:request.body.conversationId},function(err, result) {
        
                    if(err){

                        self.successResponse(response,{
                            ok: false,
                            validationError: "Invalid conversation id"
                        });
                        
                        return;
                    }
                            
                    if(!result){
                        
                        self.successResponse(response,{
                            ok: false,
                            validationError: "Invalid conversation id"
                        });
                        
                        return;
                        
                    }
                    
                    var userIdFromRequest = request.user.id;
                    
                    if(result.users.indexOf(userIdFromRequest) == -1){

                        self.successResponse(response,{
                            ok: false,
                            validationError: "Invalid user"
                        });
                        
                        return;
                        
                    }
                    
                    result.conversation = result;
                    
                    done(err,result);
                                
                });
                
            },
            function (result,done){
                                
                var users = result.conversation.users;
                
                _.forEach(request.body.users,function(userid){
                    
                    users.push(userid);
                    
                })
                
                users = _.uniq(users);
                
                var makeNewCconversation = request.body.makeNew;
                if(!makeNewCconversation)
                    makeNewCconversation = false;
                    
                if(makeNewCconversation == true){
                                        
                    // call new conversation API
                    var params = {
                        users : users
                    };
                    
                    var CreateNewConversation = require("./logics/CreateNewConversation");
                    
                    var logic = new CreateNewConversation();
                            
                    logic.execute(request.user._id,users,function(resultCreateNewConversation){
                                    
                        if(!result){
                            done("Failed to create new conversation",result)
                            
                        }else{
                            
                            result.conversation = resultCreateNewConversation;
                            done(null,result)
                        }
                    });
                    
                }else{
                
                    result.conversation.update({
                        users : users
                    },{},function(err,resutlSave){
                        
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
            
            self.successResponse(response,{
                ok: true,
                conversation: result.conversation
            });
            
        });
            
                
    });

}

new AddToConversation().attach(router);
module["exports"] = router;
