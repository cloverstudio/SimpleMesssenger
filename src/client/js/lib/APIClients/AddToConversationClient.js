var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');
var Conf = require('../init');
var loginUserManager = require('../loginUserManager');

(function(global) {
    "use strict;"

    var AddToConversationClient = function(){};
    
    _.extend(AddToConversationClient.prototype,APIClientBase.prototype);
    
    AddToConversationClient.prototype.send = function(
        conversationId,
        users,
        makeNew,
        success,
        err){
            
            var params = {
                conversationId : conversationId,
                users : users,
                makeNew : makeNew
            }
            
            this.postRequst("/conversation/add",params,success,err);
   
    }
        
    // returns instance
    module["exports"] = new AddToConversationClient();

})((this || 0).self || global);