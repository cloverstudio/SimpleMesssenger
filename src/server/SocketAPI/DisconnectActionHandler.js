var _ = require('lodash');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require('../lib/utils');

var OnlineUsersManager = require('../lib/OnlineUsersManager');


var SocketHandlerBase = require('./SocketHandlerBase');
var UserModel = require('../Models/User');


var DisconnectActionHandler = function(){
    
}

_.extend(DisconnectActionHandler.prototype,SocketHandlerBase.prototype);

DisconnectActionHandler.prototype.attach = function(io,socket){
        
    var self = this;

    /**
     * @api {socket} "disconnect" Disconnect from server
     * @apiName disconnect
     * @apiGroup Socket 
     * @apiDescription Disconnect from server
     *
     */
    socket.on('disconnect', function(){
           
        OnlineUsersManager.removeUser(socket.id);
        
    });

}


module["exports"] = new DisconnectActionHandler();