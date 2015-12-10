var JSON = require('JSON2');
var _ = require('lodash');

var Const = require('../consts');
var Conf = require('../init');
var loginUserManager = require('../loginUserManager');


(function(global) {
    "use strict;"

    var APIClientBase = function(){}
    
    APIClientBase.prototype.getRequst = function(urlPrefix,success,error){
        
        var headers = {};
        var accessToken = loginUserManager.getToken();
        if(accessToken)
            headers['access-token'] = accessToken;
                        
        $.ajax({
            type: 'GET',
            url: Conf.APIEndpoint + urlPrefix,
            dataType: 'json',
            headers: headers,
            success: function(response) {
            
                if(response.code != 1){
                    
                    if(_.isFunction(error)){
                        error(response.code);
                    }
                    
                    return;
                }
                
                if(_.isFunction(success)){
                    success(response.data);
                }
            },
            error: function() {
                if(_.isFunction(error)){
                    error();
                }
            }
        });
        
    }

    APIClientBase.prototype.postRequst = function(urlPrefix,data,success,error){

        var headers = {};
        var accessToken = loginUserManager.getToken();
        if(accessToken)
            headers['access-token'] = accessToken;
            
        $.ajax({
            type: 'POST',
            url: Conf.APIEndpoint + urlPrefix,
            data: JSON.stringify(data),
            dataType: 'json',
            headers: headers,
            contentType: "application/json; charset=utf-8",
            success: function(response) {
            
                if(response.code != 1){
                    
                    if(_.isFunction(error)){
                        error(response.code);
                    }
                    
                    return;
                }
                
                if(_.isFunction(success)){
                    success(response.data);
                }
            },
            error: function() {
                if(_.isFunction(error)){
                    error();
                }
            }
        });
        
    }
        
    // returns instance
    module["exports"] = APIClientBase;

})((this || 0).self || global);