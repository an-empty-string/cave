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
    win: "YOU'RE WINNER !",
    lose: "YOU'RE NOT WINNER !",
    ach: "YOU GET ACHIEVEMENT: "
};

var game = {};
var gameover = false;
var message = function(msg){$(".well").append(msg + "<br />");};
var d = function(m){if(settings.debug)message("<small><small><i>debug: " + m + "</i></small></small>");};
var actor = null;
var Character = function() {
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
    if(room.hooks && room.hooks.preEntry) eval(room.hooks.preEntry);
    if(room.welcome) message(room.welcome);
    else message(strings.you_enter + room.name + "...");
    actor.roomdata = room;
    if(room.items && room.items.length)
        message(strings.things_here + room.items.map(function(x){return x.name;}).join(", "));
    if(room.hooks && room.hooks.postEntry) eval(room.hooks.postEntry);
    d("entered room");
}

var observe = function() {
    d("observing current room");
    if(actor.roomdata.desc) message(actor.roomdata.desc);
    else message(strings.nothing_special + room.name + ".");
    if(actor.roomdata.items && actor.roomdata.items.length)
        message(strings.things_here + actor.roomdata.items.map(function(x){return x.name;}).join(", "));
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

var achieve = function(what) {
    d("achievement get: " + what);
    message(strings.ach + what);
}

var win = function() {
    d("won the game");
    message(strings.win);
    gameover = true;
    rollCredits();
};

var lose = function() {
    d("lost the game");
    message(strings.loser);
    gameover = true;
    rollCredits();
}

var rollCredits = function() { // :)
    setTimeout(function() {
        $("body").css("background-color", "black");
        $("body").css("font-size", "200%");
        $("body").html("<hr />");
        var n = 1;
        for(var i = 0; i < game.credits.length; i++) {
                $("body").append('<div class="row" style="color: white;"><div class="col-sm-6">' + game.credits[i][0] + '</div><div class="col-sm-6" style="text-align: right;">' + game.credits[i][1] + '</div></div><hr />');
        }
    }, 2000);
};

$(document).ready(function() {
    d("cave v0.0.1 starting up, loading data at /game.json");
    d("trying to fetch localizations at /lang.json");
    actor = new Character();
    console.log(actor);
    $.get("/lang.json", function(data) {
        for(var key in data) {
            strings[key] = data[key];
        }
    });
    $.get("/game.json", function(data) {
        game = data;
        d("game data loaded.");
        welcome();
        enterRoom("default");
    });
    d("the needful has been done!");
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
    // game-specific
    "continue": go_n,
    "cancel": go_s,
    "yes": go_e,
    "no": go_w,
    "вперед": go_n,
    "отменять": go_s,
    "да": go_e,
    //
    teleport: function(a) {
        enterRoom(a[0]);
    }
}
function parse(thing) {
    if(gameover) return;
    thing = thing.split(" ");
    if (Object.keys(commands).indexOf(thing[0]) > -1)
        commands[thing[0]](thing.slice(1))
    else
        message(strings.unknown_command);
    $(".well").scrollTop($(".well")[0].scrollHeight);
}
function handlekey(e) {
    if(!e) e = window.event;
    if(e.keyCode != 13) return;
    var v = $("#entry").val();
    $("#entry").val("");
    parse(v);
}
