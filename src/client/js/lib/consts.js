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
        NotificationNewMessage: "notification_new_message"
        
    };

    // Exports ----------------------------------------------
    module["exports"] = Consts;

})((this || 0).self || global);
