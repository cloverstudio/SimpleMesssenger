var socket = require('socket.io-client');
var Backbone = require('backbone');
var _ = require('lodash');

var Const = require('./consts');
var Config = require('./init');

var ConversationModel = require('../Models/conversation');


(function(global) {
    "use strict;"

    var socketIOManager = {
        
        io : null,
        
        init:function(){
                        
            this.io = socket.connect(Config.socketUrl);
            
            this.io.on('newconversation', function(param){
                
                var conversation = ConversationModel.modelByResult(param.conversation);
                Backbone.trigger(Const.NotificationNewChat,conversation);
                                
            });
            
            this.io.on('newmessage', function(param){
                
                Backbone.trigger(Const.NotificationNewMessage,param);
                                
            });
            
        },
        
        emit:function(command,params){
                        
            var command = arguments[0];
            this.io.emit(command, params);
            
        }
            
    };
 
    // Exports ----------------------------------------------
    module["exports"] = socketIOManager;

})((this || 0).self || global);