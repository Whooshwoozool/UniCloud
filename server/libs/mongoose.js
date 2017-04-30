var log = require('./log')(module);
var dbpath = require('./db');
var mongoose = require('mongoose');

mongoose.connect(dbpath.url);
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

var File = new Schema({
    title: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: Date, default: Date.now },
    size: {type: Number, required: true},
    extention: { type: String, required: true },
    folder : { type: String, default: 'Main'}
});

var User = new Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    diskSize: { type: String, required: true }
});

var Folder = new Schema({
    user: { type: String, required: true },
    folderName: { type: String, required: true}
});

var FileModel = mongoose.model('File', File);
var UserModel = mongoose.model('File', File);
var FolderModel = mongoose.model('File', File);

module.exports.FileModel = FileModel;
module.exports.UserModel = UserModel;
module.exports.FolderModel = FolderModel;
