window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap-sass');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

// setup routing here
var Routing = require('./routing');

// setup view helpers
require('./lib/viewHelpers').attach();


$(function () {

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
    
})

// disable ajax cache for old browsers
$.ajaxSetup({ cache: false });


