var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');

var RequestHandlerBase = require('./RequestHandlerBase');
var init = require('../lib/init');
var Const = require("../lib/consts");
var Utils = require('../lib/utils');


var ResetPasswordHandler = function(){}
var UserModel = require('../Models/User');

_.extend(ResetPasswordHandler.prototype,RequestHandlerBase.prototype);

ResetPasswordHandler.prototype.attach = function(router){
        
    var self = this;

   /**
     * @api {post} /api/v1/user/resetpassword Reset Password
     * @apiName Reset Password
     * @apiGroup WebAPI
     * @apiDescription Reset User's password with email address
     * @apiParam {string} email Email of target user

     * @apiSuccessExample Success-Response:
            {
                success: 1,
                data: {
                    ok: true
                }
            }
    */
    
    
    router.post('/',function(request,response){
            
        var userModel = UserModel.get();
        var email = request.body.email;
        
    	userModel.findOne({ 
    	    email: email
        },function (err, user) {
        
            
            if(_.isNull(user)){
            
                self.successResponse(response,{
                    ok: false
                });
                
                return;
            }
            
            var sha1 = require('sha1');

            var newPassword = Utils.getRandomString(6);
            var newPasswordHashed = sha1(newPassword);
            
            user.update({
                password: newPasswordHashed
            },{},function(err,user){

                if(err){
                    self.errorResponse(response,Const.httpCodeServerError);  
                    return;
                }
                
                Utils.sendEmail(email,"New Password","Your new password is " + newPassword + ".");
                
                self.successResponse(response,{
                    ok: true
                });
                
                                
            });
                
        });
        
    });

}

new ResetPasswordHandler().attach(router);
module["exports"] = router;
