var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');
var Conf = require('../init');
var loginUserManager = require('../loginUserManager');

(function(global) {
    "use strict;"

    var NewConversationClient = function(){};
    
    _.extend(NewConversationClient.prototype,APIClientBase.prototype);
    
    NewConversationClient.prototype.send = function(
        collectionUsers,
        success,
        progress,
        err){
            
            var userIds = [];
            
            collectionUsers.each(function(user){
                
                userIds.push(user.get('id'));
                
            });
            
            var request = {
                users: userIds
            }
            
            this.postRequst("/conversation/new",request,success,err);
   
    }
        
    // returns instance
    module["exports"] = new NewConversationClient();

})((this || 0).self || global);