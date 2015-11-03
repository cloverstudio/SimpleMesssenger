var Const = require('./consts');
var _ = require('lodash');
var U = require('./utils.js');
var Backbone = require('backbone');

var UserModel = require('../Models/user');

var windowSizeHandler = {

    init: function(){

        var self = this;

        Backbone.on(Const.NotificationUpdateWindowSize,function(obj){

            self.adjustSize();

        });

        $(window).resize(function() {

            self.adjustSize();

        });

    },

    adjustSize: function(){

        var height = $(window).height();
        var width = $(window).width();

        var headerHeight = $("#main-header").height();

        $("#main-conversationlist").height(height - headerHeight);
        $("#main-conversationview").height(height - headerHeight);
        $("#main-infoview").height(height - headerHeight);

    }

}

module["exports"] = windowSizeHandler;
