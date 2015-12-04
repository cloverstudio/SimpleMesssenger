var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');
var validator = require('validator');

var RequestHandlerBase = require('./RequestHandlerBase');
var init = require('../lib/init');
var Const = require("../lib/consts");
var Utils = require('../lib/utils');

var ChangePasswordHandler = function(){}
var UserModel = require('../Models/User');

var authenticator = require("./middleware/auth");

_.extend(ChangePasswordHandler.prototype,RequestHandlerBase.prototype);

ChangePasswordHandler.prototype.attach = function(router){
        
    var self = this;

    router.post('/',authenticator,function(request,response){
            
        var userModel = UserModel.get();
        var currentPassword = request.body.currentPassword;
        var newPassword = request.body.newPassword;
        
        var sha1 = require('sha1');

        // check password
        if(request.user.password != currentPassword){
            
            self.successResponse(response,Const.resCodeChangePasswordWrongOldPassword);
            
            return;
        }

        // check new password
        var errorCode = 0;
        
        if(!validator.isAlphanumeric(newPassword)){
        	errorCode = Const.resCodeChangePasswordWrongNewPassword;
        	
        } else if(!validator.isLength(newPassword,Const.credentialsMinLength)){
        	errorCode = Const.resCodeChangePasswordWrongNewPassword;
        }
        
        if(errorCode != 0){

            self.successResponse(response,errorCode);
            
            return;
            
        }
        
        var user = request.user;
        
        user.update({
            password: sha1(newPassword)
            
        },{},function(err,userResult){
            
            if(err){
                
                self.errorResponse(response,Const.httpCodeServerError);   
                                 
            }else {
            
                self.successResponse(response,Const.responsecodeSucceed);
                   
            }
        
        });
        
    });

}

new ChangePasswordHandler().attach(router);
module["exports"] = router;
