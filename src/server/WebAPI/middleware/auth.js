var bodyParser = require("body-parser");
var _ = require('lodash');

var Const = require("../../lib/consts");
var UserModel = require('../../Models/User');

function AuthMiddleware (request, response, next) {
        
    var token = request.headers['access-token'];

    if(_.isEmpty(token)){
        
        response.json({
            success : Const.responsecodeError,
            error : {
                code : Const.responsecodeError,
                message : "Invalid Access Token"
            }
        });

    } else {
        
        var userModel = UserModel.get();
        
        userModel.findOne({ 
    	    "token.token": token
        },function (err, user) {
            
            if(!_.isNull(user)){
                
                request.user = user;
                
                next()
                
                return;
                
            } else {
                
                response.json({
                    success : Const.responsecodeError,
                    error : {
                        code : Const.responsecodeError,
                        message : "Invalid Access Token"
                    }
                });
                
            }
        
        });

           
    }
   
}

module["exports"] = AuthMiddleware;

