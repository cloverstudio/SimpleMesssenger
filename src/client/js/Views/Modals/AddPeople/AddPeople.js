var $ = require('jquery');
var _ = require('lodash');
var validator = require('validator');

var Utils = require('../../../lib/utils.js');
var template = require('./AddPeople.hbs');
var AddToConversationClient = require('../../../lib/APIClients/AddToConversationClient');
var loginUserManager = require('../../../lib/loginUserManager');

var SelectUserBox = require('../../Parts/SelectUserBox/SelectUserBox');

var AddPeople = {

    conversation : null,
    onFinish : null,
    
    show: function(conversation, onSave) {
    
        var self = this;
        this.conversation = conversation;
        this.onFinish = onSave;
        
        $('body').append(template({
            conversation: conversation.attributes
        }));

        this.selectUserBox = new SelectUserBox({
            el:"#modal-addpeople .select-user-box",
            listener: function(selectedUsers){
                
            }
        });

        $('#modal-addpeople').on('hidden.bs.modal', function(e) {
            $('#modal-addpeople').remove();
            
        })

        $('#modal-addpeople').on('show.bs.modal', function (e) {
            self.load();
        })
        
        $('#modal-addpeople').modal('show');
        $('#modal-btn-close').unbind().on('click', function() {
            self.finish(null);
        });
    },
    finish: function(params) {
        
        var self = this;
        
        $('#modal-addpeople').on('hidden.bs.modal', function(e) {
            $('#modal-addpeople').remove();
                        
            if (self.onFinish) {
                
                self.onFinish(params);
                
            }
        })
        
        $('#modal-addpeople').modal('hide');
    },
    load : function(){
        
        var self = this;
        
        $('#modal-btn-save').unbind().on('click', function() {
            
            self.save();
            
        });
        
    },
    save : function(){
        
        $('#modal-addpeople .alert-danger').hide();
        
        var errorMessage = this.validate();
        
        if(!_.isEmpty(errorMessage)){
            
            $('#modal-addpeople .alert-danger').text(errorMessage);
            $('#modal-addpeople .alert-danger').show();
         
            return;   
        
        }
        
        this.doSave();
        
    },
    validate : function(){
        
        var users = this.selectUserBox.getSelectedUsers();
        
        if(users.length == 0)
            return Utils.l10n("Please select users.");
                               
        return "";
    },
    doSave : function(){
        
        var self = this;
        
        $('#modal-btn-save').attr('disabled','disabled');
        $('#modal-addpeople .progress').show();
        
        var users = this.selectUserBox.getSelectedUsers();
        var userIds = [];
        
        users.forEach(function(user){
            
            var userId = user.get('id');
            userIds.push(userId);
            
        });
        
        var makeNew = $('#modal-addpeople input[name="makeNew"]').is(':checked')
        
        AddToConversationClient.send(this.conversation.get('id'),userIds,makeNew,function(response){
                        
            if(response.validationError){
                
                $('#modal-addpeople .alert-danger').text(Utils.l10n(response.validationError));
                $('#modal-addpeople .alert-danger').show();
    
                $('#modal-addpeople .progress').hide();           
                $('#modal-btn-save').removeAttr('disabled'); 
                
                return;
                
            }
            
            $('#modal-btn-save').removeAttr('disabled');
            $('#modal-addpeople .progress').hide();
            $('#modal-addpeople .alert-success').show();
            
            _.debounce(function(){
                
                self.finish({
                    makeNew:makeNew,
                    response:response
                });
                
            },500)();

        },function(){
            
            $('#modal-addpeople .alert-danger').text(Utils.l10n("Fails to add users, plase try again while after."));
            $('#modal-addpeople .alert-danger').show();

            $('#modal-addpeople .progress').hide();           
            $('#modal-btn-save').removeAttr('disabled'); 
            
        });
        
    }
    
}
module.exports = AddPeople;