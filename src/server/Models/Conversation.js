var _ = require('lodash');

var Const = require("../lib/consts");
var Config = require("../lib/init");

var BaseModel = require('./BaseModel');
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
        lastMessage: {
            text: String,
            created: Number
        },
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

// class methods
ConversationModel.getConversationListByUserId = function(userId,callBack){

    var model = DatabaseManager.getModel('Conversation').model;

    model.find({ users:userId },function (err, result) {

        if (err) throw err;

        if(callBack)
            callBack(result);

    });

};


module["exports"] = ConversationModel;
