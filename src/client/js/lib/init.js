(function(global) {
    "use strict;"

    var Config = {
        APIEndpoint : '/api/v1',
        SpikaBaseURL : '/spika',
        defaultContaier : 'body', // write JQuery style selector
        socketUrl : "http://localhost:8080/simplemessenger"

    };

    // Exports ----------------------------------------------
    module["exports"] = Config;

})((this || 0).self || global);
