var Backbone = require('backbone');
var _ = require('lodash');

var Utils = require('../../lib/utils');
var Const = require('../../lib/consts');
var Config = require('../../lib/init');

// load template
var template = require('./Header.hbs');
var SelectUserBox = require('../Parts/SelectUserBox/SelectUserBox');
var NewConversationClient = require('../../lib/APIClients/NewConversationClient');

var ConversationModel = require('../../Models/conversation');

var HeaderView = Backbone.View.extend({

    parentElement : null,

    initialize: function(options) {
        this.parentElement = options.el;
        this.render();
    },

    render: function() {

        $(this.parentElement).html(template());

        this.onLoad();

        return this;

    },

    onLoad: function(){

        var self = this;

        this.selectUserBox = new SelectUserBox({
            el:".select-user-box",
            listener: function(selectedUsers){

                self.createNewChat(selectedUsers);

            }
        });


        $('#btn-accountsettings').unbind().on('click',function(){

            var EditProfileModal = require('../Modals/EditProfile/EditProfile');
            
            EditProfileModal.show(function(){
                
                

            });

        });

        $('#btn-changepassword').unbind().on('click',function(){

            var ChangePasswordModal = require('../Modals/ChangePassword/ChangePassword');
            
            ChangePasswordModal.show(function(){
                
                

            });

        });

        $('#btn-logout').unbind().on('click',function(){

            Utils.goPage('');

        });

        $('#btn-newchat').unbind().on('click',function(){

            self.tuggleNewChat();

        });


        $('#btn-newchat').unbind().on('click',function(){

            self.tuggleNewChat();

        });

        $('#btn-info').unbind().on('click',function(){

            Backbone.trigger(Const.NotificationTuggleInfo,null);
            
        });
                
        
        
    },

    tuggleNewChat: function(){

        if($('#header-panel-default').hasClass('hide')){

            $('#header-panel-default').removeClass('hide');
            $('#header-panel-newchat').addClass('hide');

        }else{

            $('#header-panel-default').addClass('hide');
            $('#header-panel-newchat').removeClass('hide');

        }

    },

    createNewChat: function(collectionUsers){

        this.tuggleNewChat();

        NewConversationClient.send(collectionUsers,function(response){

            if(_.isEmpty(response.result.conversation))
                return;

            var conversation = ConversationModel.modelByResult(response.result.conversation);

            // update panels
            Backbone.trigger(Const.NotificationNewChat,conversation);

        },function(err){


        });

    }

});

module.exports = HeaderView;
