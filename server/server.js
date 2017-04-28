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


//listen
app.listen(1337, function(){
	log.info('Express app running on port 1337');
});

//----------Routes----------

//404
app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

//500
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});


app.get('/api', function (req, res) {
    res.send('API is running');
});