var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');


(function(global) {
    "use strict;"

    var SignInClient = function(){};
    
    _.extend(SignInClient.prototype,APIClientBase.prototype);
    
    SignInClient.prototype.send = function(data,success,err){
        
        this.postRequst("/user/signin",data,success,err);
        
    }
        
    // returns instance
    module["exports"] = new SignInClient();

})((this || 0).self || global);