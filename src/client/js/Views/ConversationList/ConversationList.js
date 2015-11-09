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
var template = require('./ConversationList.hbs');

var ConversationList = Backbone.View.extend({

    conversations : null,

    initialize: function(options) {
        this.parentElement = options.el;
        this.render();
    },

    render: function() {

        this.onLoad();

        return this;


    },

    onLoad: function(){

        var self = this;
        this.refresh();

        Backbone.on(Const.NotificationNewChat,function(obj){

            self.refresh();

        });

        Backbone.on(Const.NotificationCloseConversation,function(obj){

            self.refresh();

        });

        Backbone.on(Const.NotificationUpdateConversation,function(obj){
			
			Backbone.trigger(Const.NotificationOpenConversation,obj);
            self.refresh();

        });

    },

    refresh: function(){

        var self = this;

        ConversationListClient.send(function(response){
                        
            self.conversations =  Conversation.collectionByResult(response.conversations);
            $(self.parentElement).html(template({list:self.conversations.toJSON()}));
            self.setupEvents();

        },function(err){

            console.log(err);

        });

    },
    setupEvents: function(){

      var self = this;

      $("#main-conversationlist li").unbind().on("click",function(){

        var conversationId = $(this).attr("conversationid");
        var conversation = self.conversations.where({id:conversationId});

        if(_.isArray(conversation)){
            LoginUserManager.currentConversation = conversation[0];
            Backbone.trigger(Const.NotificationOpenConversation,conversation[0]);
        }

      });

    }

});

module.exports = ConversationList;
