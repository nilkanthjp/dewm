var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var paths = require('dewm-paths');

// Declare global dewm variable
dewm = require('dewm');

// Database
var mongo = require('mongoskin');
var db = mongo.db(paths.mongo.host+paths.mongo.db, {native_parser:true});

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var dewmroute = require('./routes/dewm');
var admin = require('./routes/admin');
var views = require('./routes/views');
var comments = require('./routes/comments');
var assignments = require('./routes/assignments');

var app = express();
var router = express.Router();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', 1);
app.set('env','development');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session + Cookies setup
var session = require("express-session")({ secret: 'keyboard', resave: false, saveUninitialized: true, cookie: { maxAge: 36000000, httpOnly: true } })
app.use(cookieParser());
app.use(session);

// Give the server access to Tablet Orange and Green files as well as common public files
app.use(express.static(paths.orangeRoot));
app.use(express.static(paths.greenRoot));
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/dewm', dewmroute);
app.use('/admin', admin);
app.use('/views', views);
app.use('/comments', comments);
app.use('/assignments', assignments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start the server for push notifications
// var options = {
//     key: fs.readFileSync(__dirname + '/public/cert/key.pem'),
//     cert: fs.readFileSync(__dirname + '/public/cert/cert.pem'),
//     requestCert: false,
//     rejectUnauthorized: false
// };
// var server = https.createServer(options, app).listen(3000, function(){
//     dewm.initSocket(this,session);
// });
var server = app.listen(3000,function() { dewm.initSocket(this,session) });

module.exports = app;