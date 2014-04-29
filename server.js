var connect = require('connect');
connect().use(connect.static(__dirname)).listen(process.env.PORT || 5001);
console.log("server started");
