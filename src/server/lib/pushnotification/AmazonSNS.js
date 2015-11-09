var mongoose = require('mongoose');
var _ = require('lodash');

var Const = require('../consts.js');
var Conf = require('../init.js');

var ConversationModel = require('../../Models/Conversation');
var AWS = require('aws-sdk');

var AmazonSNS = {
    
    send: function(users,message,payload){
        
        var self = this;
        
        AWS.config.update({
            accessKeyId: Conf.pushnotification.config.apiKey,
            secretAccessKey: Conf.pushnotification.config.apiSecret,
            region: Conf.pushnotification.config.apiRegion
        });
        
        
        var iOSUsers = [];
        var AndroidUsers = [];
        
        _.forEach(users,function(user){
            
            if(!_.isEmpty(user.device)
                && _.isEmpty(user.device.deviceType)
                && user.device.deviceType == Const.deviceIOS){
                    
                    iOSUsers.push(user);
                    
                    var payload = {
                        default : message,
                        APNS : {
                            aps : {
                                alert: message,
                                sound: 'default',
                                badge: null
                            }
                        },
                        data : payload
                    };
                    
                    self.sendAPNProd(user.device.pushToken,payload);
                    self.sendAPNDev(user.device.pushToken,payload);
                    
                }

            if(!_.isEmpty(user.device)
                && _.isEmpty(user.device.deviceType)
                && user.device.deviceType == Const.deviceAndroid){
                    
                    var payload = {
                        default : message,
                        message : message,
                        data : payload
                    };
                    
                    self.sendGCM(user.device.pushToken,payload);                    
                }
            
        });
        
            
    },
    
    sendAPNProd: function(pushToken,payload){

        var sns = new AWS.SNS();

        sns.createPlatformEndpoint({
                PlatformApplicationArn: Conf.pushnotification.config.arniOSProd,
                Token: pushToken
            }, function(err, data) {
            
                if (err) {
                    console.log(err.stack);
                    return;
                }
                
                var endpointArn = data.EndpointArn;

                // first have to stringify the inner APNS object...
                payload.APNS = JSON.stringify(payload.APNS);
                // then have to stringify the entire message payload
                payload = JSON.stringify(payload);
                
                console.log('sending push');
                
                sns.publish({
                
                    Message: payload,
                    MessageStructure: 'json',
                    TargetArn: endpointArn
                    
                }, function(err, data) {
                
                        if (err) {
                            console.log(err.stack);
                            return;
                        }
                
                        console.log('push sent');
                        console.log(data);
                
                });
                
        });
        
    },
    
    sendAPNDev: function(pushToken,payload){

        var sns = new AWS.SNS();

        sns.createPlatformEndpoint({
                PlatformApplicationArn: Conf.pushnotification.config.arniOSDev,
                Token: pushToken
            }, function(err, data) {
            
                if (err) {
                    console.log(err.stack);
                    return;
                }
                
                var endpointArn = data.EndpointArn;

                // first have to stringify the inner APNS object...
                payload.APNS = JSON.stringify(payload.APNS);
                // then have to stringify the entire message payload
                payload = JSON.stringify(payload);
                
                console.log('sending push');
                
                sns.publish({
                
                    Message: payload,
                    MessageStructure: 'json',
                    TargetArn: endpointArn
                    
                }, function(err, data) {
                
                    if (err) {
                        console.log(err.stack);
                        return;
                    }

                });
                
        });
        
    },
    
    sendGCM: function(pushToken,payload){

        var sns = new AWS.SNS();

        sns.createPlatformEndpoint({
                PlatformApplicationArn: Conf.pushnotification.config.arnAndroid,
                Token: pushToken
            }, function(err, data) {
            
                if (err) {
                    console.log(err.stack);
                    return;
                }
                
                var endpointArn = data.EndpointArn;

                payload = JSON.stringify(payload);
                                
                sns.publish({
                
                    Message: payload,
                    MessageStructure: 'json',
                    TargetArn: endpointArn
                    
                }, function(err, data) {
                
                    if (err) {
                        console.log(err.stack);
                        return;
                    }
                
                });
                
        });
        
    }
    
}

module["exports"] = AmazonSNS;
