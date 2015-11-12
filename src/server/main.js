var socket = require('socket.io');
var express = require('express');
var http = require('http');

var Conf = require('./lib/init.js');

// initialization
var app = express();
var server = http.createServer(app);
var port = Conf.port;
var io = socket.listen(server);

var WebAPI = require('./WebAPI/WebAPIMain');
var SocketAPI = require('./SocketAPI/SocketAPIHandler');

var DatabaseManager = require('./lib/DatabaseManager');
var PushNotificationManager = require('./lib/pushnotification/PushNotificationManager');
var OnlineUsersManager = require('./lib/OnlineUsersManager');
var SpikaBridge = require('./lib/SpikaBridge');

DatabaseManager.init(function(success){

    if(!success){

        console.log('Failed to connect DB');
        process.exit(1);

    } else {
        
        SpikaBridge.init(app,io);
        WebAPI.init(app);
        SocketAPI.init(io);
        OnlineUsersManager.init();
        
        server.listen(Conf.port, function(){
            console.log('Server listening on port ' + Conf.port + '!');
        });

    }

});
