// =========================================================================
// REQUIRES & GLOBAL VARS
// =========================================================================

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var plivo = require('plivo-node');
var p = plivo.RestAPI(require('../config'));


var app = express();

// =========================================================================
// EXPRESS SET-UP
// =========================================================================

// views set-up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

// =========================================================================
// MAIN
// =========================================================================


//app = createApp();

// thisCall=makeCall();


// =========================================================================
// MAIN FUNCTIONS
// =========================================================================



// Create new application
function createApp(){

    var params = {};

    params = {
        'app_name': 'plivideo1',
        'answer_url' : 'http://imadeatest.com:3002/answer_url',
        'answer_method' : 'POST',
        'hangup_url' : 'http://imadeatest.com:3002/hangup_url',
        'hangup_method' : 'POST',
        'fallback_url' : 'http://imadeatest.com:3002/fallback_url',
        'fallback_method' : 'POST',
    };

    p.create_application(params, function(status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });

};

// Make a call
function makeCall() {

    console.log("Making the call!");

    var params = {
        from: '17852929203',
        to: '16463712714',
        answer_url: 'http://imadeatest.com:3002/answer_url',
    };

    p.make_call(params, function(status, response) {
        if (status >= 200 && status < 300) {
            console.log('Successfully made call request.');
            console.log('Response:', response);
        } else {
            console.log('Oops! Something went wrong.');
            console.log('Status:', status);
            console.log('Response:', response);
        }
    });

}


module.exports = app;
