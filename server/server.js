var express = require('express');
var path = require('path');
var cors = require('cors');
var dbpath = require('./libs/db');
var log = require('./libs/log')(module);
var app = express();
MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(db.url, (err, database) => {
//     if (err) return console.log(err)
//     require('./app/routes')(app, database);
// app.listen(port, () => {
//     console.log('We are live on ' + port);
// });
// });
var db;
MongoClient.connect(dbpath.url, function (err, database) {
   if(err){
       return log.error(err)
   }
    db = database;
    log.info("DB connected");
});

//var FileModel = require('./libs/mongoose').FileModel;
//var UserModel = require('./libs/mongoose').UserModel;
//var FolderModel = require('./libs/mongoose').FolderModel;


app.use(cors());

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

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1337');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

    return;
});

//500
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

    return;
});

//------------------------ User section ------------------------
//login func, search by Login name
app.get('/api/users/:login/', function (req, res) {
    //find a record in DB with @login credentials
    //json with username and password must be sent
    res.send({mess: 'login is correct', user: req.params.login, pass: req.params.pass});
});


//------------------------ Files section ------------------------
//user's list of files
app.get('/api/users/:user_id/files', function (req, res) {
    //json with list of user's files and folders
    db.collection('Files').find({'user': req.params.user_id}).toArray(function (err, items) {
        if (err){
            res.statusCode = 500;
            log.error('Internal error(%d)" %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        } else{
            res.statusCode = 200;
            res.send(items);
        }
    });
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
    var ObjectID = require('mongodb').ObjectID;
    db.collection('Files', function (err, collection) {
        collection.deleteOne({'_id': new ObjectID(req.params.file_id), 'user': req.params.user_id}, function (err, result) {
            collection.findOne({'_id': new ObjectID(req.params.file_id), 'user': req.params.user_id}, function (err, result) {
                if (err){
                    res.statusCode = 500;
                    res.send('Internal error');
                } else {
                    res.statusCode = 200;
                    res.send('File was successfully removed');
                }
            });
        });
    });
    //res.send('file was successfully deleted');
});

//get certain file
app.get('/api/users/:user_id/files/:file_id', function (req, res) {
    //json with list of user's files and folders
    var ObjectID = require('mongodb').ObjectID;
    db.collection('Files').findOne({'_id': ObjectID(req.params.file_id)}, function (err, result) {
        res.send({'obj': req.params.file_id, 'objid': ObjectID(req.params.file_id), 'res':result});
    });
    //res.send('file got successfully');
});


//------------------------ Folders section ------------------------
//delete user's certain folder with files
app.delete('/api/users/:user_id/folders/:folder_name' ,function (req, res) {
    //search files, which contains @folder_name in their objects and also delete this files
    res.send('folder was successfully deleted');
});

app.post('/api/users/:user_id/folders/:folder_name' ,function (req, res) {
    //search files, which contains @folder_name in their objects and also delete this files
    res.send('folder was successfully created');
});

app.put('/api/users/:user_id/folders/:folder_name' ,function (req, res) {
    //search files, which contains @folder_name in their objects and also delete this files
    res.send('folder was successfully patched');
});


app.get('/api', function (req, res) {
    res.send('API is running');
});

//noinspection JSDeprecatedSymbols