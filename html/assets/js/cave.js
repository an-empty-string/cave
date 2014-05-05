// cave
// a text adventure engine, by Fox Wilson

var settings = {
    debug: true
};

var strings = {
    welcome_to: "Welcome to ",
    author_is: ", by ",
    you_enter: "You enter ",
    nothing_special: "You see nothing special about ",
    no_room_here: "There doesn't seem to be a room there.",
    unknown_command: "I don't know how to do that.",
    empty_inventory: "Your inventory is empty."
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
    else message(strings.welcome_to + game.title + strings.author_is + game.author);
};

var enterRoom = function(room) {
    d("entering room " + room);
    actor.room = room;
    room = game.rooms[room];
    if(room.welcome) message(room.welcome);
    else message(strings.you_enter + room.name + "...");
    actor.roomdata = room;
    d("entered room");
}

var observe = function() {
    d("observing current room");
    if(actor.roomdata.desc) message(actor.roomdata.desc);
    else message(strings.nothing_special + room.name + ".");
    d("observed current room");
};

var mover = function(dir) {
    d("generating mover for " + dir);
    var move = function() {
        if(actor.roomdata.neighbors && actor.roomdata.neighbors[dir])
            enterRoom(actor.roomdata.neighbors[dir]);
        else
            message(strings.no_room_here);
    }
    return move;
}

var inv = function() {
    if(actor.inventory.length)
        message(actor.inventory.map(function(x){return x.name;}).join(", "));
    else
        message(strings.empty_inventory);
};

$(document).ready(function() {
    d("cave v0.0.1 starting up, loading data at /game.json");
    d("trying to fetch localizations at lang.json");
    $.get("/lang.json", function(data) {
        for(var key in data) {
            strings[key] = data[key];
        }
    });
    $.get("/game.json", function(data) {
        game = data;
        d("game data loaded.");
        actor = new Character();
        welcome();
        enterRoom("default");
    });
});

// magic parsing and stuff
var go_n = mover("north");
var go_s = mover("south");
var go_e = mover("east");
var go_w = mover("west");
commands = {
    observe: observe,
    north: go_n, n: go_n,
    south: go_s, s: go_s,
    east: go_e,  e: go_e,
    west: go_w,  w: go_w,
    inventory: inv, inv: inv, i: inv
}
function parse(thing) {
    thing = thing.split(" ");
    if (Object.keys(commands).indexOf(thing[0]) > -1)
        commands[thing[0]](thing.slice(1))
    else
        message(strings.unknown_command);
}
function handlekey(e) {
    if(!e) e = window.event;
    if(e.keyCode != 13) return;
    var v = $("#entry").val();
    $("#entry").val("");
    parse(v);
}
