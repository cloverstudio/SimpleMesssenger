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
                            _id: '563a0e21124f146beadd00a5',
                            owner: '563a0e20124f146beadd00a2',
                            name: 'testm6PO1,thename...',
                            created: 1446645281205,
                            __v: 0,
                            avatar: {
                                file: 'Ry2TshrAK9BnDUV3kXiA4r1ZxVJzhZP2',
                                thumb: 'Ry2TshrAK9BnDUV3kXiA4r1ZxVJzhZP2'
                            },
                            users: [
                                '563a0e20124f146beadd00a2',
                                '563a0e20124f146beadd009f',
                                '563a0e20124f146beadd00a0',
                                '563a0e20124f146beadd00a1'
                            ]
                        },
                        {
                            _id: '563a0e21124f146beadd00a7',
                            owner: '563a0e20124f146beadd00a2',
                            name: 'testm6PO1,thename...',
                            created: 1446645281275,
                            __v: 0,
                            avatar: {
                                file: 'yNolWLu7sewJFyPaYSic5685GdW0OdB1',
                                thumb: 'yNolWLu7sewJFyPaYSic5685GdW0OdB1'
                            },
                            users: [
                                '563a0e20124f146beadd00a2',
                                '563a0e20124f146beadd009f',
                                '563a0e20124f146beadd00a0'
                            ]
                        },
                        ....
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
