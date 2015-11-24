var should = require('should');
var request = require('supertest');
var async = require('async');
var sha1 = require('sha1');

var app = require('../mainTest');

global.getRandomStr = function(){

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}

global.signin = function(cb,params){
    
    if(!params){
        params = {
            username : global.username1,
            password : sha1(global.password1)
        };
    }
        
    request(app)
        .post('/api/v1/user/signin')
        .send(params)
    	.expect('Content-Type', /json/)
    	.expect(200) 
        .end(function (err, res) {
    
    	if (err) {
    		throw err;
    	}
    	
    	if(!res.body.data.token)
    	    throw new Error('invalid login');
    	
        cb(res.body.data.token);
    
    }); 
        
};
    
global.username1 = "test" + getRandomStr();
global.userid1 = "";
global.email1 = "test@test" + getRandomStr() + ".com";
global.password1 = "test" + global.getRandomStr();

global.username2 = "test" + getRandomStr();
global.userid2 = "";
global.email2 = "test@test" + getRandomStr() + ".com";
global.password2 = "test" + global.getRandomStr();

global.username3 = "test" + getRandomStr();
global.userid3 = "";
global.email3 = "test@test" + getRandomStr() + ".com";
global.password3 = "test" + global.getRandomStr();

global.username4 = "test" + getRandomStr();
global.userid4 = "";
global.email4 = "test@test" + getRandomStr() + ".com";
global.password4 = "test" + global.getRandomStr();

before(function(done){
    
    setTimeout(function(){
            
        // create user2,3,4. 1 is created in next test
        async.parallel([
        
            function(callback){
                                
                var params = {
                    username : global.username2,
                    email : global.email2,
                    password : global.password2,
                    passwordConfirm : global.password2
                };
                
                request(app)
                    .post('/api/v1/user/signup')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200) 
                    .end(function (err, res) {
                                            
                    global.userid2 = res.body.data.user._id;
                                      
            		if (err) {
            		    console.log(err);
            			callback(err,null);
            			return;
            		}
                    
                    global.signin(function(token){
                    
                        request(app)
                            .post('/api/v1/user/updateprofile')
                            .set('Access-Token', token)
                    		.expect(200) 
                    		.field('displayName', global.username2 + " thename")
                            .attach('file', 'src/server/test/samplefiles/user2.jpg')
                            .end(function (err, res) {
            
                			if (err) {
                				throw err;
                			}
                			                                                
                            callback(null,null);
                        
                        });   
                        
                    },{username : global.username2,password : sha1(global.password2)});
                
                });   
            
            },
            function(callback){
                
                var params = {
                    username : global.username3,
                    email : global.email3,
                    password : global.password3,
                    passwordConfirm : global.password3
                };
                
                request(app)
                    .post('/api/v1/user/signup')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200) 
                    .end(function (err, res) {
            
            		if (err) {
            			callback(err,null)
            		}

            		global.userid3 = res.body.data.user._id;

            		if (err) {
            			callback(err,null);
            			return;
            		}
                    
                    global.signin(function(token){
                    
                        request(app)
                            .post('/api/v1/user/updateprofile')
                            .set('Access-Token', token)
                    		.expect(200) 
                    		.field('displayName', global.username3 + " thename")
                            .attach('file', 'src/server/test/samplefiles/user3.png')
                            .end(function (err, res) {
            
                			if (err) {
                				throw err;
                			}
                                                
                            callback(null,null);
                        
                        });   
                        
                    },{username : global.username3,password : sha1(global.password3)});
                
                });   
            
            },
            function(callback){
                
                var params = {
                    username : global.username4,
                    email : global.email4,
                    password : global.password4,
                    passwordConfirm : global.password4
                };
                
                request(app)
                    .post('/api/v1/user/signup')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200) 
                    .end(function (err, res) {
                    
            		if (err) {
            			callback(err,null)
            		}

            		global.userid4 = res.body.data.user._id;

            		if (err) {
            			callback(err,null);
            			return;
            		}
                    
                    global.signin(function(token){
                    
                        request(app)
                            .post('/api/v1/user/updateprofile')
                            .set('Access-Token', token)
                    		.expect(200) 
                    		.field('displayName', global.username4 + " thename")
                            .attach('file', 'src/server/test/samplefiles/user4.png')
                            .end(function (err, res) {
            
                			if (err) {
                				throw err;
                			}
                                                
                            callback(null,null);
                        
                        });   
                        
                    },{username : global.username4,password : sha1(global.password4)});                
                });   
            
            }
                
        ], function(err, results){
        
        	if (err) {
        		throw err;
        	}   
        	 
            done();
            
        });
    
    }, 100);
    
});