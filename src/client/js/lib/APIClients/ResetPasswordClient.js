var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');


(function(global) {
    "use strict;"

    var ResetPasswordClient = function(){};
    
    _.extend(ResetPasswordClient.prototype,APIClientBase.prototype);
    
    ResetPasswordClient.prototype.send = function(data,success,err){
        
        this.postRequst("/user/resetpassword",data,success,err);
        
    }
        
    // returns instance
    module["exports"] = new ResetPasswordClient();

})((this || 0).self || global);