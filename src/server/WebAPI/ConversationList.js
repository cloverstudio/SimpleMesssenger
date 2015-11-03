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
