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
    this.inventory = [];
    this.room = "__none__";
    this.roomdata = {};
    return this;
};

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

var observe = function() {
    d("observing current room");
    if(actor.roomdata.desc) message(actor.roomdata.desc);
    else message("You see nothing special about " + room.name + ".");
    d("observed current room");
};

var mover = function(d) {
    var move = function() {
        if(actor.roomdata.neighbors && actor.roomdata.neighbors[d])
            enterRoom(actor.roomdata.neighbors[d]);
        else
            message("There doesn't seem to be a room there.");
    }
    return move;
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

// magic parsing and stuff
commands = {
    observe: observe,
    north: mover("north"),
    south: mover("south"),
    east: mover("east"),
    west: mover("west")
}
function parse(thing) {
    thing = thing.split(" ");
    if (Object.keys(commands).indexOf(thing[0]) > -1)
        commands[thing[0]](thing.slice(1))
    else
        message("Unknown command " + thing[0]);
}
function handlekey(e) {
    if(!e) e = window.event;
    if(e.keyCode != 13) return;
    var v = $("#entry").val();
    $("#entry").val("");
    parse(v);
}
