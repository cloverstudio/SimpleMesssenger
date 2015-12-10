var should = require('should'); 
var assert = require('assert'); 
var mongoose = require('mongoose');
var app = require('../mainTest');
var io = require('socket.io-client');

describe('SOCKET', function () {

    var socketURL = "http://localhost:8081/simplemessenger";
    var connectOptions ={
        transports: ['websocket'],
        'force new connection': true
    };

    describe('socket', function () {
        
        
        it('Login failed if userID is not provided', function (done) {
            
            var responseCount = 0;
            
        	var params = {
                userID : "",
        	};
        	
            var client1 = io.connect(socketURL, connectOptions);
            
            client1.on('connect', function(data){

                client1.emit('join',params);
                
            });
            
            client1.on('socketerror', function(data){
                
                data.code.should.equal(2000030);
                done();
                client1.disconnect();
                
            });

        });

    });

});