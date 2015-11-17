
var should = require('should');
var request = require('supertest');
var app = require('../mainTest');
var util = require('util');

describe('WEB Conversation', function () {

    describe('/message/send POST', function () {

        it('Can send message', function (done) {

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
                        
                        conversationId : res.body.data.conversation._id,
                        message : "test"
    
                    };
    
                    request(app)
                        .post('/api/v1/message/send')
                        .send(params)
                		.expect('Content-Type', /json/)
                		.expect(200)
                        .set('Access-Token', token)
                        .end(function (err, res) {
    
                			if (err) {
                				throw err;
                			}
                        
                        console.log(res.body);
                                        
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

});
