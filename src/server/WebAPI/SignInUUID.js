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

   /**
     * @api {post} /user/signin/UUID SignIn with UUID
     * @apiName Sign in with UUID
     * @apiGroup WebAPI
     * @apiDescription Login to the system and get api token with UUID and secret

     * @apiParam {string} uuid UUID
     * @apiParam {string} secret Secret Secret should be md5(yyyymmddhhmmss + password)
     * @apiParam {string} name display name
     * @apiParam {object} device device info shoul be {pushToken:"jadsflajfčlajdf",deviceType:"ios",appVersion:"1.0.1"}
     * @apiParamExample {json} Request-Example:
            {
                uuid: "blablabla",
                secret: "blablabla",
                name: "blablabla",
                device: {
                    pushToken: "asdfjasdfasdfasdf12321ewedasd",
                    deviceType: "android", // android or ios
                    appVersion: "1.0.1"
                }
            }

     * @apiSuccessExample Success-Response:
            {
                success: 1,
                data: {
                    ok: true,
                    user: {
                        __v: 0,
                        username: '',
                        displayName: 'name',
                        email: '',
                        password: '',
                        created: 1446643669338,
                        _id: '563a07d56c486242e73cdc13',
                        loginCredentials: [
                            Object
                        ],
                        token: [
                            Object
                        ]
                    },
                    token: 'F1p2IJzRab4C7B46lQ6t83fDfcTZlHRK'
                }
            }
    */
    
    router.post('/',function(request,response){
            
        var userModel = UserModel.get();
        
        var uuid = request.body.uuid;
        var secret = request.body.secret;
        var name = request.body.name;
        
        if(_.isEmpty(uuid)){

            self.successResponse(response,{
                ok : false,
                validationError: "UUID is empty"
            });
            
            return;
                          
        }

        if(_.isEmpty(secret)){

            self.successResponse(response,{
                ok : false,
                validationError: "Wrong secret"
            });
            
            return;
                          
        }
        
        var secretPassed = false;
        
        // check secret
        for(i = -10 ; i < 10 ; i++){
            
            var time = Utils.now() + i * 1000;            
            var secretGenerated = Utils.generateSecret(time);
            
            if(secretGenerated == secret)
                secretPassed = true;
                            
        }
        
        
        if(!secretPassed){
            self.successResponse(response,{
                ok : false,
                validationError: "Wrong secret"
            });
            return;
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
                    
                    var token = Utils.getRandomString(32);
                    
                    result.user.update({
                        displayName: name,
                        token: {
                            token: token,
                            generated: Utils.now()
                        }
                    },{},function(err,userResult){
                        
                        result.user.displayName = name;
                        done(null,result);

                    });
                    
                    return;
                }
                
                // create new user
                var model = new userModel({
                    username:"",
                    displayName: name,
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
