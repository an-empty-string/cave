// cave
// a text adventure engine, by Fox Wilson

var settings = {
    debug: true
};

var message = function(msg){$(".well").prepend(msg + "<br />");};
var d = function(m){if(settings.debug)message("<i>debug: " + m + "</i>");};


var welcome = function(game) {
    if(game.welcome) message(game.welcome);
    else {
        message("Welcome to " + game.title + ", by " + game.author);
    }
};

$(document).ready(function() {
    message("cave initializing");
    $.get("/game.json", function(data) {
        message("cave initialization complete, entering game");
        welcome(data);
    });
});
