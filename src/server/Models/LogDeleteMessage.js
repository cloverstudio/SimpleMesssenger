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

var LogDeleteMessage = function(){};

_.extend(LogDeleteMessage.prototype,BaseModel.prototype);

LogDeleteMessage.prototype.init = function(mongoose){
    
    this.schema = new mongoose.Schema({
        messageId: { type: mongoose.Schema.Types.ObjectId },
        conversationId: { type: mongoose.Schema.Types.ObjectId, ref: Config.dbCollectionPrefix + "conversation" },
        created: Number
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "logDeleteMessage", this.schema);

}

LogDeleteMessage.get = function(){
    
    return DatabaseManager.getModel('LogDeleteMessage').model;
    
}


module["exports"] = LogDeleteMessage;
