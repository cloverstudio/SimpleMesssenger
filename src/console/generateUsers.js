var fs = require('fs-extra');
var _ = require('lodash');
var sha1 = require('sha1');
var http = require('http');
var Stream = require('stream').Transform;
var async = require('async');

var DatabaseManager = require('../server/lib/DatabaseManager');
var UserModel = require('../server/Models/User');

var Utils = require('../server/lib/utils');
var init = require('../server/lib/init');
var Const = require('../server/lib/consts');

DatabaseManager.init(function(success){
        
    if(!success){
        
        console.log('Failed to connect DB');
        process.exit(1);
        
    } else {

        fs.readFile(__dirname + '/SampleData/MOCK_DATA.json', 'utf8', function (err, data) {
        
            if (err) throw err;
            
            var allData = JSON.parse(data);
            
            var userModel = UserModel.get();
        
            async.each(allData, function(row,done){
                
                _.debounce(function(){

                    var filename = Utils.getRandomString(32);
                    var thumbname = Utils.getRandomString(32);
                    
                    var url = 'http://lorempixel.com/512/512/';                    
                    
                    http.request(url, function(response) {                                        
                      var data = new Stream();                                                    
                    
                      response.on('data', function(chunk) {                                       
                        data.push(chunk);                                                         
                      });                                                                         
                    
                      response.on('end', function() {
                                                
                        fs.writeFileSync(init.uploadPath + filename, data.read());
                        
                        // generate thumb
                        var easyimg = require('easyimage');
                        
                        easyimg.convert({src: init.uploadPath + filename, dst: init.uploadPath + filename + ".png", quality:100}).then(function (file) {
                                                    
                            fs.renameSync( init.uploadPath + filename + ".png",init.uploadPath + filename);
                            
                            easyimg.thumbnail({
                                    src: init.uploadPath + filename, 
                                    dst: init.uploadPath + thumbname + ".png",
                                    width:Const.thumbSize, height:Const.thumbSize
                                }).then(
                                
                                function(image) {
                                                                    
                                    fs.renameSync( init.uploadPath + thumbname + ".png",init.uploadPath + thumbname);
                                    
                                    var model = new userModel({
                                        displayName:row.first_name + " " + row.last_name,
                                        username:row.username,
                                        email: row.email,
                                        password: sha1('yumiko'),
                                        avatar: {
                                            file : filename,
                                            thumb : thumbname
                                        },
                                        created: Utils.now()          
                                    });

                                console.log(model.save);
                                console.log(model);

                          
                                    model.save(function(err,modelSaved){
                                                                            
                                        if(err)
                                            console.log(err);
                                            
                                        console.log('new user saved');
                                        done(err);              
                                    
                                    });
                            
                                },
                                function (err) {
                                    
                                    
                
                                }
                                
                            );
    
                                                            
                        });                    
                        
                      });   
                                                                                            
                    }).end();
    

                },500)();
        
            });
            
        });

    }
    
});
