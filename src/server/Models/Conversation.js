var _ = require('lodash');
var async = require('async');

var Const = require("../lib/consts");
var Config = require("../lib/init");

var BaseModel = require('./BaseModel');
var User = require('../Models/User');

var ConversationModel = function(){};
var DatabaseManager = require('../lib/DatabaseManager');

_.extend(ConversationModel.prototype,BaseModel.prototype);

ConversationModel.prototype.init = function(mongoose){

    this.schema = new mongoose.Schema({
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: Config.dbCollectionPrefix + "users" }],
        owner: { type: mongoose.Schema.Types.ObjectId, index: true },
        name: String,
        description: String,
        created: Number,
        lastMessage: {},
        avatar : {
            file : String,
            thumb : String
        }
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "conversation", this.schema);

}

ConversationModel.get = function(){

    return DatabaseManager.getModel('Conversation').model;

}

ConversationModel.updateLastMessage = function(conversationId,messageObj){

    var model = DatabaseManager.getModel('Conversation').model;
    
    model.update(
        {_id:conversationId},
        {lastMessage:messageObj},
        {},
        function(err, numAffected){
            
            
        });
    
}

// class methods
ConversationModel.getConversationListByUserId = function(userId,callBack){

    var model = DatabaseManager.getModel('Conversation').model;
    var conversationList = [];
    
    model.find({ users:userId },function (err, result) {

        if (err) throw err;
        
        async.forEachOf(result,function(conversation,key,done){
            
            User.getUsersByIdForResponse(conversation.users,function(resultUsers){
                
                conversation = conversation.toObject();
                conversation.users = resultUsers;
                conversationList.push(conversation);
                
                done(null);
                
            });
         
        },function(err){
                            
            if(err)
                throw err;
                        
            if(callBack)
                callBack(conversationList);
                        
        });

    });

};


module["exports"] = ConversationModel;
