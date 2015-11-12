var mongoose = require('mongoose');
var _ = require('lodash');
var spika = require('../../../modules_customised/spika');

var Const = require('./consts.js');
var Conf = require('./init.js');

var PushNotificationManager = require('./pushnotification/PushNotificationManager');
var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');

var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var UnreadMessageModel = require('../Models/UnreadMessage');

var SpikaBridge = {
    
    init:function(app,io){
        
        var self = this;
        
        global.SpikaServer = new spika(app,io,{
        
            config:{
                chatDatabaseUrl : Conf.databaseUrl,
                port: Conf.port,
                uploadDir: Conf.uploadPath,
                imageDownloadURL: "/spika/media/images/",
                noavatarImg: "/spika/img/noavatar.png",
                urlPrefix: '/spika',
                sendAttendanceMessage: false
            },
            listeners:{
        
                onNewMessage:function(obj){
        
                    self.onNewMessage(obj);
                    
                },
                onNewUser:function(obj){
        
                    self.OnUserEnterChat(obj);
                    
                },
                OnUserTyping:function(obj){
        
        
                },
                OnMessageChanges:function(obj){
        
        
                }
        
            }
        
        });
        
    },
    onNewMessage : function(obj){
        
        
        var message = {
            _id: obj._id,
            userID: obj.userID,
            roomID: obj.roomID,
            conversationID: obj.roomID,
            message: obj.message,
            type: obj.type,
            created: obj.created
        }
        
        ConversationModel.updateLastMessage(obj.roomID,message);
        
        // update unread count
        // get users who are in the chat
        var usersInRoom = global.SpikaServer.getOnlineUsersByRoomId(obj.roomID);
        var userIdsInRoom = [];
        _.forEach(usersInRoom,function(row){
            userIdsInRoom.push(row.userID);
        });
        
        console.log('userIdsInRoom',userIdsInRoom);
        
        UnreadMessageModel.newMessageToCounversation(userIdsInRoom,obj.roomID);

        // notify online users
        ConversationModel.get().findOne({_id:obj.roomID},function(err,result){
            
            if(err)
                return;
                
            if(!result)
                return;
                        
            _.forEach(result.users,function(userId){
                                
                SocketAPIHandler.emitToUser(
                    userId,
                    Const.emitCommandNewMessage,
                    {message:message}
                );
                
            });
            
        });
        
        PushNotificationManager.onNewMessage(obj);
    
    },
    OnUserEnterChat: function(obj){
        
        console.log('user enter the chat',obj);
        UnreadMessageModel.clearCountByuserIdConversationId(obj.userID,obj.roomID);
        
    }

}

module["exports"] = SpikaBridge;
