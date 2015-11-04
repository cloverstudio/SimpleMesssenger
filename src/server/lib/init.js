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

    // Exports ----------------------------------------------
    module["exports"] = Config;

})((this || 0).self || global);
