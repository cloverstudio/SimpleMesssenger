var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');
var Conf = require('../init');
var loginUserManager = require('../loginUserManager');

(function(global) {
    "use strict;"

    var UpdateProfileClient = function(){};
    
    _.extend(UpdateProfileClient.prototype,APIClientBase.prototype);
    
    UpdateProfileClient.prototype.send = function(
        displayName,
        file,
        success,
        progress,
        err){
                        
            var data = new FormData();
            data.append('displayName',displayName);
            data.append('file', file);
                                    
            $.ajax({
                type : "POST",
                url : Conf.APIEndpoint + "/user/updateprofile",
                data : data,
                dataType: 'json',
                contentType: false,
                processData: false,
                headers: {
                    "access-token":loginUserManager.getToken()
                },
                xhr: function(){
                
                    var xhr = $.ajaxSettings.xhr() ;
                    
                    xhr.upload.addEventListener("progress", function(evt) {
                        
                        if(progress)
                            progress(evt.loaded/evt.total);
                            
                    }, false);
    
                    return xhr ;
                },
                success: function (response) {  
                                        
                    if(response.error){
                        err();
                        return;
                    }
                    
                    success(response);
                    
                },
                error: function (e) {
                    
                    err(e);
                } 
            });
   
    }
        
    // returns instance
    module["exports"] = new UpdateProfileClient();

})((this || 0).self || global);