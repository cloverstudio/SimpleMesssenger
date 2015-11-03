var CONST = require('./consts');
var _ = require('lodash');
var U = require('./utils.js');

var UserModel = require('../Models/user');

var loginUserManager = {
    
    user : null,
    token : null,
    currentConversation : null,
    setUser : function(user){
        
        this.user = UserModel.modelByResult(user);
        
        
    },

    setToken : function(token){
        
        this.token = token;
                
    },
        
    getUser : function(){
        
        return this.user;
        
    },

    getToken : function(){
        
        return this.token;
        
    }

}

module["exports"] = loginUserManager;