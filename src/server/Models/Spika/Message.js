var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');

var Const = require("../../lib/consts");
var Config = require("../../lib/init");

var BaseModel = require('../BaseModel');
var DatabaseManager = require('../../lib/DatabaseManager');


var Message = function(){};

_.extend(Message.prototype,BaseModel.prototype);

Message.prototype.init = function(mongoose){

    // Defining a schema
    this.schema = new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, index: true },
        localID: { type: String, index: true },
        userID: { type: String, index: true },
        roomID: { type: String, index: true },
        type: Number,
        message: String,
        image: String,
        file: {
            file: {
                id: mongoose.Schema.Types.ObjectId,
	            name: String,
	            size: Number,
	            mimeType: String
            },
            thumb: {
                id: mongoose.Schema.Types.ObjectId,
	            name: String,
	            size: Number,
	            mimeType: String
            }
        },
        seenBy:[],
        location: {
	            lat: Number,
	            lng: Number
        },
        deleted: Number,
        created: Number
    });

    this.model = mongoose.model(Config.dbCollectionPrefix + "spika_message", this.schema);

}

module["exports"] = Message;
