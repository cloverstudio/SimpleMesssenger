var Backbone = require('backbone');
var _ = require('lodash');

var Utils = require('../../lib/utils');
var Const = require('../../lib/consts');
var Config = require('../../lib/init');

// load template
var template = require('./Main.hbs');

var WindowSizeManager = require('../../lib/windowSizeHandler');

var HeaderView = require('../Header/Header');
var ConversationListView = require('../ConversationList/ConversationList');
var ConversationView = require('../ConversationView/ConversationView');
var InfoView = require('../InfoView/InfoView');

var MainView = Backbone.View.extend({

    headerView : null,
    conversationListView : null,
    conversationView : null,
    infoView : null,

    initialize: function(options) {
        this.render();
    },

    render: function() {

        $(Config.defaultContaier).html(template({
          Config:Config
        }));
        
        WindowSizeManager.init();

        this.onLoad();

        return this;

    },

    onLoad: function(){

        var self = this;

        this.headerView = new HeaderView({
            el : "#main-header"
        });

        this.conversationListView = new ConversationListView({
            el : "#main-conversationlist"
        });

        this.conversationView = new ConversationView({
            el : "#main-conversationview"
        });

        this.infoView = new InfoView({
            el : "#main-infoview"
        });

        _.debounce(function(){
            Backbone.trigger(Const.NotificationUpdateWindowSize,null);
        },100)();

        Backbone.on(Const.NotificationTuggleInfo,function(obj){

            if($('#main-conversationview').hasClass('col-md-9')){
                $('#main-conversationview').removeClass('col-md-9');
                $('#main-conversationview').addClass('col-md-6');                
                $('#main-infoview').show();
            } else {
                
                $('#main-conversationview').removeClass('col-md-6');
                $('#main-conversationview').addClass('col-md-9');                
                $('#main-infoview').hide();
                
            }

        });


    }

});

module.exports = MainView;
