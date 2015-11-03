var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');


(function(global) {
    "use strict;"

    var SearchUserClient = function(){};
    
    _.extend(SearchUserClient.prototype,APIClientBase.prototype);
    
    SearchUserClient.prototype.send = function(keyword,success,err){
        
        this.getRequst("/search/user/" + keyword,success,err);
        
    }
        
    // returns instance
    module["exports"] = new SearchUserClient();

})((this || 0).self || global);