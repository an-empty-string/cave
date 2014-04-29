// cave
// a text adventure engine, by Fox Wilson

var settings = {
    debug: true
};

var game = {};
var message = function(msg){$(".well").prepend(msg + "<br />");};
var d = function(m){if(settings.debug)message("<small><small><i>debug: " + m + "</i></small></small>");};
var actor = null;
var Character = function() {
    this.health = 100;
    this.room = "__none__";
    this.roomdata = {};
    return this;
}

var welcome = function() {
    if(game.welcome) message(game.welcome);
    else message("Welcome to " + game.title + ", by " + game.author);
};

var enterRoom = function(room) {
    d("entering room " + room);
    actor.room = room;
    room = game.rooms[room];
    if(room.welcome) message(room.welcome);
    else message("You enter " + room.name + "...");
    actor.roomdata = room;
    d("entered room");
}

$(document).ready(function() {
    d("cave v0.0.1 starting up, loading data at /game.json");
    $.get("/game.json", function(data) {
        game = data;
        d("game data loaded.");
        actor = new Character();
        welcome();
        enterRoom("default");
    });
});
