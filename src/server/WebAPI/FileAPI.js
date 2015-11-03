var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs-extra');


var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var authenticator = require("./middleware/auth");
var init = require('../lib/init');

var FileApiHandler = function(){}

_.extend(FileApiHandler.prototype,RequestHandlerBase.prototype);

FileApiHandler.prototype.attach = function(router){
        
    var self = this;

    router.get('/avatar/:fileid',function(request,response){
    
        var fileid = request.params.fileid;
        
        return self.getAvatar(request,response,fileid);
        
    });

    
    router.get('/avatar/',function(request,response){
        
        var fileid = "";
        
        return self.getAvatar(request,response,fileid);
        
    });

}

FileApiHandler.prototype.getAvatar = function(request,response,fileid){
    
    var filePath = init.uploadPath + fileid;

    if(_.isEmpty(fileid)){
        
        filePath = init.publicPath + init.defaultAvatar;
    }
    
    fs.exists(filePath, function (exists) {
        
        if(!exists){
            filePath = init.publicPath + init.defaultAvatar
        }
        
        response.download(filePath);
        
    });

}

new FileApiHandler().attach(router);
module["exports"] = router;
