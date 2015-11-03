var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');


(function(global) {
    "use strict;"

    var LeaveConversationClient = function(){};
    
    _.extend(LeaveConversationClient.prototype,APIClientBase.prototype);
    
    LeaveConversationClient.prototype.send = function(conversation,success,err){
                
        this.getRequst("/conversation/leave/" + conversation.get('id'),success,err);
        
    }
        
    // returns instance
    module["exports"] = new LeaveConversationClient();

})((this || 0).self || global);