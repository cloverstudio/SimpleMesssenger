var _ = require('lodash');

var UsersManager = {
    
    rooms:{},
    addUser: function(id,name,avatarURL,roomID,token){
        
        var user = {
            userID: id,
            name: name,
            avatarURL: avatarURL,
            roomID: roomID,
            token: token,
            socketID: ''
        };
         
        if(_.isUndefined(this.rooms[roomID])){
            this.rooms[roomID] = {};
        }

        if(_.isEmpty(this.rooms[roomID])){
            this.rooms[roomID] = {
                users:{}
            };
        }
                        
        if(_.isUndefined(this.rooms[roomID].users[id]))
            this.rooms[roomID].users[id] = user;
        
        this.rooms[roomID].users[id] = user;
                
    },
    removeUser: function(roomID,userID){
        
        console.log("----------");
        
        console.log("this.rooms[roomID].users",this.rooms[roomID].users);
        console.log("userID",userID);
        
        delete this.rooms[roomID].users[userID];

        console.log("this.rooms[roomID].users",this.rooms[roomID].users);

        console.log("----------");

     
    },
    getUsers: function(roomID){
        
        if(!this.rooms[roomID])
            this.rooms[roomID] = {};
            
        var users = this.rooms[roomID].users;
                
        // change to array
        var usersAry = [];
        
        _.forEach(users, function(row, key) {
                                
            usersAry.push(row);
            
        });
            
        return usersAry;
        
    },
    getRoomByUserID: function(userID){
        
        var roomsAry = [];
        
        _.forEach(this.rooms, function(room, roomID) {
                                
            _.forEach(room.users, function(user, key) {
                                    
                if(user.userID == userID)
                    roomsAry.push(roomID);
                
            });
                
        });
        
        return roomsAry;
        
    },
    pairSocketIDandUserID: function(userID,socketID){
        
        _.forEach(this.rooms, function(room, roomID) {
                                
            _.forEach(room.users, function(user) {
                                    
                if(user.userID == userID)
                    user.socketID = socketID;
                
                                
            });
            
        });
                
    },
    getUserBySocketID: function(socketID){
        
        var userResult = null;
        
        _.forEach(this.rooms, function(room, roomID) {
                                
            _.forEach(room.users, function(user) {
                                                
                if(user.socketID == socketID)
                    userResult = user;
                                
            });

        });
                
        return userResult;
        
    },
    getRoomBySocketID: function(socketID){
        
        var roomResult = null;
        
        _.forEach(this.rooms, function(room, roomID) {
                                
            _.forEach(room.users, function(user) {
                            
                if(user.socketID == socketID)
                    roomResult = roomID;
                                
            });

        });
                
        return roomResult;
        
    }
    
    
}

module["exports"] = UsersManager;