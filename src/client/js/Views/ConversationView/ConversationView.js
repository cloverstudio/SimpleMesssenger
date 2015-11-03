var Backbone = require('backbone');
var _ = require('lodash');

var Utils = require('../../lib/utils');
var Const = require('../../lib/consts');
var Config = require('../../lib/init');

var LoginUserManager = require('../../lib/loginUserManager');
var User = require('../../Models/user');
var Conversation = require('../../Models/conversation');

var ConversationListClient = require('../../lib/APIClients/ConversationListClient');

// load template
var template = require('./ConversationView.hbs');

var ConversationView = Backbone.View.extend({

    initialize: function(options) {
        this.parentElement = options.el;
        this.render();
    },

    render: function() {

        this.onLoad();
        $(this.parentElement).html(template({}));
        return this;
    },

    onLoad: function(){

        var self = this;
        this.refresh();

        Backbone.on(Const.NotificationNewChat,function(obj){

            self.refresh(obj);

        });
        
        Backbone.on(Const.NotificationOpenConversation,function(obj){

            self.refresh(obj);

        });

        Backbone.on(Const.NotificationCloseConversation,function(obj){

            $(self.parentElement).html(template({}));

        });
        
    },

    refresh: function(conversation){

        var self = this;

        if(!conversation)
          return;
        
        console.log(window.location);
        
        SpikaAdapter.attach({

            spikaURL: Config.SpikaBaseURL,
            attachTo : self.parentElement.substring(1),
            user : {
                id : LoginUserManager.getUser().get("id"),
                name : LoginUserManager.getUser().get("displayName"),
                avatarURL : LoginUserManager.getUser().get("avatar").thumb,
                roomID : conversation.get("id")
            },
            config : {
                apiBaseUrl : window.location.origin + Config.SpikaBaseURL + "/v1",
                socketUrl : window.location.origin + Config.SpikaBaseURL,
                showSidebar : false,
                showTitlebar : false
            },
            listener : {

                onPageLoad: function(){
                    
                },
                onNewMessage:function(obj){

                },
                onNewUser:function(obj){

                },
                onUserLeft:function(obj){

                },
                OnUserTyping:function(obj){

                },
                OnMessageChanges:function(obj){

                },
                onOpenMessage:function(obj){
                    return true;
                },
                OnOpenFile:function(obj){
                    return true;
                }
            }

        });


    }

});

module.exports = ConversationView;
