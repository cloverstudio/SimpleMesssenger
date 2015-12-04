(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var Const = {};

    Const.responsecodeSucceed = 1;
    Const.responsecodeUnknownError = 20000001;
    Const.resCodeSignUpWrongName = 20000001;
    Const.resCodeSignUpWrongEmail = 20000002;
    Const.resCodeSignUpWrongPassword = 20000003;
    Const.resCodeSignUpUserNameDuplicated = 20000004;
    Const.resCodeSignUpEmailDuplicated = 20000005;
    Const.resCodeSignInInvalidCredentials = 20000006;
    Const.resCodeSignInNoUUID = 20000007;
    Const.resCodeSignInWrongSecret = 20000008;
    Const.resCodeSignInNoTelNum = 20000009;
    Const.resCodeUpdateProfileNoDisplayName = 20000010;
    Const.resCodeUpdateProfileWrongFileType = 20000011;
    Const.resCodeUpdateProfileWrongFileType = 20000011;
    Const.resCodeChangePasswordWrongOldPassword = 20000012;
    Const.resCodeChangePasswordWrongNewPassword = 20000013;    
    Const.resCodeResetPasswordWrongEmail = 20000014;        
    Const.resCodeAddToConversationNoConversationID = 20000015;    
    Const.resCodeAddToConversationNoUser = 20000016;    
    Const.resCodeAddToConversationWrongConversationID = 20000017;  
    Const.resCodeAddToConversationWrongUserID = 20000018;  
    Const.resCodeLeaveConversationWrongConversationID = 20000019;  
    Const.resCodeUpdateConversationWrongName = 20000020;  
    Const.resCodeUpdateConversationWrongFileType = 20000021;  
    Const.resCodeUpdateConversationWrongConversationID = 20000022;  
    Const.resCodeRemoveUserNoConversationID = 20000023;  
    Const.resCodeRemoveUserNoUser = 20000024; 
    Const.resCodeRemoveUserWrongConvesationID = 20000025; 
    Const.resCodeRemoveUserWrongUserID = 20000026; 
    Const.resCodeRemoveUserDeniedByPermission = 20000027; 
    
    Const.resCodeSendMessageNoConversationID = 20000028; 
    Const.resCodeSendMessageEmptyMessage = 20000029; 
    Const.resCodeRemoveUserWrongConvesationIDD = 20000025; 
    Const.resCodeRemoveUserWrongConvesationIDD = 20000025; 
                                                       
    Const.responsecodeError = 0;
    

    Const.httpCodeSucceed = 200;
    Const.httpCodeForbidden = 403;
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
