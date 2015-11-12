var Backbone = require('backbone');
var _ = require('lodash');

(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var ConversationModel = Backbone.Model.extend({
    
        defaults: {
            id: "",
            users: [],
            owner: null,
            name: "",
            description: "",
            created: 0,
            lastMessaage:{},
            unreadCount:0,
            avatar : {
                file : "",
                thumb : ""
            }
        },
        
        initialize: function(){
    
        }
        
    });

    var ConversationCollection = Backbone.Collection.extend({
        model: ConversationModel
    });
    
    var conversation = {
        Model:ConversationModel,
        Collection:ConversationCollection,
    }
    
    conversation.modelByResult = function(obj){
        
        var avatarFile = null;
        var avatarThumb = null;
        
        if(obj.avatar){
            
            avatarFile = obj.avatar.file;
            avatarThumb = obj.avatar.thumb;
            
        }
        var model = new ConversationModel({

            id: obj._id,
            name: obj.name,
            description: obj.description,
            owner: obj.owner,
            users: obj.users,
            created: obj.created,
            avatar : {
                file : avatarFile,
                thumb : avatarThumb
            },
            lastMessaage:obj.lastMessage,
            unreadCount:obj.unreadCount
            
        });

        return model;
                
    }

    conversation.collectionByResult = function(obj){
        
        if(!_.isArray(obj))
            return null;
        
        var aryForCollection = [];
        
        _.each(obj,function(row){

            aryForCollection.push(conversation.modelByResult(row));
             
        });
        
        return new ConversationCollection(aryForCollection);
                
    }
    
    module["exports"] = conversation;

})((this || 0).self || global);
