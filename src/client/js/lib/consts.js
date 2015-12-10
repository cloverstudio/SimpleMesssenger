(function(global) {
    "use strict;"

    var Consts = {
        credentialsMinLength: 6,
        
        NotificationNewChat: "notification_new_chat",
        NotificationUpdateWindowSize: "notification_update_window_size",
        NotificationOpenConversation: "notification_open_conversation",
        NotificationUpdateConversation: "notification_update_conversation",
        NotificationTuggleInfo: "notification_tuggle_info",
        NotificationCloseConversation: "notification_close_conversation",
        NotificationNewMessage: "notification_new_message",
    
        ErrorCodes : {
                2000000 : "Unknown Error",
                2000001 : "Username is empty",
                2000002 : "Email is empty",
                2000003 : "Password is empty",
                2000004 : "Username is already taken",
                2000005 : "Email is already taken",
                2000006 : "Wrong usename or password",
                2000007 : "UUID is empty",
                2000008 : "Wrong secret",
                2000009 : "Weont telephone number",
                2000010 : "Please input display name",
                2000011 : "Wrong file type for avatar",
                2000012 : "Wrong password",
                2000013 : "Wrong new password",
                2000014 : "Wrong email address",
                2000015 : "Conversation id is empty",
                2000016 : "Please select user",
                2000017 : "Wront conversation id",
                2000018 : "Wrong user id",
                2000019 : "Wrong conversation id",
                2000020 : "Wrong name",
                2000021 : "Wrong file type",
                2000022 : "Wrong conversation id",
                2000023 : "No convesation id is provided",
                2000024 : "No user is provided",
                2000025 : "Wrong conversation id",
                2000026 : "Wrong user id",
                2000027 : "You don't have permission",
                2000028 : "Wrong conversation id",
                2000029 : "Please input message",
                2000030 : "Wrong user id"
 
        }
    
    };

    // Exports ----------------------------------------------
    module["exports"] = Consts;

})((this || 0).self || global);
