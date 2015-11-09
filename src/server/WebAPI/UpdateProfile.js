var express = require('express');
var router = express.Router();
var validator = require('validator');
var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');
var formidable = require('formidable');
var fs = require('fs-extra');
var easyimg = require('easyimage');

var RequestHandlerBase = require('./RequestHandlerBase');
var init = require('../lib/init');
var Utils = require('../lib/utils');
var Const = require("../lib/consts");

var UpdateProfileHandler = function(){}
var UserModel = require('../Models/User');
var authenticator = require("./middleware/auth");



_.extend(UpdateProfileHandler.prototype,RequestHandlerBase.prototype);

UpdateProfileHandler.prototype.attach = function(router){
        
    var self = this;


   /**
     * @api {post} /api/v1/user/updateprofile Updaet Profile
     * @apiName Updaet Proile
     * @apiGroup WebAPI
     * @apiDescription Update profile of request user
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiParam {string} displayName Name to display
     * @apiParam {file} file avatar file

     * @apiSuccessExample Success-Response:
            {
                success: 1,
                data: {
                    ok: true
                }
            }
    */
    


    router.post('/',authenticator,function(request,response){
                
        var form = new formidable.IncomingForm();
                
        async.waterfall([
            
            function (done) {
                
                form.parse(request, function(err, fields, files) {
                    
                    // search user
                    done(err,{file:files.file,fields:fields});
                    
                });
                                
            },
                        
            function (result,done){
                
                // validate
                self.validate(result.fields,result.file,function(err){
                    
                    if(err){
                                                
                        self.successResponse(response,{
                            validationError: err
                        });
                                                
                    } else {
                        
                        done(err,result);
                        
                    }
                    
                });
                                
            },
                        
            function (result,done){
                                
                // save display name
                var user = request.user;
                
                user.update({
                    displayName: result.fields.displayName
                    
                },{},function(err,userResult){
                    
                    if(err){
                        done(err,result);
                        return;
                    }
                                    
                    done(err,result);
                
                });
                
            },
            
            function (result,done){
                
                if(!result.file){
                    done(null,result);
                    return;
                }
                
                // save to upload dir
                var tempPath = result.file.path;
                var fileName = result.file.name;
                var destPath = init.uploadPath;
                
                var newFileName = Utils.getRandomString(32);                
                result.file.newFileName = newFileName;
                

                fs.copy(tempPath, destPath + newFileName, function(err) {

                    easyimg.convert({src: destPath + newFileName, dst: destPath + newFileName + ".png", quality:100}).then(function (file) {

                        fs.rename( destPath + newFileName + ".png", 
                             destPath + newFileName, function(err) {
                            
                            done(err,result);
                            
                        });
                                                        
                    });
                
                });
                    
            },
            function (result,done){

                if(!result.file){
                    done(null,result);
                    return;
                }
            
                var file = result.file;
                
                // generate thumbnail      
                if(file.type.indexOf("jpeg") > -1 ||
                    file.type.indexOf("gif") > -1 ||
                    file.type.indexOf("png") > -1){
                        
                        var thumbFileName = Utils.getRandomString(32); 
                        result.file.thumbName = thumbFileName;

                        var destPathTmp = init.uploadPath + thumbFileName;

                        easyimg.thumbnail({
                                src: init.uploadPath + result.file.newFileName, 
                                dst:destPathTmp + ".png",
                                width:Const.thumbSize, height:Const.thumbSize
                            }).then(
                            
                            function(image) {
                                
                                fs.rename(destPathTmp + ".png", 
                                    destPathTmp, function(err) {
                                    
                                    done(err,result);
                                    
                                });
                                

                            },
                            function (err) {
                            
                                // ignore thubmnail error
                                console.log(err);
                                done(null,result);
                            }
                            
                        );
                    
                } else {
                    
                    done(null,result);
                    
                }
                
            },
            
            function (result,done){

                if(!result.file){
                    done(null,result);
                    return;
                }
                       
                // save avatar name
                var user = request.user;
                
                user.update({
                    avatar: {
                        file : result.file.newFileName,
                        thumb : result.file.thumbName
                    }
                },{},function(err,userResult){
                    
                    if(err){
                        done(err,result);
                        return;
                    }
                
                    done(err,result);
                
                });
                
            }
            
        ],
            function (err, result) {
                
                if(err){
                    
                    self.errorResponse(response,Const.httpCodeServerError);   
                                     
                }else {
                
                    self.successResponse(response,{
                        ok : true
                    });
                       
                }
                             
            }
            
        );
        
    });

}

UpdateProfileHandler.prototype.validate = function(fields,file,callBack){
    
    async.waterfall([
				
        function (done) {
            
            if(_.isEmpty(fields.displayName)){
            	done("Wrong display name.",null);
            	return;
            }
            
            if(file){
                if(file.type.indexOf("jpeg") == -1 &&
                    file.type.indexOf("gif") == -1 &&
                    file.type.indexOf("png") == -1){
                    
                	done("Wrong file type.",null);
                	return;
                }                
            }

            
            done(null,null);

            
        }],
        
        function (err, result) {
            
            callBack(err);            
                         
        }
        
    );
    
}

new UpdateProfileHandler().attach(router);

module["exports"] = router;
