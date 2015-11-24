
var should = require('should');
var request = require('supertest');
var app = require('../mainTest');
var util = require('util');

describe('WEB Conversation', function () {

    describe('/conversation/new POST', function () {

        it('Can create new conversation', function (done) {

            signin(function(token){

                var params = {
                    
                    name : "test",
                    users : [
                        global.userid2,
                        global.userid3,
                        global.userid4
                    ]

                };

                request(app)
                    .post('/api/v1/conversation/new')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

            			if (err) {
            				throw err;
            			}
                                            
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');
                    res.body.data.ok.should.equal(true);

                    done();

                });

            });

        });

        it('User id can be anything', function (done) {

            signin(function(token){

                var params = {

                    users : [
                        "hugahuhu",
                        global.userid3,
                        global.userid4
                    ]

                };

                request(app)
                    .post('/api/v1/conversation/new')
                    .send(params)
            		.expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

        			if (err) {
        				throw err;
        			}

                    done();

                });

            });

        });


    });


    describe('/conversation/list GET', function () {

        it('Can get conversation list', function (done) {

          signin(function(token){

            var params = {

                users : [
                    global.userid2,
                    global.userid3
                ]

            };

            request(app)
                .post('/api/v1/conversation/new')
                .send(params)
                .expect('Content-Type', /json/)
                .expect(200)
                .set('Access-Token', token)
                .end(function (err, res) {

                if (err) {
                  throw err;
                }

                res.body.should.have.property('success');
                res.body.success.should.equal(1);
                res.body.should.have.property('data');
                res.body.data.should.have.property('ok');
                res.body.data.ok.should.equal(true);

                request(app)
                    .get('/api/v1/conversation/list')
                    .expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

                    if (err) {
                      throw err;
                    }
                                                                      
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');
                    res.body.data.ok.should.equal(true);
                    res.body.data.should.have.property('conversations');
                    res.body.data.conversations.should.be.instanceof(Array);

                    done();

                });

            });

          });

        });

       it('Can add people to conversation ( add to exist one)', function (done) {
    
            signin(function(token){
    
                var params = {
    
                    users : [
                        global.userid2
                    ]
    
                };
    
                request(app)
                    .post('/api/v1/conversation/new')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {
    
            			if (err) {
            				throw err;
            			}
    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');
                    res.body.data.ok.should.equal(true);
                    
                    
                    var params = {
                        
                        users : [
                            global.userid3,
                            global.userid4
                        ]
        
                    };
        
                    request(app)
                        .post('/api/v1/conversation/add/' + res.body.data.conversation._id)
                        .send(params)
                		.expect('Content-Type', /json/)
                		.expect(200)
                        .set('Access-Token', token)
                        .end(function (err, res) {
        
                			if (err) {
                				throw err;
                			}
                                                    
                        res.body.should.have.property('success');
                        res.body.success.should.equal(1);
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('ok');
                        res.body.data.ok.should.equal(true);
                        res.body.data.should.have.property('conversation');
                        res.body.data.conversation._id.should.equal(res.body.data.conversation._id);
                                                
                        done();
        
                    });
    
                });
    
            });
    
        });

       it('Can add people to conversation ( make new one)', function (done) {
    
            signin(function(token){
    
                var params = {
    
                    users : [
                        global.userid2
                    ]
    
                };
    
                request(app)
                    .post('/api/v1/conversation/new')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {
    
            			if (err) {
            				throw err;
            			}
    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');
                    res.body.data.ok.should.equal(true);
                    
                    
                    var params = {
                        
                        makeNew : true,
                        users : [
                            global.userid3,
                            global.userid4
                        ]
        
                    };
        
                    request(app)
                        .post('/api/v1/conversation/add/' + res.body.data.conversation._id)
                        .send(params)
                		.expect('Content-Type', /json/)
                		.expect(200)
                        .set('Access-Token', token)
                        .end(function (err, res) {
        
                			if (err) {
                				throw err;
                			}

                        res.body.should.have.property('success');
                        res.body.success.should.equal(1);
                        res.body.should.have.property('data');
                        res.body.data.should.have.property('ok');
                        res.body.data.ok.should.equal(true);
                        res.body.data.should.have.property('conversation');
                        res.body.data.conversation._id.should.not.equal(params.conversationId);
                                                
                        done();
        
                    });
    
                });
    
            });
    
        });


       it('Fails when send invalid conversation id', function (done) {
    
            signin(function(token){

                var params = {
                    
                    users : [
                        global.userid3,
                        global.userid4
                    ]
    
                };
    
                request(app)
                    .post('/api/v1/conversation/add/aaaaaa')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {
    
            			if (err) {
            				throw err;
            			}
    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('validationError');

                                            
                    done();
    
                });
                
    
            });
    
        });
         
    });

    describe('/conversation/leave GET', function () {

        it('Can leave conversation ', function (done) {

          signin(function(token){

            var params = {

                users : [
                    global.userid2,
                    global.userid3
                ]

            };

            request(app)
                .post('/api/v1/conversation/new')
                .send(params)
                .expect('Content-Type', /json/)
                .expect(200)
                .set('Access-Token', token)
                .end(function (err, res) {

                if (err) {
                  throw err;
                }

                res.body.should.have.property('success');
                res.body.success.should.equal(1);
                res.body.should.have.property('data');
                res.body.data.should.have.property('ok');
                res.body.data.ok.should.equal(true);

                request(app)
                    .post('/api/v1/conversation/leave/' + res.body.data.conversation._id)
                    .expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

                    if (err) {
                      throw err;
                    }
                    
	                res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');

                    done();

                });

            });

          });
        
        });

       it('Fails when conversation id is wrong', function (done) {

          signin(function(token){

            var params = {

                users : [
                    global.userid2,
                    global.userid3
                ]

            };

            request(app)
                .post('/api/v1/conversation/new')
                .send(params)
                .expect('Content-Type', /json/)
                .expect(200)
                .set('Access-Token', token)
                .end(function (err, res) {

                if (err) {
                  throw err;
                }

                res.body.should.have.property('success');
                res.body.success.should.equal(1);
                res.body.should.have.property('data');
                res.body.data.should.have.property('ok');
                res.body.data.ok.should.equal(true);

                request(app)
                    .post('/api/v1/conversation/leave/hugahuga')
                    .expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

                    if (err) {
                      throw err;
                    }
                    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');
                    res.body.data.should.have.property('validationError');
                    
                    done();

                });

            });

          });
          
        });

    });

    describe('/conversation/update POST', function () {

         it('Update profile with picture works', function (done) {
    	
            global. signin(function(token){

	            var params = {
                    
	                users : [
	                    global.userid2,
	                    global.userid3
	                ]
	
	            };

	            request(app)
	                .post('/api/v1/conversation/new')
	                .send(params)
	                .expect('Content-Type', /json/)
	                .expect(200)
	                .set('Access-Token', token)
	                .end(function (err, res) {
	
	                if (err) {
	                  throw err;
	                }
	
	                res.body.should.have.property('success');
	                res.body.success.should.equal(1);
	                res.body.should.have.property('data');
	                res.body.data.should.have.property('ok');
	                res.body.data.ok.should.equal(true);
										
	                request(app)
	                    .post('/api/v1/conversation/update/' + res.body.data.conversation._id)
	                    .expect(200)
	                    .set('Access-Token', token)
	            		.field('name', 'test')
	                    .attach('file', 'src/server/test/samplefiles/max.jpg')
	                    .end(function (err, res) {
	
	                    if (err) {
	                      throw err;
	                    }
	                    
		                res.body.should.have.property('success');
	                    res.body.success.should.equal(1);
	                    res.body.should.have.property('data');
	                    res.body.data.should.have.property('ok');
						res.body.data.ok.should.equal(true);
	
	                    done();
	
	                });
	
	            });
                  
                
            });
            
        });
                                      
    });

    describe('/conversation/detail/[id] GET', function () {

         it('Cat get conversation by id', function (done) {
    	
            global. signin(function(token){

	            var params = {
    
	                users : [
	                    global.userid2,
	                    global.userid3
	                ]
	
	            };

	            request(app)
	                .post('/api/v1/conversation/new')
	                .send(params)
	                .expect('Content-Type', /json/)
	                .expect(200)
	                .set('Access-Token', token)
	                .end(function (err, res) {
	
	                if (err) {
	                  throw err;
	                }
	
	                res.body.should.have.property('success');
	                res.body.success.should.equal(1);
	                res.body.should.have.property('data');
	                res.body.data.should.have.property('ok');
	                res.body.data.ok.should.equal(true);
										
	                request(app)
	                    .get('/api/v1/conversation/detail/' + res.body.data.conversation._id)
	                    .expect(200)
	                    .set('Access-Token', token)
	                    .end(function (err, res) {
	
	                    if (err) {
	                      throw err;
	                    }
	                    
		                res.body.should.have.property('success');
	                    res.body.success.should.equal(1);
	                    res.body.should.have.property('data');
	                    res.body.data.should.have.property('ok');
						res.body.data.ok.should.equal(true);
	                    res.body.data.should.have.property('conversation');
	
	                    done();
	
	                });
	
	            });
                  
                
            });
            
        });
                                      
    });

    describe('/conversation/removeuser POST', function () {

        it('Can remove user from conversation', function (done) {

            signin(function(token){

                var params = {
                    
                    name : "test",
                    users : [
                        global.userid2,
                        global.userid3,
                        global.userid4
                    ]

                };

                request(app)
                    .post('/api/v1/conversation/new')
                    .send(params)
            		.expect('Content-Type', /json/)
            		.expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

            			if (err) {
            				throw err;
            			}
                                            
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('ok');
                    res.body.data.ok.should.equal(true);


                    var params = {
                        
                        name : "test",
                        users : [
                            global.userid4
                        ]
    
                    };
                
	                request(app)
	                    .post('/api/v1/conversation/removeuser/' + res.body.data.conversation._id)
                        .send(params)
	                    .expect(200)
	                    .set('Access-Token', token)
	                    .end(function (err, res) {
	
	                    if (err) {
	                      throw err;
	                    }
	                    	                    
		                res.body.should.have.property('success');
	                    res.body.success.should.equal(1);
	                    res.body.should.have.property('data');
	                    res.body.data.should.have.property('ok');
						res.body.data.ok.should.equal(true);
	                    res.body.data.should.have.property('conversation');
	
	                    done();
	
	                });

                });

            });

        });
        
    });

});
