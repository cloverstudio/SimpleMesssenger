var Backbone = require('backbone');
var _ = require('lodash');

(function(global) {
    "use strict;"

    var BaseView = Backbone.View.extend({
    
        container: null,
        showError : function(err){
            
            $(this.container + " .alert-danger").hide();
            $(this.container + " .alert-info").hide();
            
            $(this.container + " .alert-danger").show();
            $(this.container + " .alert-danger .detail").text(err);
            
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