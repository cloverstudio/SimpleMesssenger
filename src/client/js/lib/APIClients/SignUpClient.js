var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');


(function(global) {
    "use strict;"

    var SignUpClient = function(){};
    
    _.extend(SignUpClient.prototype,APIClientBase.prototype);
    
    SignUpClient.prototype.send = function(data,success,err){
        
        this.postRequst("/user/signup",data,success,err);
        
    }
        
    // returns instance
    module["exports"] = new SignUpClient();

})((this || 0).self || global);