var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');

var TestHandler = function(){}

_.extend(TestHandler.prototype,RequestHandlerBase.prototype);

TestHandler.prototype.attach = function(router){
        
    var self = this;

   /**
     * @api {get} /test Test
     * @apiName Test
     * @apiGroup WebAPI
     * @apiDescription Just test
     *     
     * @apiSuccessExample Success-Response:
            test
    */


    router.get('/',function(request,response){
            
        response.send('test');
        
    });

}

new TestHandler().attach(router);
module["exports"] = router;
