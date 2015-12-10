var Backbone = require('backbone');
var _ = require('lodash');
var Const = require('../../lib/consts');
var Utils = require('../../lib/utils');

(function(global) {
    "use strict;"

    var BaseView = Backbone.View.extend({
    
        container: null,
        showError : function(errCode){
            
            var message = "";
            
            if(Const.ErrorCodes[errCode])
                message = Utils.l10n(Const.ErrorCodes[errCode]);
            else
                message = Utils.l10n("Critical Error");
            
            $(this.container + " .alert-danger").hide();
            $(this.container + " .alert-info").hide();
            
            $(this.container + " .alert-danger").show();
            $(this.container + " .alert-danger .detail").text(message);
            
        },
        showInfo : function(err){
            
            $(this.container + " .alert-danger").hide();
            $(this.container + " .alert-info").hide();
            
            $(this.container + " .alert-info").show();
            $(this.container + " .alert-info .detail").text(err);
            
        },
        dismissAlerts : function(){
            
            $(this.container + " .alert-danger").hide();
            $(this.container + " .alert-info").hide();
            
        }
    });
        
    // returns instance
    module["exports"] = BaseView;

})((this || 0).self || global);