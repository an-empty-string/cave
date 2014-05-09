require('connect')().use(require('connect').static(__dirname + '/html')).listen(process.env.PORT || 5001);
