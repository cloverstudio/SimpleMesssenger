var should = require('should');
var request = require('supertest');
var app = require('../mainTest');
var sha1 = require('sha1');

var Utils = require('../lib/utils');


describe('WEB User', function () {
    
    var username2 = "test" + global.getRandomStr() + 2;
    var email2 = "test@test" + global.getRandomStr() + "2.com";

    var wrongEmail = "badbad";

    var params1 = {
        username : global.username1,
        email : global.email1,
        password : global.password1,
        passwordConfirm : global.password1
    };

    describe('/user/signup GET', function () {
    
        it('Can signup', function (done) {
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			    			
                res.body.should.have.property('code');
                res.body.code.should.equal(1);
                res.body.should.have.property('data');
                
                global.userid1 = res.body.data.user._id;
                
                done();
            
            });   
            
        });
        
        it('Duplicate username', function (done) {
            
            params1.username = global.username1;
            params1.email = "test@test" + global.getRandomStr() + ".com";
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
  
                res.body.should.have.property('code');
                res.body.code.should.equal(20000004);

                done();
            
            });   
            
        });  

        it('Duplicate email', function (done) {
            
            params1.username = "test" + getRandomStr();
            params1.email = global.email1;
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
                
                res.body.should.have.property('code');
                res.body.code.should.equal(20000005);
                
                done();
            
            });   
            
        });

        it('Wrong email', function (done) {
            
            params1.username = "test" + getRandomStr();
            params1.email = wrongEmail;
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000002);
                
                done();
            
            });   
            
        }); 

        it('Wrong username ( length ) ', function (done) {
            
            params1.username = getRandomStr();
            params1.email = "test@test" + getRandomStr() + ".com";
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000001);
                
                done();
            
            });   
            
        }); 

        it('Wrong username ( alpha numerical )', function (done) {
            
            params1.username = "------";
            params1.email = "test@test" + getRandomStr() + ".com";
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000001);
                
                done();
            
            });   
            
        }); 
        
        it('Wrong password ( length )', function (done) {
            
            params1.username = "teset" + getRandomStr();
            params1.email = "test@test" + getRandomStr() + ".com";
            params1.password = "a";
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000003);
                
                done();
            
            });   
            
        }); 
        
        it('Wrong password ( alpha numerical  )', function (done) {
            
            params1.username = "teset" + getRandomStr();
            params1.email = "test@test" + getRandomStr() + ".com";
            params1.password = "------";
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000003);
                
                done();
            
            });   
            
        }); 
        
        it('Wrong password ( not same )', function (done) {
            
            params1.username = "teset" + getRandomStr();
            params1.email = "test@test" + getRandomStr() + ".com";
            params1.password = "test" + getRandomStr();
            params1.passwordConfirm = "test" + getRandomStr();
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000003);
                
                done();
            
            });   
            
        });     
      
    });
    
    describe('/user/signin POST', function () {
        
        it('Can signin', function (done) {
            
            var paramsLogin = {
                username : global.username1,
                password : sha1(global.password1)
            };
                        
            request(app)
                .post('/api/v1/user/signin')
                .send(paramsLogin)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    		
                res.body.should.have.property('code');
                res.body.code.should.equal(1);
                res.body.should.have.property('data');
                res.body.data.should.have.property('token');

                done();
            
            });   
            
        });
        
    });

    describe('/user/signin/UUID POST', function () {
        
        var uuid = Utils.getRandomString(32);
        var theUserId = "";
        
        it('Can signin with new uuid', function (done) {
                        
            var paramsLogin = {
                uuid : uuid,
                secret : Utils.generateSecret(Utils.now()),
                name : 'test',
                telNumber : 'gdasdfasdfas',
                additionalInfo : {
                    test : 'tset',
                    aaaa : 'assss'
                }
            };
                        
            request(app)
                .post('/api/v1/user/signin/uuid')
                .send(paramsLogin)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
                         
                res.body.should.have.property('code');
                res.body.code.should.equal(1);
                res.body.should.have.property('data');
                res.body.data.should.have.property('token');
                
                theUserId = res.body.data.user._id;
                
                done();
            
            });   
            
        });

        it('Can signin with existing uuid', function (done) {
                        
            var paramsLogin = {
                uuid : uuid,
                secret : Utils.generateSecret(Utils.now()),
                name : 'test2',
                telNumber : 'gdasdfasdfas'

            };
                        
            request(app)
                .post('/api/v1/user/signin/uuid')
                .send(paramsLogin)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
                             
                res.body.should.have.property('code');
                res.body.code.should.equal(1);
                res.body.should.have.property('data');
                res.body.data.should.have.property('token');
                res.body.data.user._id.should.equal(theUserId);

                done();
            
            });   
            
        });

        it('Cant signin with wrong secret', function (done) {
                        
            var paramsLogin = {
                uuid : uuid,
                telNumber : "0123456789",
                secret : "its wrong"
            };
                        
            request(app)
                .post('/api/v1/user/signin/uuid')
                .send(paramsLogin)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
                
                res.body.should.have.property('code');
                res.body.code.should.equal(20000008);

                done();
            
            });   
            
        });

    });

    describe('/user/updateprofile POST', function () {

         it('Update profile with picture works', function (done) {
    	
            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/updateprofile')
                    .set('Access-Token', token)
            		.expect(200) 
            		.field('displayName', 'test')
                    .attach('file', 'src/server/test/samplefiles/max.jpg')
                    .end(function (err, res) {
    
        			if (err) {
        				throw err;
        			}

                    res.body.should.have.property('code');
                    res.body.code.should.equal(1);

                    done();
                
                });                   
                
            });
            
        });

         it('Update profile without picture works', function (done) {
    	
            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/updateprofile')
                    .set('Access-Token', token)
            		.expect(200) 
            		.field('displayName', 'test')
                    .end(function (err, res) {
    
        			if (err) {
        				throw err;
        			}
                                        
                    res.body.should.have.property('code');
                    res.body.code.should.equal(1);
                    
                    done();
                
                });                   
                
            });
            
        });

         it('Fails if display name is empty', function (done) {
    	
            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/updateprofile')
                    .set('Access-Token', token)
            		.expect(200) 
            		.field('displayName', '')
                    .attach('file', 'src/server/test/samplefiles/max.jpg')
                    .end(function (err, res) {
    
        			if (err) {
        				throw err;
        			}
                    
                    res.body.should.have.property('code');
                    res.body.code.should.equal(20000010);

                    done();
                
                });                   
                
            });
            
        });



         it('Fails if file is not image', function (done) {
    	
            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/updateprofile')
                    .set('Access-Token', token)
            		.expect(200) 
            		.field('displayName', 'test')
                    .attach('file', 'src/server/test/samplefiles/test.text')
                    .end(function (err, res) {
    
        			if (err) {
        				throw err;
        			}
                    
                    res.body.should.have.property('code');
                    res.body.code.should.equal(20000011);

                    done();
                
                });                   
                
            });
            
        });
                                      
    });


    describe('/user/changepassword POST', function () {
        
        var newPassword = "yumiko";

        it('No access token', function (done) {

            var params = {
                currentPassword : 'hoge',
                newPassword : newPassword           
            };

            request(app)
                .post('/api/v1/user/changepassword')
        		.send(params)
        		.expect(403) 
                .end(function (err, res) {
        
        		if (err) {
        			throw err;
        		}
        
                done();
            
            });                   
                
        });
        
        it('Wrong current password', function (done) {

            var params = {
                currentPassword : 'hoge',
                newPassword : newPassword           
            };

            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/changepassword')
                    .set('Access-Token', token)
            		.send(params)
            		.expect(200) 
                    .end(function (err, res) {
            
            		if (err) {
            			throw err;
            		}
                                        
                    res.body.should.have.property('code');
                    res.body.code.should.equal(20000012);
            
                    done();
                
                });                   
                
            });
        
        });
    
        it('Wrong new password', function (done) {

            var params = {
                currentPassword : sha1(global.password1),
                newPassword : "dd"           
            };

            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/changepassword')
                    .set('Access-Token', token)
            		.send(params)
            		.expect(200) 
                    .end(function (err, res) {
            
            		if (err) {
            			throw err;
            		}
                                        
                    res.body.should.have.property('code');
                    res.body.code.should.equal(20000013);
            
                    done();
                
                });                   
                
            });
        
        });
        
        it('Change password works', function (done) {

            var params = {
                currentPassword : sha1(global.password1),
                newPassword : newPassword           
            };
        
            global. signin(function(token){
                  
                request(app)
                    .post('/api/v1/user/changepassword')
                    .set('Access-Token', token)
            		.send(params)
            		.expect(200) 
                    .end(function (err, res) {
            
            		if (err) {
            			throw err;
            		}
                    
                    // password is chaged here
                    global.password1 =  newPassword;
                            
                    res.body.should.have.property('code');
                    res.body.code.should.equal(1);
                    
                    done();
                
                });                   
                
            });
        
        });
                                       
    });


    describe('/user/resetpassword GET', function () {
        
        it('Can reset password', function (done) {
            
            // create new user
            var params1 = {
                username : username2,
                email : email2,
                password : global.password1,
                passwordConfirm : global.password1
            };
            
            request(app)
                .post('/api/v1/user/signup')
                .send(params1)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			

                var params2 = {
                    email : email2
                };

                request(app)
                    .post('/api/v1/user/resetpassword')
                    .send(params2)
            		.expect('Content-Type', /json/)
            		.expect(200) 
                    .end(function (err, res) {
    
        			if (err) {
        				throw err;
        			}
        			
                    res.body.should.have.property('code');
                    res.body.code.should.equal(1);
    
                    done();
                
                });   
            
            
            });   

        });

        it('Wrong email ', function (done) {
            
            var params2 = {
                email : "testaaaaa@test.com"
            };
            
            request(app)
                .post('/api/v1/user/resetpassword')
                .send(params2)
        		.expect('Content-Type', /json/)
        		.expect(200) 
                .end(function (err, res) {

    			if (err) {
    				throw err;
    			}
    			
                res.body.should.have.property('code');
                res.body.code.should.equal(20000014);

                done();
            
            });   
            
        });
         
    });
        
        
});