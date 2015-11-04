var CONST = require('../consts');
var APIClientBase = require('./APIClientBase');
var _ = require('lodash');
var Conf = require('../init');
var loginUserManager = require('../loginUserManager');

(function(global) {
    "use strict;"

    var UpdateConversationClient = function(){};
    
    _.extend(UpdateConversationClient.prototype,APIClientBase.prototype);
    
    UpdateConversationClient.prototype.send = function(
	    conversationId,
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
                url : Conf.APIEndpoint + "/conversation/update/" + conversationId,
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
                    
                    success(response.data);
                    
                },
                error: function (e) {
                    
                    err(e);
                } 
            });
   
    }
        
    // returns instance
    module["exports"] = new UpdateConversationClient();

})((this || 0).self || global);