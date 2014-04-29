// cave
// a text adventure engine, by Fox Wilson

var settings = {
    debug: true
};

var message = function(msg){$(".well").prepend(msg + "<br />");};
var d = function(m){if(settings.debug)message("<small><i>debug: " + m + "</i></small>");};


var welcome = function(game) {
    if(game.welcome) message(game.welcome);
    else {
        message("Welcome to " + game.title + ", by " + game.author);
    }
};

$(document).ready(function() {
    d("cave v0.0.1 starting up, loading data at /game.json");
    $.get("/game.json", function(data) {
        d("game data loaded.");
        welcome(data);
    });
});
