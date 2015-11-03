var Const = require('./consts');
var Config = require('./init');

var _ = require('lodash');
var U = require('./utils.js');

var Handlebars = require('hbsfy/runtime');
Handlebars.registerHelper('test', function(context, options) {
  return options.fn(context);
});

(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    function ViewHelpers() {
    };

    // Header -----------------------------------------------
    ViewHelpers.prototype.attach = attach; 

    // Implementation ---------------------------------------
    
    function attach(){
         
        Handlebars.registerHelper("l10n", function(text) {
          return  text;
        });
        
        Handlebars.registerHelper("avatarURL", function(fileID) {
            
            return Config.APIEndpoint + "/file/avatar/" + fileID
            
        });

        Handlebars.registerHelper("formatDate", function(ut) {
          return  U.formatDate(ut,false);
        });
        
    }
    
    // Exports ----------------------------------------------
    module["exports"] = new ViewHelpers();

})((this || 0).self || global);