var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');

var Const = require('../consts.js');
var Conf = require('../init.js');

var ConversationModel = require('../../Models/Conversation');
var UserModel = require('../../Models/User');
var UnreadMessaage = require('../../Models/UnreadMessage');

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
                
                var userFrom = null;
                
                 _.forEach(result.users,function(user){
                    
                    if(user._id.toString() == message.userID ||
                        user.telNumber == message.userID)
                        
                        userFrom = user;
                    
                 });
                    
                _.forEach(result.users,function(user){
                
                    UnreadMessaage.getUnreadCountByUserId(user._id,function(err,unreadMessages){
                        
                        
                        var count = 0;
                        
                        _.forEach(unreadMessages,function(unreadMessageData){
                            
                           if(unreadMessageData.conversationId.toString() == message.roomID){
                               
                               count = unreadMessageData.count;
                               
                           }
                            
                        });
                        
                        var payload = {
                            pushType : 1,
                            message : {
                                userID:message.userID,
                                roomID:message.roomID,
                                message:message.message,
                                type:message.type,
                                created:message.created
                                
                            }
                            
                        }
                        
                        self.sendOne(userFrom,user,message.message,payload,count);
                
                    });
                });
                
            });
        
        }
        
    },
    sendOne: function(userFrom,user,message,payload,count){
        
        return this.send(userFrom,[user],message,payload,count);
        
    },
    send: function(userFrom,users,message,payload,count){
        
        AmazonSNS.send(userFrom,users,message,payload,count);
                        
    }
    
}

module["exports"] = PushNotificationManager;
