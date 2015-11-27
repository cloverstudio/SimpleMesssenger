(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var Const = {};

    Const.responsecodeSucceed = 1;
    Const.responsecodeError = 0;
    Const.responsecodeErrorInvalidAccessToken = 403;

    Const.httpCodeSucceed = 200;
    Const.httpCodeFileNotFound = 404;
    Const.httpCodeServerError = 500;

    Const.thumbSize = 256;
    
    Const.credentialsMinLength = 6;

    Const.deviceIOS = 'ios';
    Const.deviceAndroid = 'android';

    Const.emitCommandNewConversation = 'newconversation';
    Const.emitCommandNewMessage = 'newmessage';
    Const.emitCommandRemoveFromConversation = 'removefromconversation';
    
    Const.messageTypeText = 1;
    Const.messageTypeImage = 2;
    Const.messageTypeVideo = 3;
    Const.messageTypeStickers = 4;
    Const.messageTypeSound = 5;
    Const.messageTypeFile = 6;
    Const.messageTypeLocation = 7;
    Const.messageTypeSMS = 8;
    
    // Exports ----------------------------------------------
    module["exports"] = Const;

})((this || 0).self || global);
