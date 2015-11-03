
var should = require('should');
var request = require('supertest');
var app = require('../mainTest');

describe('WEB Conversation', function () {

    describe('/conversation/new POST', function () {

        it('Can create new conversation', function (done) {

            signin(function(token){

                var params = {

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
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('ok');
                    res.body.result.ok.should.equal(true);

                    done();

                });

            });

        });

        it('Fails when send invalid userid', function (done) {

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
            		.expect(500)
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
                res.body.should.have.property('result');
                res.body.result.should.have.property('ok');
                res.body.result.ok.should.equal(true);

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
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('ok');
                    res.body.result.ok.should.equal(true);
                    res.body.result.should.have.property('conversations');
                    res.body.result.conversations.should.be.instanceof(Array).and.have.lengthOf(2);

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
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('ok');
                    res.body.result.ok.should.equal(true);
                    
                    
                    var params = {
                        
                        conversationId : res.body.result.conversation._id,
                        users : [
                            global.userid3,
                            global.userid4
                        ]
        
                    };
        
                    request(app)
                        .post('/api/v1/conversation/add')
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
                        res.body.should.have.property('result');
                        res.body.result.should.have.property('ok');
                        res.body.result.ok.should.equal(true);
                        res.body.result.should.have.property('conversation');
                        res.body.result.conversation._id.should.equal(params.conversationId);
                                                
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
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('ok');
                    res.body.result.ok.should.equal(true);
                    
                    
                    var params = {
                        
                        conversationId : res.body.result.conversation._id,
                        makeNew : true,
                        users : [
                            global.userid3,
                            global.userid4
                        ]
        
                    };
        
                    request(app)
                        .post('/api/v1/conversation/add')
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
                        res.body.should.have.property('result');
                        res.body.result.should.have.property('ok');
                        res.body.result.ok.should.equal(true);
                        res.body.result.should.have.property('conversation');
                        res.body.result.conversation._id.should.not.equal(params.conversationId);
                                                
                        done();
        
                    });
    
                });
    
            });
    
        });


       it('Fails when send invalid conversation id', function (done) {
    
            signin(function(token){

                var params = {
                    
                    conversationId : "hugahuhu",
                    users : [
                        global.userid3,
                        global.userid4
                    ]
    
                };
    
                request(app)
                    .post('/api/v1/conversation/add')
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
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('validationError');

                                            
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
                res.body.should.have.property('result');
                res.body.result.should.have.property('ok');
                res.body.result.ok.should.equal(true);

                request(app)
                    .get('/api/v1/conversation/leave/' + res.body.result.conversation._id)
                    .expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

                    if (err) {
                      throw err;
                    }
                    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('ok');

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
                res.body.should.have.property('result');
                res.body.result.should.have.property('ok');
                res.body.result.ok.should.equal(true);

                request(app)
                    .get('/api/v1/conversation/leave/hugahuga')
                    .expect(200)
                    .set('Access-Token', token)
                    .end(function (err, res) {

                    if (err) {
                      throw err;
                    }
                    
                    res.body.should.have.property('success');
                    res.body.success.should.equal(1);
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('ok');
                    res.body.result.should.have.property('validationError');
                    
                    done();

                });

            });

          });
          
        });

    });
    

});
