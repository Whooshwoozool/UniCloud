var express = require('express');
var path = require('path');
var log = require('./libs/log')(module);
var app = express();


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "./")));




//routes
app.listen(1337, function(){
	log.info('Express app running on port 1337');
});



app.get('/api', function (req, res) {
    res.send('API is running');
});