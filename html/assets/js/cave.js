// cave
// a text adventure engine, by Fox Wilson

var settings = {}

var message = function(msg) {
    $(".well").prepend(msg + "<br />");
}

$(document).ready(function() {
    message("cave initializing");
    $.get("/game.json", function(data) {
        console.log(data);
        message("cave initialization complete, entering game");
    });
});
