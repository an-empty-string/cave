// cave
// a text adventure engine, by Fox Wilson

var settings = {}

var message = function(msg) {
    $(".well").prepend(msg + "<br />");
}

var welcome = function(game) {
    if(game.welcome) message(game.welcome);
    else {
        message("Welcome to " + game.title + ", by " + game.author);
    }
}

$(document).ready(function() {
    message("cave initializing");
    $.get("/game.json", function(data) {
        message("cave initialization complete, entering game");
        welcome(data);
    });
});
