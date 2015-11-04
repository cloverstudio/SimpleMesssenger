var Backbone = require('backbone');
var _ = require('lodash');

var Utils = require('../../lib/utils');
var Const = require('../../lib/consts');
var Config = require('../../lib/init');

// load template
var LoginUserManager = require('../../lib/loginUserManager');
var SelectUserBox = require('../Parts/SelectUserBox/SelectUserBox');
var NewConversationClient = require('../../lib/APIClients/NewConversationClient');
var LeaveConversationClient = require('../../lib/APIClients/LeaveConversationClient');
var ConversationModel = require('../../Models/conversation');

var AddPeopleModal = require('../Modals/AddPeople/AddPeople');
var ConfirmModal = require('../Modals/ConfirmDialog/ConfirmDialog');
var AlertModal = require('../Modals/AlertDialog/AlertDialog');

var template = require('./InfoView.hbs');
var templateEmpty = require('./InfoViewNoConversation.hbs');


var InfoView = Backbone.View.extend({

    parentElement : null,
    currentConversation : null,
    initialize: function(options) {
        this.parentElement = options.el;
        this.render();
    },

    render: function() {

        $(this.parentElement).html(templateEmpty());

        this.onLoad();

        return this;

    },

    onLoad: function(){
        
        var self = this;

        Backbone.on(Const.NotificationOpenConversation,function(obj){
            
            $(self.parentElement).html(template({conversation:obj.attributes}));

            self.currentConversation = obj;
            
            $("#btn-addpeople").unbind().on('click',function(){
                
                AddPeopleModal.show(obj,function(result){
                                        
                    var conversation = ConversationModel.modelByResult(result.response.conversation);
                    
                    console.log(conversation);
                    
                    if(result.makeNew){
                        Backbone.trigger(Const.NotificationNewChat,conversation);
                    }else{
                        Backbone.trigger(Const.NotificationUpdateConversation,conversation);                    
                    }
                    
                });
                
            });
            
            $("#btn-leaveconversation").unbind().on('click',function(){
                
                 ConfirmModal.show(
                    Utils.l10n("Leave from conversaiton"),
                    Utils.l10n("Please press OK to proceed."),
                    function(){
                        
                        LeaveConversationClient.send(
                            self.currentConversation,
                            function(response){
                                
                                if(response.validationError){

                                    AlertModal.show(
                                        Utils.l10n("Error"),
                                        Utils.l10n(Utils.l10n(response.validationError))
                                    );
                                    
                                } else {
                                    
                                    Backbone.trigger(Const.NotificationCloseConversation);   
                                    
                                    LoginUserManager.currentConversation = null;
                                    
                                }
                                
                            },
                            function(){
                                AlertModal.show(
                                    Utils.l10n("Error"),
                                    Utils.l10n("Faild to leave conversation.")
                                );
                            }
                        )                      
                        
                    },
                    function(){
                        console.log('cancel');                         
                    }
                );
                
            });
        
        });

        Backbone.on(Const.NotificationCloseConversation,function(obj){
            
            $(self.parentElement).html(templateEmpty());

        });


   
    },
    
    tuggleEditMenu : function(){
        
        $('#conversation-edit-dropdown button').trigger('click.bs.dropdown');
        
    }

});

module.exports = InfoView;
