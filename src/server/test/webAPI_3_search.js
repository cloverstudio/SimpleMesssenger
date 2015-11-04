var should = require('should');
var request = require('supertest');
var app = require('../mainTest');

describe('WEB Search', function () {

    describe('/search/user GET', function () {
        
        it('can find user without keyword', function (done) {

            signin(function(token){
                
                request(app)
                    .get('/api/v1/search/user/')
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

        it('can find user with keyword', function (done) {

            signin(function(token){
                
                request(app)
                    .get('/api/v1/search/user/test')
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
                    res.body.data.should.have.property('users');
                    
                    done();
                
                });
                
            });   
            
        });
        
    });
    
});