var mongoose = require('mongoose');
var _ = require('lodash');

var Const = require('./consts.js');
var Conf = require('./init.js');

var UserModel = require('../Models/User');

var OnlineUsersManager = {
    
    users:null,
    
    init:function(){
        this.users = [];
    },
    
    addUser:function(user,socketId){
    
        user.socketId = socketId;        
        this.users.push(user);
                
    },
    removeUser:function(socketId){
                
        var index = _.findIndex(this.users, function(user) { if(user) return user.socketId == socketId; else return false});
        delete this.users[index];
                
    },
    getSessionIdByUserId:function(userId){

        
        var userFound = null;
        
        _.forEach(this.users,function(user){
            
            if(!user)
                return;
                         
            if(user._id.toString() == userId.toString()){
                
                userFound = user;
                
            }
            
        });
                
        if(userFound)
            return userFound.socketId;
            
        
    }

}

module["exports"] = OnlineUsersManager;
