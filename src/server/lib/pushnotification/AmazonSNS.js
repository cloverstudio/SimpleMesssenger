var mongoose = require('mongoose');
var _ = require('lodash');

var Const = require('../consts.js');
var Conf = require('../init.js');

var ConversationModel = require('../../Models/Conversation');
var AWS = require('aws-sdk');

var AmazonSNS = {
    
    send: function(userFrom,users,message,payload,badge){
        
        
        var self = this;
        
        AWS.config.update({
            accessKeyId: Conf.pushnotification.config.apiKey,
            secretAccessKey: Conf.pushnotification.config.apiSecret,
            region: Conf.pushnotification.config.apiRegion
        });
        
        var message = self.generateMessage(userFrom,payload);
        
        var iOSUsers = [];
        var AndroidUsers = [];
        
                
        _.forEach(users,function(user){
        
            if(user._id.toString() == userFrom._id.toString())
                return;
            
            if(!_.isEmpty(user.device)
                && !_.isEmpty(user.device.deviceType)
                && user.device.deviceType == Const.deviceIOS){
                    
                                        
                    var payloadToSend = {
                        default : self.generateMessage(userFrom,payload),
                        APNS : JSON.stringify({
                            aps : {
                                alert: self.generateMessage(userFrom,payload),
                                sound: 'push_notification.mp3',
                                badge: badge,
                                category: "MESSAGE_TYPE"
                            },
                            data : payload
                        })
                        
                    };
                    
                    self.sendAPNProd(user.device.pushToken,payloadToSend);

                    var payloadToSend = {
                        default : self.generateMessage(userFrom,payload),
                        APNS_SANDBOX : JSON.stringify({
                            aps : {
                                alert: self.generateMessage(userFrom,payload),
                                sound: 'push_notification.mp3',
                                badge: badge,
                                category: "MESSAGE_TYPE"
                            },
                            data : payload
                        })
                        
                    };
                    
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
                
                console.log("dev",payload);

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
                    
                
                });
                
        });
        
    },
    
    generateMessage : function(userFrom,payload){

        var type = payload.message.type;
        
        if(!userFrom){
            return payload.message;

        }
        
        var fromName = userFrom.temNumber;
        if(!_.isEmpty(userFrom.displayName))
            fromName = userFrom.displayName;

        if(!_.isEmpty(userFrom.additionalInfo) &&
            !_.isEmpty(userFrom.additionalInfo.name))
            
            fromName = userFrom.additionalInfo.name;
                     
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
