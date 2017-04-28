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

//login func, search by Login name
app.get('/api/users/:login', function (req, res) {
    //find a record in DB with @login credentials
    //json with username and password must be sent
    res.send('login is correct');
});

//user's list of files
app.get('/api/users/:user_id/files', function (req, res) {
    //json with list of user's files and folders
    res.send('list of files got successfully');
});

//add uploaded file to user's directory and DB
app.post('/api/users/:user_id/files', function (req, res) {
    res.send('file was successfully uploaded');
});

//update certain file
app.put('/api/users/:user_id/files/:file_id', function (req, res) {
    res.send('file was successfully updated');
});

//delete certain file
app.delete('/api/users/:user_id/files/:file_id', function (req, res) {
    res.send('file was successfully deleted');
});

//get file
app.get('/api/users/:user_id/files/:file_id', function (req, res) {
    //json with list of user's files and folders
    res.send('file got successfully');
});

//delete user's certain folder with files
app.delete('/api/users/:user_id/folders/:folder_name' ,function (req, res) {
    //search files, which contains @folder_name in their objects and also delete this files
    res.send('folder was successfully deleted');
});


app.get('/api', function (req, res) {
    res.send('API is running');
});