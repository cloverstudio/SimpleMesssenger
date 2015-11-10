var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var ConversationModel = require('../Models/Conversation');
var authenticator = require("./middleware/auth");

var ConversationList = function(){}

_.extend(ConversationList.prototype,RequestHandlerBase.prototype);

ConversationList.prototype.attach = function(router){

    var self = this;

   /**
     * @api {get} /api/v1/conversation/list Conversation List
     * @apiName Get conversation list
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription get conversation list of the user

     * @apiSuccessExample Success-Response:
        {
            success: 1,
            data: {
                ok: true,
                conversations: [
                    {
                        _id: '5641c3d79f4b2046d93b5a42',
                        owner: '5641c3d69f4b2046d93b5a3f',
                        name: 'test4sdk8,
                        thename...',
                        created: 1447150551100,
                        __v: 0,
                        avatar: {
                            file: 'p1u9buZInbGEQTbDWtrMSRM2CWHsgsDM',
                            thumb: 'p1u9buZInbGEQTbDWtrMSRM2CWHsgsDM'
                        },
                        users: [
                            {
                                _id: '5641c3d69f4b2046d93b5a3c',
                                username: 'test4sdk8',
                                displayName: 'test4sdk8thename',
                                avatar: {
                                    file: 'xTWCNxNjq5IAO2ALmBxjkaDFNBqBCdAv',
                                    thumb: 'Z2jKvhqxokPe7z33o9Ux7jeeglotcURX'
                                }
                            },
                            {
                                _id: '5641c3d69f4b2046d93b5a3d',
                                username: 'test4LrIi',
                                displayName: 'test4LrIithename',
                                avatar: {
                                    file: 'Pnp3n9IBHVdEh4iMlFQAvUANXN9dMma0',
                                    thumb: 'lNMinwxm51LqDSK9XI2rRQz3xiymD4dX'
                                }
                            },
                            {
                                _id: '5641c3d69f4b2046d93b5a3e',
                                username: 'testbvnfv',
                                displayName: 'testbvnfvthename',
                                avatar: {
                                    file: 'kKrflPpml8Icxbeh6BnTYzT9CuVTRiM7',
                                    thumb: 'FatDnbAfqLFCOLg8cDdgJHxsf5a5rnQ4'
                                }
                            },
                            {
                                _id: '5641c3d69f4b2046d93b5a3f',
                                username: 'testYh5cg',
                                displayName: 'test',
                                avatar: {
                                    file: 'bDkks1i8BysmcTVtoJdyhD8TifKWbCqk',
                                    thumb: 'TF4fcIuwZNEBquQCVjhF4Ma58g2Ft73S'
                                }
                            }
                        ]
                    },
                    {
                        _id: '5641c3d79f4b2046d93b5a44',
                        owner: '5641c3d69f4b2046d93b5a3f',
                        name: 'test4sdk8,
                        thename...',
                        created: 1447150551160,
                        __v: 0,
                        avatar: {
                            file: 'LUl7k4vOPxc0DrGq9UjM5zqX1sVWtC6U',
                            thumb: 'LUl7k4vOPxc0DrGq9UjM5zqX1sVWtC6U'
                        },
                        users: [
                            {
                                _id: '5641c3d69f4b2046d93b5a3c',
                                username: 'test4sdk8',
                                displayName: 'test4sdk8thename',
                                avatar: {
                                    file: 'xTWCNxNjq5IAO2ALmBxjkaDFNBqBCdAv',
                                    thumb: 'Z2jKvhqxokPe7z33o9Ux7jeeglotcURX'
                                }
                            },
                            {
                                _id: '5641c3d69f4b2046d93b5a3d',
                                username: 'test4LrIi',
                                displayName: 'test4LrIithename',
                                avatar: {
                                    file: 'Pnp3n9IBHVdEh4iMlFQAvUANXN9dMma0',
                                    thumb: 'lNMinwxm51LqDSK9XI2rRQz3xiymD4dX'
                                }
                            },
                            {
                                _id: '5641c3d69f4b2046d93b5a3f',
                                username: 'testYh5cg',
                                displayName: 'test',
                                avatar: {
                                    file: 'bDkks1i8BysmcTVtoJdyhD8TifKWbCqk',
                                    thumb: 'TF4fcIuwZNEBquQCVjhF4Ma58g2Ft73S'
                                }
                            }
                        ]
                    }
                ]
            }
        }  
    */
    
    router.get('',authenticator,function(request,response){

        var keyword = '';
        var userId = request.user.get("id");

        ConversationModel.getConversationListByUserId(userId,function(result){            
            
            self.successResponse(response,{
                ok: true,
                conversations: result
            });

        });

    });

}

new ConversationList().attach(router);
module["exports"] = router;
