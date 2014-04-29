var connect = require('connect');
connect().use(connect.static(__dirname + '/html')).listen(process.env.PORT || 5001);
console.log("server started on port " + (process.env.PORT || 5001));
