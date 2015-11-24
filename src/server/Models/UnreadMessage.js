var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');

var Const = require("../lib/consts");
var Config = require("../lib/init");

var BaseModel = require('./BaseModel');

var Utils = require('../lib/utils');

var DatabaseManager = require('../lib/DatabaseManager');
var ConversationModel = require('./Conversation');
var UserModel = require('./User');

var UnreadMessage = function(){};

_.extend(UnreadMessage.prototype,BaseModel.prototype);

UnreadMessage.prototype.init = function(mongoose){
    
    this.schema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: Config.dbCollectionPrefix + "users" },
        conversationId: { type: mongoose.Schema.Types.ObjectId, ref: Config.dbCollectionPrefix + "conversation" },
        count: Number
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "unreadMessage", this.schema);

}

UnreadMessage.get = function(){
    
    return DatabaseManager.getModel('UnreadMessage').model;
    
}

     

UnreadMessage.clearCountByuserIdConversationId = function(userId,conversationId,callBack){
    
    var self = this;
    
    var unreadCountModel = DatabaseManager.getModel('UnreadMessage').model;
    
    if(Utils.isObjectId(userId)){
        
        unreadCountModel.update(
            {
                userId:userId,
                conversationId:conversationId
            },
            {count:0},
            {multi: true},
        function(err,result){
            
            if(callBack)
                callBack(err,result);
                    
        });
    
    } else {
        
        console.log(" on enter chat user 1", userId);

        UserModel.get().findOne({telNumber:userId},function(err,result){
            
            if(!result)
                return;
            
            console.log(" on enter chat user 2", result);
            
            unreadCountModel.update(
                {
                    userId:result._id,
                    conversationId:conversationId
                },
                {count:0},
                {multi: true},
            function(err,result){
                
                if(callBack)
                    callBack(err,result);
                        
            });
           
        });
    }
    
}

UnreadMessage.getUnreadCountByUserId = function(userId,callBack){
    
    var self = this;

    var unreadCountModel = DatabaseManager.getModel('UnreadMessage').model;
        
    unreadCountModel.find({
        userId:userId
    },function(err,result){
        
        if(callBack)
            callBack(err,result);
                
    });
    
}

UnreadMessage.newMessageToCounversation = function(excludeUsers,conversationId){
    
    var self = this;

    var model = DatabaseManager.getModel('UnreadMessage').model;
    var conversationModel = ConversationModel.get();
    
    // convert telnum to userid
    var userIdsOrig = excludeUsers;
    var telNums = [];
    var excludeUsesIds = [];
    
    
    for(var i = 0 ; i < userIdsOrig.length ; i++){
        
        if(!Utils.isObjectId(userIdsOrig[i])){
            
            telNums.push(userIdsOrig[i]);
            
        }else{
            excludeUsesIds.push(userIdsOrig[i]);
        }
        
    }
        
    UserModel.get().find({
    
        telNumber:{$in:telNums},
        
    },function(err,resultUsers){
        
        _.forEach(resultUsers,function(resultUser){
            
            excludeUsesIds.push(resultUser._id.toString());
                                  
        });              
    
        // get users of the group
        conversationModel.findOne({"_id":conversationId},function(err,result){
            
            if(!result)
                return;
                
            var users = result.users;
                        
            _.forEach(users,function(userId){
                
                if(_.indexOf(excludeUsesIds,userId.toString()) == -1)
                    self.incrementUsersUnreadCount(userId,conversationId);

                
            });
                    
        });
    

    }); 

}

UnreadMessage.incrementUsersUnreadCount = function(userId,conversationId){
    
    var result = {};
    var self = this;

    var unreadMessageModel = DatabaseManager.getModel('UnreadMessage').model;

    async.waterfall([
        
        function(done){
            
            unreadMessageModel.findOne({ userId: userId,conversationId:conversationId },function (err, row) {
                
                result.model = row;
                done(err,result);
                
            });
            
        },function(result,done){

            if(result.model){
                done(null,result);
            }else{
                
                // insert new one
                var model = new unreadMessageModel({
                    userId: userId,
                    conversationId: conversationId,
                    count : 0
                });
                
                model.save(function(err,savedModel){
                
                    result.model = savedModel;
                    
                    done(err,result);       
        
                });

                
            }
            
        },function(result,done){

            result.model.update({
                count: result.model.count + 1
            },function(err){
                
                done(null,result);
                
            });   
         
        }],
        function(err,result){
            
            
    });

    
}
module["exports"] = UnreadMessage;
