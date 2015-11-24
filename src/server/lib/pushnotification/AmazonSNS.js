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
        
        var message = self.generateMessage(users,payload);
        
        var iOSUsers = [];
        var AndroidUsers = [];
        
        _.forEach(users,function(user){
                        
            if(!_.isEmpty(user.device)
                && !_.isEmpty(user.device.deviceType)
                && user.device.deviceType == Const.deviceIOS){
                    
                                        
                    var payloadToSend = {
                        default : self.generateMessage(users,payload),
                        APNS : {
                            aps : {
                                alert: self.generateMessage(users,payload),
                                sound: 'push_notification.mp3',
                                badge: null,
                                category: "MESSAGE_TYPE"
                            },
                            data : payload
                        }
                        
                    };
                    
                    self.sendAPNProd(user.device.pushToken,payloadToSend);
                    self.sendAPNDev(user.device.pushToken,payloadToSend);
                    
                }

            if(!_.isEmpty(user.device)
                && !_.isEmpty(user.device.deviceType)
                && user.device.deviceType == Const.deviceAndroid){
                    
                    var payloadToSend = {
                        default : message,
                        message : message,
                        GCM : {
                            data : payload
                        }
                        
                    };
                    
                    self.sendGCM(user.device.pushToken,payloadToSend);                    
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
                
                console.log('sending push ' + payload);
                
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
                payload.APNS_SANDBOX = JSON.stringify(payload.APNS);
                payload.APNS = null;
                // then have to stringify the entire message payload
                payload = JSON.stringify(payload);

                console.log('sending dev push ' + payload);
                console.log('endpointArn ' + endpointArn);

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

        console.log('send gcm',payload);
        
        sns.createPlatformEndpoint({
                PlatformApplicationArn: Conf.pushnotification.config.arnAndroid,
                Token: pushToken
            }, function(err, data) {
            
                if (err) {
                    console.log(err.stack);
                    return;
                }
                
                var endpointArn = data.EndpointArn;

                payload.GCM = JSON.stringify(payload.GCM);
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
                    
                    console.log(data);
                
                });
                
        });
        
    },
    
    generateMessage : function(users,payload){
        
        console.log("users",users);
        console.log("messege",payload);
        
        var type = payload.message.type;
        var userFrom = null;
        
        _.forEach(users,function(user){
            
            if(user._id.toString() == payload.message.userID ||
                user.telNumber == payload.message.userID){
                
                userFrom = user;
                
            } 
            
        });
        
        if(!userFrom)
            return payload.message;
        
        var fromName = userFrom.temNumber;
        if(!_.isEmpty(userFrom.displayName))
            fromName = userFrom.displayName;
         
        if(type == Const.messageTypeText){
            
           return fromName + ": " + payload.message.message;
            
        }

        if(type == Const.messageTypeImage){
            
           return fromName + " has sent you a photo";
            
        }
        if(type == Const.messageTypeVideo){
            
           return fromName + " has sent you a video";
            
        }
        if(type == Const.messageTypeStickers){
            
           return fromName + " has sent you a sticker";
            
        }
        if(type == Const.messageTypeSound){
            
           return fromName + " has sent you a voice message";
            
        }
        if(type == Const.messageTypeFile){
            
           return fromName + " has shared a file";
            
        }
        if(type == Const.messageTypeLocation){
            
           return fromName + " has shared a location";
            
        }

        
    }
    
}

module["exports"] = AmazonSNS;
