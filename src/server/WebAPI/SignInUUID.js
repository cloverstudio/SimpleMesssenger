var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');

var RequestHandlerBase = require('./RequestHandlerBase');
var init = require('../lib/init');
var Const = require("../lib/consts");
var Utils = require("../lib/utils");

var SignInHandler = function(){}
var UserModel = require('../Models/User');

_.extend(SignInHandler.prototype,RequestHandlerBase.prototype);

SignInHandler.prototype.attach = function(router){
        
    var self = this;

    router.post('/',function(request,response){
            
        var userModel = UserModel.get();
            
        var uuid = request.body.uuid;
        var secret = request.body.secret;
        
        if(_.isEmpty(uuid)){

            self.successResponse(response,{
                validationError: "UUID is empty"
            });
                          
        }

        if(_.isEmpty(secret)){

            self.successResponse(response,{
                validationError: "Wrong secret"
            });
                          
        }
        
        var result = {};
        
        async.waterfall([
            function (done) {
                
                userModel.findOne({ 
                    "loginCredentials.UUID": uuid
                },function (err, resultUser){
                    
                    result.user = resultUser;
                    
                    done(err,result)
                });
                
            },
            function(result,done){
            
                if(result.user){
                    done(null,result);
                    return;
                }
                
                // create new user
                var model = new userModel({
                    username:"",
                    email: "",
                    password: "",
                    created: Utils.now(),
                    loginCredentials: {
                        UUID: uuid
                    },
                    token : {
                        token: Utils.getRandomString(32),
                        generated: Utils.now()
                    }
                });

                model.save(function(err,resultSaveUser){
                    
                    result.user = resultSaveUser;
                    done(err,result); 
                
                });
                
            }],
            function(err,result){

                if(err){
                    self.errorResponse(response,Const.httpCodeServerError);  
                    return;
                }
                
                self.successResponse(response,{
                    ok: true,
                    user: result.user,
                    token: result.user.token.token
                });
                    
            }
        );
            
                
        /*
    	userModel.findOne({ 
    	    username: username,
    	    password: password
    	    
        },function (err, user) {
            
            if(!_.isNull(user)){
                
                // generate access token
                var token = Utils.getRandomString(32);
                
                user.update({
                    token: {
                        token: token,
                        generated: Utils.now()
                    }
                },{},function(err,userResult){
                    
                    if(err){
                        self.errorResponse(response,Const.httpCodeServerError);  
                        return;
                    }
                
                    self.successResponse(response,{
                        ok: true,
                        user: user,
                        token: token
                    });
                
                });

                
                return;
            }
            
            self.successResponse(response,{
                ok: false
            });
        
        });
        
        
        */
        
    });
    

}

new SignInHandler().attach(router);
module["exports"] = router;
