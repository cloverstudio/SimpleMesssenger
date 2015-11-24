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

var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");


var UpdateConversationHandler = function(){}

_.extend(UpdateConversationHandler.prototype,RequestHandlerBase.prototype);

UpdateConversationHandler.prototype.attach = function(router){
        
    var self = this;


   /**
     * @api {post} /api/v1/conversaiton/update/[conversationid] Updaet Conversation Profile
     * @apiName Updaet Conversation Proile
     * @apiGroup WebAPI
     * @apiDescription Update profile of conversation
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiParam {string} name Name to display
     * @apiParam {file} file avatar file

     * @apiSuccessExample Success-Response:
            {
                success: 1,
                data: {
                    ok: true
                }
            }
    */
    


    router.post('/:conversationid',authenticator,function(request,response){
        
        var conversationId = request.params.conversationid;
        var conversationModel = ConversationModel.get();

        var form = new formidable.IncomingForm();
        var result = {};
                
        async.waterfall([

            function (done) {
                
            	conversationModel.findOne({_id:conversationId},function(err,conversationFindResult){
	            	
	            	if(!conversationFindResult){
		            	
                        self.successResponse(response,{
	                        ok : false,
                            validationError: "Wrong conversation id"
                        });
		            	
		            	return;
	            	}
	            	
	            	result.targetConversation = conversationFindResult;
	            		            	
	            	done(err,result);
	            	
            	});
            	          
            },
                        
            function (result,done) {
                                
                form.parse(request, function(err, fields, files) {
                

                    // search user
                    
                    result.requestParams = {file:files.file,fields:fields};
                    
                    done(err,result);
                    
                });
                                
            },
                        
            function (result,done){
               	
                // validate
                self.validate(result.requestParams.fields,result.requestParams.file,function(err){
                    
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
                
                result.targetConversation.update({
                    name: result.requestParams.fields.name
                    
                },{},function(err,updateConversationResult){
                    
                    if(err){
                        done(err,result);
                        return;
                    }
                                    
                    done(err,result);
                
                });
                
            },
            
            function (result,done){
                
                if(!result.requestParams.file){
                    done(null,result);
                    return;
                }
                
                // save to upload dir
                var tempPath = result.requestParams.file.path;
                var fileName = result.requestParams.file.name;
                var destPath = init.uploadPath;
                
                var newFileName = Utils.getRandomString(32);                
                result.requestParams.file.newFileName = newFileName;
                

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

                if(!result.requestParams.file){
                    done(null,result);
                    return;
                }
            
                var file = result.requestParams.file;
                
                // generate thumbnail      
                if(file.type.indexOf("jpeg") > -1 ||
                    file.type.indexOf("gif") > -1 ||
                    file.type.indexOf("png") > -1){
                        
                        var thumbFileName = Utils.getRandomString(32); 
                        result.requestParams.file.thumbName = thumbFileName;

                        var destPathTmp = init.uploadPath + thumbFileName;

                        easyimg.thumbnail({
                                src: init.uploadPath + result.requestParams.file.newFileName, 
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
                
                var updateParams = {};
                
                if(result.requestParams.file){
                
                    updateParams.avatar = {
                        file : result.requestParams.file.newFileName,
                        thumb : result.requestParams.file.thumbName
                    };
                    
                }
                                
                if(result.requestParams.fields.description){
                
                    updateParams.description = result.requestParams.fields.description;
                    
                }
                                           
                result.targetConversation.update(updateParams,{},function(err,userResult){
                    
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

UpdateConversationHandler.prototype.validate = function(fields,file,callBack){
    
    async.waterfall([
				
        function (done) {
            
            if(_.isEmpty(fields.name)){
            	done("Wrong  name.",null);
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

new UpdateConversationHandler().attach(router);

module["exports"] = router;
