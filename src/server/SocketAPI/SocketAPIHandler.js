var express = require('express');
var router = express.Router();
var _ = require('lodash');
var async = require('async');

var Const = require("../lib/consts");
var Config = require("../lib/init");
var Utils = require('../lib/utils');

var OnlineUsersManager = require('../lib/OnlineUsersManager');

var SocketAPIHandler = {
    
    io:null,
    nsp : null,
    init: function(io){
        
        var self = this;
        this.io = io;
        this.nsp = io.of(Config.socketNameSpace);
        
        this.nsp.on('connection', function(socket) {
            
            require('./LoginActionHandler').attach(io,socket);
            require('./DisconnectActionHandler').attach(io,socket);
            
        });


    },
    emitToUser: function(userId,command,param){
        
        var sessionId = OnlineUsersManager.getSessionIdByUserId(userId);
        
        if(sessionId){
            this.nsp.to(sessionId).emit(command,param);
        }
        

    }
    
};

module["exports"] = SocketAPIHandler;