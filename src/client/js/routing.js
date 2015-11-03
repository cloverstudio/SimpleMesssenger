var Backbone = require('backbone');
var Utils = require('./lib/utils');

var LoginUserManager = require('./lib/loginUserManager');

(function(global) {
    "use strict;"

    var Routing = function(){
        
        // setting up router
        var AppRouter = Backbone.Router.extend({
            routes: {
                "start": "startRoute",
                "main": "mainRoute",
                "*actions": "defaultRoute"
            }
        });
        
        // Initiate the router
        var appRouter = new AppRouter;
        
        appRouter.on('route:defaultRoute', function(actions) {
        
            Utils.goPage('start');
        
        });
        
        appRouter.on('route:startRoute', function(actions) {
            
            var StartView = require('./Views/Start/StartView.js');   
            var view = new StartView();
                    
        });

        appRouter.on('route:mainRoute', function(actions) {
        
            if(LoginUserManager.getUser() == null){
                Utils.goPage('start');
                return;
            }
            
            var MainView = require('./Views/Main/MainView.js');   
            var view = new MainView();
        
        });
        
    }

    // Exports ----------------------------------------------
    module["exports"] = new Routing();

})((this || 0).self || global);
