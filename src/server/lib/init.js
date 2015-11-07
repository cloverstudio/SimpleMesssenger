(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var Config = {};

    Config.host = "localhost";
    Config.port = 8080;
    Config.urlPrefix = '/api/v1';

    Config.dbCollectionPrefix = '';
    Config.databaseUrl = "mongodb://localhost/simplemessenger";
    Config.publicPath = "/Users/kenyasue/Documents/Projects/SimpleMessenger/public/";
    Config.uploadPath = "/Users/kenyasue/Documents/Projects/SimpleMessenger/public/uploads/";

    Config.emailService = 'Gmail';
    Config.emailFrom = '';
    Config.emailUserName = '';
    Config.emailPassword = '';

    Config.defaultAvatar = "img/noname.png";
    
    Config.secretSeed = "8zgqvU6LaziThJI1uz3PevYd"


    // Exports ----------------------------------------------
    module["exports"] = Config;

})((this || 0).self || global);
