var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');
var UserModel = require('../Models/User');
var authenticator = require("./middleware/auth");

var SearchHandler = function(){}

_.extend(SearchHandler.prototype,RequestHandlerBase.prototype);

SearchHandler.prototype.attach = function(router){
        
    var self = this;

   /**
     * @api {get} /api/v1/search/user/[keyword] Search User
     * @apiName Search User
     * @apiGroup WebAPI
     * @apiHeader {String} Access-Token Users unique access-token.
     * @apiDescription Search user by given keyword
     * @apiParam {string} keyword the keyword

     * @apiSuccessExample Success-Response:
        {
            success: 1,
            data: {
                ok: true,
                users: [
                    {
                        _id: '56360099f28a47ad2561be96',
                        username: 'test3jMGK',
                        email: 'test@testQtHHc.com',
                        password: 'eaa0a8f04e4382fbe239ce574c19ff90a490a5d5',
                        created: 1446379673508,
                        __v: 0,
                        displayName: 'test3jMGKthename',
                        avatar: {
                            file: 'KvkfjmWME2qpzjxlgYgImp4EoxDFBZKZ',
                            thumb: 'beLchoMlqnkYmZmpcp0qPkhFFVe2tuyy'
                        }
                    },
                    {
                        _id: '56360099f28a47ad2561be97',
                        username: 'testHJrQJ',
                        email: 'test@testjX8ht.com',
                        password: 'e34e6c3eb2969b535e94882a53b83b3c0267e933',
                        created: 1446379673526,
                        __v: 0,
                        displayName: 'testHJrQJthename',
                        avatar: {
                            file: '4cBfMNNQJE3kLJimfOmUQhIQiU1sjbOY',
                            thumb: 'iMItlUCtXC2WSFyEHQBBbVRCimNB1XcZ'
                        }
                    },
                    {
                        _id: '56360099f28a47ad2561be98',
                        username: 'testemUve',
                        email: 'test@testE7ho3.com',
                        ...
                    },
                    ....
                ]
            }
        }
    */
    

    router.get('',authenticator,function(request,response){
    
        var keyword = '';
        
        self.doSearch(keyword,function(result){
            
            self.successResponse(response,{
                ok: true,
                users: result
            });
            
        });
        
    });

    
    router.get('/:keyword',authenticator,function(request,response){
        
        var keyword = request.params.keyword;
        
        self.doSearch(keyword,function(result){
            
            self.successResponse(response,{
                ok: true,
                users: result
            });
            
        });
        
    });

}

SearchHandler.prototype.doSearch = function(keyword,callBack){

    var userModel = UserModel.get();
        
	userModel.find({ 
	    displayName : new RegExp(keyword, "i")
    },function (err, users) {
    
        if(callBack)
            callBack(users);
    
    });
    
}

new SearchHandler().attach(router);
module["exports"] = router;
