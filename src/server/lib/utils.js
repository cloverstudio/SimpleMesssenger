var nodemailer = require('nodemailer');
var init = require('../lib/init');
var mongoose = require('mongoose');
var md5 = require('md5');

(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    function Utils() {
    };

    // Header -----------------------------------------------
    Utils.prototype.getRandomString = getRandomString;
    Utils.prototype.now = now;
    Utils.prototype.sendEmail = sendEmail;
    Utils.prototype.toObjectId = toObjectId;
    Utils.prototype.shorten = shorten;
    Utils.prototype.generateSecret = generateSecret;
    Utils.prototype.generateYYYYMMDDHHMMSS = generateYYYYMMDDHHMMSS;
    
    // Implementation ---------------------------------------
    function getRandomString(){
    
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for( var i=0; i < 32; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }
    
    function now(){
        Date.now = Date.now || function() { return +new Date; }; 
        
        return Date.now();
        
    }
    
    function generateSecret(time){
        
        var dateStr = this.generateYYYYMMDDHHMMSS(time);
        var dateStrWithSecret = dateStr + init.secretSeed;
        
        console.log(dateStrWithSecret);
        return md5(dateStrWithSecret);
        
    }
    
    function generateYYYYMMDDHHMMSS(timestamp){
        
        var date = new Date(timestamp);
        
        var Y = date.getUTCFullYear();
                
        var MM = date.getUTCMonth() + 1;
        if(MM < 10)
            MM = "0"+MM;
        
        var DD = date.getUTCDate();
        if(DD < 10)
            DD = "0"+DD;
        
        var HH = date.getUTCHours();
        if(HH < 10)
            HH = "0"+HH;
        
        var Min = date.getMinutes();
        if(Min < 10)
            Min = "0"+Min;

        var SS = date.getSeconds();
        if(SS < 10)
            SS = "0"+SS;
            
        return Y.toString() + MM.toString() + DD.toString() + HH.toString() + Min.toString() + SS.toString();
        
    }
    
    function sendEmail(to,subject,body){
        
        var transporter = nodemailer.createTransport({
            service: init.emailService,
            auth: {
                user: init.emailUserName,
                pass: init.emailPassword
            }
        });
        transporter.sendMail({
            from: init.emailFrom,
            to: to,
            subject: subject,
            text: body
        });
        
    }

    function toObjectId(id){
        
        return mongoose.Types.ObjectId(id);
        
    }

    function shorten(str,limit){
        
        if(!limit)
            limit = 20;
            
        if(str.length > limit)
            str = str.substring(0,limit - 3) + "...";
        
        return str;
        
    }
        
    // Exports ----------------------------------------------
    module["exports"] = new Utils();

})((this || 0).self || global);