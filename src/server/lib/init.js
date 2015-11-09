(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var Config = {};

    Config.host = "localhost";
    Config.port = 80;
    Config.urlPrefix = '/api/v1';

    Config.dbCollectionPrefix = '';
    Config.databaseUrl = "mongodb://localhost/user";
    Config.publicPath = "/home/admin/server/SimpleMesssenger/public/";
    Config.uploadPath = "/home/admin/server/SimpleMesssenger/public/uploads/";

    Config.emailService = 'Gmail';
    Config.emailFrom = '';
    Config.emailUserName = '';
    Config.emailPassword = '';

    Config.defaultAvatar = "img/noname.png";
    
    Config.secretSeed = "8zgqvU6LaziThJI1uz3PevYd"
<<<<<<< HEAD
=======
    
    Config.pushnotification = {
        type : 'AmazonSNS',
        config : {
            apiKey : 'AKIAJGZ5PDJSJFMXS6QQ',
            apiSecret : '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',
            apiRegion : 'US_EAST_1',
            arniOSProd : 'arn:aws:sns:us-east-1:149256220588:app/APNS/iOS_Prod',
            arniOSDev : 'arn:aws:sns:us-east-1:149256220588:app/APNS_SANDBOX/iOS_Dev',
            arnAndroid : 'arn:aws:sns:us-east-1:149256220588:app/GCM/Android_PUSH'
        }
    }
>>>>>>> f47718b1d98ea0ed52580a399923dde13b5f4672

    // Exports ----------------------------------------------
    module["exports"] = Config;

})((this || 0).self || global);
