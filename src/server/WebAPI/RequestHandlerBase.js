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
        httpCode,
        errorCode,
        reason,
        retry){

    response.status(httpCode);
    
    response.json({
        success : Const.responsecodeError,
        error : {
            code : errorCode,
            message : reason,
            retry : retry
        }
    });
    
}

RequestHandlerBase.prototype.successResponse = function(response,data){

    response.status(Const.httpCodeSucceed);
    response.json({
        success : Const.responsecodeSucceed,
        result : data
    });
    
}

module["exports"] = RequestHandlerBase;