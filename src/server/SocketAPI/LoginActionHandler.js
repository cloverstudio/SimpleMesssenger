var _ = require('lodash');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require('../lib/utils');

var OnlineUsersManager = require('../lib/OnlineUsersManager');


var SocketHandlerBase = require('./SocketHandlerBase');
var UserModel = require('../Models/User');


var LoginActionHandler = function(){
    
}

_.extend(LoginActionHandler.prototype,SocketHandlerBase.prototype);

LoginActionHandler.prototype.attach = function(io,socket){
        
    var self = this;

    /**
     * @api {socket} "join" Login to the room
     * @apiName join
     * @apiGroup Socket 
     * @apiDescription join to the server
     * @apiParam {string} user User Id
     *
     */
    socket.on('join', function(param){
        
        var userId = param.user;
        
        console.log('join called',param);
        
        if(_.isEmpty(userId)){
            
            console.log('err',"no user id");
              
            socket.emit('socketerror', {code:Const.resCodeSocketLoginNoUserID});               
            return;
        }
            
        var userModel = UserModel.get();
        
        UserModel.getUserById(userId,function(result){
            
            if(!result)
                return;
            
            OnlineUsersManager.addUser(result.toObject(),socket.id);
             
        });
           
        
    });

}


module["exports"] = new LoginActionHandler();