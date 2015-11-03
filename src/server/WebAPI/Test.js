var express = require('express');
var router = express.Router();
var _ = require('lodash');


var RequestHandlerBase = require('./RequestHandlerBase');

var TestHandler = function(){}

_.extend(TestHandler.prototype,RequestHandlerBase.prototype);

TestHandler.prototype.attach = function(router){
        
    var self = this;

    router.get('/',function(request,response){
            
        response.send('test');
        
    });

}

new TestHandler().attach(router);
module["exports"] = router;
