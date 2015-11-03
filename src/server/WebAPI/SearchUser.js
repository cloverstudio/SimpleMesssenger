var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var authenticator = require("./middleware/auth");

var SearchHandler = function(){}

_.extend(SearchHandler.prototype,RequestHandlerBase.prototype);

SearchHandler.prototype.attach = function(router){
        
    var self = this;

    router.get('',authenticator,function(request,response){
    
        var keyword = '';
        
        self.doSearch(keyword,function(result){
            
            self.successResponse(response,{
                ok: true,
                users: result
            });
            
        });
        
    });

    
    router.get('/:keyword',authenticator,function(request,response){
        
        var keyword = request.params.keyword;
        
        self.doSearch(keyword,function(result){
            
            self.successResponse(response,{
                ok: true,
                users: result
            });
            
        });
        
    });

}

SearchHandler.prototype.doSearch = function(keyword,callBack){

    var userModel = UserModel.get();
        
	userModel.find({ 
	    displayName : new RegExp(keyword, "i")
    },function (err, users) {
    
        if(callBack)
            callBack(users);
    
    });
    
}

new SearchHandler().attach(router);
module["exports"] = router;
