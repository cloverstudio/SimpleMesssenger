var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');


(function(global) {
    "use strict;"

    var ConversationListClient = function(){};
    
    _.extend(ConversationListClient.prototype,APIClientBase.prototype);
    
    ConversationListClient.prototype.send = function(conversationId,success,err){
                
        this.getRequst("/conversation/detail/" + conversationId,success,err);
        
    }
        
    // returns instance
    module["exports"] = new ConversationListClient();

})((this || 0).self || global);