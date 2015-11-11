var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var bodyParser = require("body-parser");
var _ = require('lodash');
var async = require('async');
var validator = require('validator');
var fs = require('fs-extra');
var lwip = require('lwip');

var SocketAPIHandler = require('../SocketAPI/SocketAPIHandler');

var RequestHandlerBase = require('./RequestHandlerBase');
var init = require('../lib/init');
var Const = require("../lib/consts");
var Utils = require('../lib/utils');

var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");

var CreateNewConversation = require("./logics/CreateNewConversation");

var NewConversation = function(){};
_.extend(NewConversation.prototype,RequestHandlerBase.prototype);

NewConversation.prototype.attach = function(router){

    var self = this;
    

   /**
     * @api {post} /api/v1/conversation/new New Conversation
     * @apiName Create New Conversation
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription Create new conversation
     * @apiParam {array} users array of users ids.
     * @apiParamExample {json} Request-Example:
        {
            users: [
                "563a0cc46cb168c8e9c4071d",
                "563a0cc46cb168c8e9c4071a",
                "563a0cc46cb168c8e9c4071b"
            ]
        }
     * @apiSuccessExample Success-Response:
    
        {
            success: 1,
            data: {
                ok: true,
                conversation: {
                    __v: 0,
                    owner: '5641c54f638ab66fda70b4a3',
                    name: 'testuM0zD,
                    thename...',
                    created: 1447150928459,
                    _id: '5641c550638ab66fda70b4a6',
                    avatar: {
                        file: 'M59aokbePDbmcXlIoIcYclYkTt6yl4ls',
                        thumb: 'M59aokbePDbmcXlIoIcYclYkTt6yl4ls'
                    },
                    users: [
                        {
                            _id: '5641c54f638ab66fda70b4a0',
                            username: 'testuM0zD',
                            displayName: 'testuM0zDthename',
                            avatar: {
                                file: 'z1BaWE0Yjlycav97i77LWRoKc6EHr3HB',
                                thumb: 'nS0Xl0TukNrBwMYGLzogBaG0uPysRAJF'
                            }
                        },
                        {
                            _id: '5641c54f638ab66fda70b4a1',
                            username: 'testxTnGa',
                            displayName: 'testxTnGathename',
                            avatar: {
                                file: 'Cps909PH2CoRFct9cMPvkVsPBgyY6xE4',
                                thumb: 'n97QaaeQm4WpvWSVdQLxyET3BaUQqaJc'
                            }
                        },
                        {
                            _id: '5641c54f638ab66fda70b4a2',
                            username: 'testTSHVO',
                            displayName: 'testTSHVOthename',
                            avatar: {
                                file: 'WWZm8uW9YUK7yetDSxcrLGl1GtPbzQbZ',
                                thumb: 'BryQSHax3Px8GD711Lb6AqBagpjH0g0J'
                            }
                        },
                        {
                            _id: '5641c54f638ab66fda70b4a3',
                            username: 'testC0Qta',
                            displayName: 'test',
                            avatar: {
                                file: 'q22GxaoSgzJLzLstoI4HkC12AKly42ta',
                                thumb: 'lV0e0DmsUqmr5uPFE9hQ3hdr3rtvoz1Q'
                            }
                        }
                    ]
                }
            }
        }
    */
    
    router.post('/',authenticator,function(request,response){
    
        var logic = new CreateNewConversation();
                
        logic.execute(request.user._id,request.body.users,function(result){
                        
            if(!result){
                self.errorResponse(response,Const.httpCodeServerError);
                
            }else{
                
                // populate with users
                UserModel.getUsersByIdForResponse(result.users,function(resultUsers){
                    
                    result.users = resultUsers;
                    
                    self.successResponse(response,{
                        ok: true,
                        conversation: result
                    });
                    
                    // send socket
                    _.forEach(request.body.users,function(userId){
                        
                        SocketAPIHandler.emitToUser(
                            userId,
                            Const.emitCommandNewConversation,
                            {conversation:result}
                        );
                         
                    });

                    SocketAPIHandler.emitToUser(
                        request.user._id,
                        Const.emitCommandNewConversation,
                        {conversation:result}
                    );
                     
                         
                });

            }
        });

    });

}


new NewConversation().attach(router);
module["exports"] = router;
