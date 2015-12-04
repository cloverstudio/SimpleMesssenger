var bodyParser = require("body-parser");
var path = require('path');
var _ = require('lodash');

var Const = require("../lib/consts");
var Config = require("../lib/init");

var RequestHandlerBase = function(){
    
}

RequestHandlerBase.prototype.urlMiddle = '/api/v1';

RequestHandlerBase.prototype.path = function(path){
    
    return Config.urlPrefix + this.urlMiddle + path;
    
}

RequestHandlerBase.prototype.errorResponse = function(
        response,
        httpCode){

    response.status(httpCode);
    response.send("");
}

RequestHandlerBase.prototype.successResponse = function(response,code,data){
    
    response.status(Const.httpCodeSucceed);
    
    if(code != Const.responsecodeSucceed){
        
        response.json({
            code : code
        });
        
    } else {

        response.json({
            code : Const.responsecodeSucceed,
            data : data
        });
    
    }

    
}

module["exports"] = RequestHandlerBase;