var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');
var Conf = require('../init');
var loginUserManager = require('../loginUserManager');

(function(global) {
    "use strict;"

    var ChangePasswordClient = function(){};
    
    _.extend(ChangePasswordClient.prototype,APIClientBase.prototype);
    
    ChangePasswordClient.prototype.send = function(data,success,err){
        
        this.postRequst("/user/changepassword",data,success,err);
        
    }
        // returns instance
    module["exports"] = new ChangePasswordClient();

})((this || 0).self || global);