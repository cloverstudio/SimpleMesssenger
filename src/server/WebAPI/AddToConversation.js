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
        ok: true,
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
        var validateError = '';

        if(_.isEmpty(conversationId))
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
                
                var conversation = conversationModel.findOne({_id:conversationId},function(err, result) {
        
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
                            
                    logic.execute(request.user._id,users,true,function(resultCreateNewConversation){
                                    
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
