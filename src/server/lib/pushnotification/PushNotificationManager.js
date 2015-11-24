var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');

var Const = require('../consts.js');
var Conf = require('../init.js');

var ConversationModel = require('../../Models/Conversation');
var UserModel = require('../../Models/User');

var AmazonSNS = require('./AmazonSNS');


var PushNotificationManager = {
    
    // receives user id to send push
    
    onNewMessage : function(message){
        
        var conversationModel = ConversationModel.get();
        var self = this;
        
        if(message.roomID){

        
            async.waterfall([
                function(done){
                    
                    var result = {};
                    
                    conversationModel.findOne({
                        _id: message.roomID
                    },function(err,resultConversation){

                        if(!result)
                            return;
                                                  
                        result.conversation = resultConversation;
                        
                        done(err,result);
                        
                    });

                },
                function(result,done){
 
                    UserModel.getUsersById(result.conversation.users,function(usersResult){
                        
                        result.users = usersResult;
                        
                        done(null,result);

                    })
                    
                }
            ],
            function(err,result){

                var payload = {
                
                    message : {
                        userID:message.userID,
                        roomID:message.roomID,
                        message:message.message,
                        type:message.type,
                        created:message.created
                        
                    }
                    
                }
                
                self.send(result.users,message.message,payload);
                
            });
        
        }
        
    },
    sendOne: function(user,message,payload){
        
        return this.send([user],message,payload);
        
    },
    send: function(users,message,payload){
        
        AmazonSNS.send(users,message,payload);
                        
    }
    
}

module["exports"] = PushNotificationManager;
