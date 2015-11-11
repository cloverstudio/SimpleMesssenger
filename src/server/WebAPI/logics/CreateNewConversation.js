var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');
var validator = require('validator');
var fs = require('fs-extra');
var lwip = require('lwip');

var init = require('../../lib/init');
var Const = require("../../lib/consts");
var Utils = require('../../lib/utils');

var UserModel = require('../../Models/User');
var ConversationModel = require('../../Models/Conversation');

var CreateNewConversation = function(){}

CreateNewConversation.prototype.execute = function(ownerUserId,users,useOld,callBack){
    
    var self = this;
    
    var conversationModel = ConversationModel.get();

    // save to database
    var model = new conversationModel({
        owner : ownerUserId,
        users : [],
        name  : "",
        created : Utils.now(),
        avatar : {
            file : "",
            thumb : ""
        }
    });

    try{
                
        model.users.push(ownerUserId);
                    
    } catch(e){
                
        // mostly when user id is invalid
        callBack(false);
        return;
        
    }

    var result = {};

    console.log('users ',users);

    async.waterfall([
        
        function (done){
        
            // search users by id
            var userModel = UserModel.get();
            
            userModel.find({
            
                _id:{$in:users},
                
            },function(err,resultUsers){
                
                console.log('resultUser by user id',resultUsers);

                _.forEach(resultUsers,function(resultUser){
                    
                     model.users.push(resultUser._id);
                                          
                });              

                // ignore cast error
                done(null,result);

            });        
              
        },
        
        function (result,done){
        
            // search users by telephone number
            var userModel = UserModel.get();
            
            userModel.find({
            
                telNumber:{$in:users},
                
            },function(err,resultUsers){
                
                _.forEach(resultUsers,function(resultUser){
                    
                    model.users.push(resultUser._id);
                                          
                });              

                 done(err,result);

            });        
              
        },
        function (result,done) {
            
            if(useOld){
                                
                var conversationModel = ConversationModel.get();
                                
                conversationModel.findOne( { users :{ $all : model.users } },function(error,resultExistingConversation){
                    
                    console.log(resultExistingConversation);
                    
                    // ignore useOld if the conversation doesnt exist
                    if(resultExistingConversation)
                        callBack(resultExistingConversation.toObject());
                    else
                        done(null,result);
                        
                });
                                
            }else{
                done(null,result);
            }

        },
        function (result,done) {

            self.generateConversationName(model.users,function(theName){

                model.name = theName;

                done(null,result);

            });

        },
        
        function (result,done){

            self.generateAvatar(model.users,function(avatarData){
                
                if(avatarData){
                    model.avatar.thumb = avatarData.thumb;
                    model.avatar.file = avatarData.file;                        
                }

                done(null,result);

            });
        },
        
        function (result,done){

            model.save(function(err,conversationModelResult){
                done(err,conversationModelResult.toObject())
            });

        }

    ],
        function (err, result) {

            if(err){
                console.log(err);
                callBack(false);
                return;
            }
            
            callBack(result);

    });


}

CreateNewConversation.prototype.generateConversationName = function(userIds,callBack){

    var theName = "";

    UserModel.getUsersById(userIds,function(result){

        _.forEach(result,function(user){

            if(!_.isEmpty(user.displayName)){
                
                var fistName = user.displayName.split(" ");
                
                theName += fistName + ",";

            }

        });

        theName = theName.substring(0,theName.length - 1);

        if(callBack)
            callBack(Utils.shorten(theName));

    });

}

CreateNewConversation.prototype.generateAvatar = function(userIds,callBack){

    var validFileIds = [];
    var asyncResult = {};
    
    async.waterfall([

        function (done) {
                        
            // generate fileids of valid thumbnail
            UserModel.getUsersById(userIds,function(users){
                                
                // get valid file ids
                async.each(users, function(user,doneEach){
                    
                    if(_.isEmpty(user.avatar) || _.isEmpty(user.avatar.thumb)){
                        doneEach(null);
                        return;
                    }
                                        
                    var filePath = init.uploadPath + user.avatar.thumb;
                                        
                    fs.exists(filePath, function (exists) {
                                                
                        if(exists)
                            validFileIds.push(user.avatar.thumb);
                        
                        doneEach(null);
                        
                    });
                    
                }, function(err){
                    
                    asyncResult.validFileIds = validFileIds;
                    
                    done(err,asyncResult);
                     
                });
                
            });

        },
        
        function (asyncResult,done){
                        
            if(!asyncResult.validFileIds || 
                asyncResult.validFileIds.length == 0){
                done("no file",null);
                return;
            }
            
            var imagesToPaste = [];
            
            lwip.create(Const.thumbSize, Const.thumbSize, 'white', function(err, baseImage){
                
                async.each(asyncResult.validFileIds, function(fileId,doneEach){

                    fs.readFile(init.uploadPath + fileId, function(err, buffer){
                                                
                        lwip.open(buffer, 'png', function(err, image){
                            
                            if(err)
                                console.log(err);
                                
                            if(image)
                                imagesToPaste.push(image);
                                
                            doneEach(null);
                            
                        });
                        
                    });
            
                }, function(err){
                    
                    asyncResult.baseImage = baseImage;
                    asyncResult.imagesToPaste = imagesToPaste;
                                        
                    done(err,asyncResult);
                     
                });

            });      

        },

        // pust all pics together
        function (asyncResult,done){
            
            if(asyncResult.imagesToPaste.length == 0){
                done("no file",null);
                return;
            }
            
            if(asyncResult.imagesToPaste.length == 1){
                
                asyncResult.baseImage.paste(0, 0, asyncResult.imagesToPaste[0], function(){
                    
                    done(null,asyncResult);
                    
                });
                
            }
            
            if(asyncResult.imagesToPaste.length == 2){
                
                asyncResult.baseImage.paste(0, 0, asyncResult.imagesToPaste[0], function(){
                    
                    asyncResult.imagesToPaste[1].crop(0, 0, Const.thumbSize / 2 - 3, Const.thumbSize - 1, function(err,secondImage){
                        
                        if(err){
                            done(err,asyncResult);
                            return;
                            
                        }

                        asyncResult.baseImage.paste(Const.thumbSize / 2 + 2, 0, secondImage, function(){
                            
                            
                            done(null,asyncResult);
                            
                        }); 
                        
                    });
                    
                });
                
            }
            
            if(asyncResult.imagesToPaste.length == 3){
            
                asyncResult.baseImage.paste(0, 0, asyncResult.imagesToPaste[0], function(){
                    
                    asyncResult.imagesToPaste[1].resize(Const.thumbSize / 2 - 3, Const.thumbSize / 2 - 3, function(err,secondImage){
                        
                        if(err){
                            done(err,asyncResult);
                            return;
                            
                        }

                        asyncResult.imagesToPaste[2].resize(Const.thumbSize / 2 - 3, Const.thumbSize / 2 - 3, function(err,thirdImage){
                            
                            if(err){
                                done(err,asyncResult);
                                return;
                                
                            }
                            
                            asyncResult.baseImage.paste(0, Const.thumbSize / 2 + 2, secondImage, function(){
                                
                                asyncResult.baseImage.paste(Const.thumbSize / 2 + 2, Const.thumbSize / 2 + 2, thirdImage, function(){
                                    
                                    done(null,asyncResult);
                                    
                                }); 
                                
                            }); 
                            
                        });
                    
                    });
                    
                });
            
            }
            
            if(asyncResult.imagesToPaste.length >= 4){
            
                asyncResult.imagesToPaste[0].resize(Const.thumbSize / 2 - 3, Const.thumbSize / 2 - 3, function(err,firstImage){
                    
                    if(err){
                        done(err,asyncResult);
                        return;
                        
                    }

                    asyncResult.imagesToPaste[1].resize(Const.thumbSize / 2 - 3, Const.thumbSize / 2 - 3, function(err,secondImage){
                        
                        if(err){
                            done(err,asyncResult);
                            return;
                            
                        }

                        asyncResult.imagesToPaste[2].resize(Const.thumbSize / 2 - 3, Const.thumbSize / 2 - 3, function(err,thirdImage){
                            
                            if(err){
                                done(err,asyncResult);
                                return;
                                
                            }

                            asyncResult.imagesToPaste[3].resize(Const.thumbSize / 2 - 3, Const.thumbSize / 2 - 3, function(err,forthImage){
                                
                                if(err){
                                    done(err,asyncResult);
                                    return;
                                    
                                }
                                
                                asyncResult.baseImage.paste(0, 0, firstImage, function(){
                                    
                                    asyncResult.baseImage.paste(Const.thumbSize / 2 + 2, 0, secondImage, function(){
                                        
                                        asyncResult.baseImage.paste(0, Const.thumbSize / 2 + 2, thirdImage, function(){
                                            
                                            asyncResult.baseImage.paste(Const.thumbSize / 2 + 2, Const.thumbSize / 2 + 2, forthImage, function(){
                                                
                                                done(null,asyncResult);
                                                
                                            }); 
                                            
                                        }); 
                                        
                                    }); 
                                    
                                }); 
                                
                            });
                        
                        });
                        
                    });
                
                });
        
            }

        },
        
        // save to file and finish
        function (asyncResult,done){
            
            var fileName = Utils.getRandomString(32);
            
            asyncResult.baseImage.toBuffer("png", function(err,buffer){
                
                fs.writeFile(init.uploadPath + fileName, buffer, "binary", function(err) {
                    
                    asyncResult.fileId = fileName;
                    done(err,asyncResult);

                });
                
            });

        },
        
    ],
        function (err, asyncResult) {
            
            if(err){
                console.log(err);
                callBack(null);
                return;
            }
                
            callBack({
                file: asyncResult.fileId,
                thumb: asyncResult.fileId
            });

    });

}


module["exports"] = CreateNewConversation;
