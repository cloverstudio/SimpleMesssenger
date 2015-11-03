var Backbone = require('backbone');
var _ = require('lodash');

(function(global) {
    "use strict;"

    // Class ------------------------------------------------
    var UserModel = Backbone.Model.extend({
    
        defaults: {
            id: "",
            displayName: "",
            email: "",
            created: 0,
            token: {
                token: "",
                generated: 0
            },
            avatar : {
                file : "",
                thumb : ""
            }
        
        },
        
        initialize: function(){
    
        }
        
    });

    var UserCollection = Backbone.Collection.extend({
        model: UserModel
    });
    
    var user = {
        Model:UserModel,
        Collection:UserCollection,
    }
    
    user.modelByResult = function(obj){
        
        var avatarFile = null;
        var avatarThumb = null;
        
        if(obj.avatar){
            
            avatarFile = obj.avatar.file;
            avatarThumb = obj.avatar.thumb;
            
        }
        var model = new UserModel({

            id: obj._id,
            displayName: obj.displayName,
            email: obj.email,
            created: obj.created,
            avatar : {
                file : avatarFile,
                thumb : avatarThumb
            }
            
        });

        return model;
                
    }

    user.collectionByResult = function(obj){
        
        if(!_.isArray(obj))
            return null;
        
        var aryForCollection = [];
        
        _.each(obj,function(row){

            aryForCollection.push(user.modelByResult(row));
             
        });
        
        return new UserCollection(aryForCollection);
                
    }
    
    module["exports"] = user;

})((this || 0).self || global);
