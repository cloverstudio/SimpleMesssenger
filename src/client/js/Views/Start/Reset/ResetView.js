var Backbone = require('backbone');
var template = require('./Reset.hbs');
var _ = require('lodash');
var validator = require('validator');

var Utils = require('../../../lib/utils');
var Const = require('../../../lib/consts');
var Config = require('../../../lib/init');

var BaseView = require('../BaseView');
var ResetPasswordClient = require('../../../lib/APIClients/ResetPasswordClient');

var ResetView = BaseView.extend({

    initialize: function(options) {
        
        this.container = options.container;
        this.render();
    },

    render: function() {
        
        $(this.container).html(template());

        this.onLoad();

        return this;

    },

    onLoad: function(){

        var self = this;

        $('#form-reset input').unbind().on('keyup',function(e){

            if (e.keyCode == 13) {
                
                $('#form-reset #btn-reset').click();
                
            }

        });
        
		$('#form-reset #btn-reset').unbind().on('click',function(){
			
			if(!_.isEmpty($(this).attr('disabled')))
			    return;
                
			self.dismissAlerts();

			$(this).attr('disabled','disabled');
			
			self.validate(function(err){
				
				self.resetValidationAlert();
				
				if(!_.isEmpty(err.email)){
					$('#form-reset .email').addClass('has-error');
					$('#form-reset .email .help-block').text(err.email);
				}

				var validationSuccess = _.isEmpty(err.email);
				
				if(!validationSuccess){
    				$('#form-reset #btn-reset').removeAttr('disabled');
    				return;
				}
					
                    
        		var email = $('#form-reset input[name="email"]').val();
                
                ResetPasswordClient.send({
                    
                    email:email
                                        
                },function(data){
                                        
                    self.showInfo(Utils.l10n("New password is sent to your email."));
                    
                    $('#form-reset #btn-reset').removeAttr('disabled');
                    
                },function(errorCode){
                    self.showError(errorCode);
                    $('#form-reset #btn-reset').removeAttr('disabled');	
                })

                
			});
			
		});
		
    },

	resetValidationAlert : function(){
		
		$('#form-reset .email').removeClass('has-error');
		$('#form-reset .email .help-block').text('');

	},
	
    validate: function(callBack){

		var email = $('#form-reset input[name="email"]').val();
		
		var err = {
		    email : ''
		}
		
		if(_.isEmpty(email))
			err.email = Utils.l10n("Please input email address.");
		else if(!validator.isEmail(email)){
			err.email = Utils.l10n("Wrong email address");
		} 
		
		callBack(err);
		
    }

});

module.exports = ResetView;
