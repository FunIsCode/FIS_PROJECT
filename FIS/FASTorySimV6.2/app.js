var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Main_Route = require('./routes/Main');
var user_Route = require('./routes/users');
var FMW_Route = require('./routes/FMW');
var instructions_Route = require('./routes/instructions');
var RTU_Route = require('./routes/RTU_1 event');
var about_Route = require('./routes/about');
var contacts_Route = require('./routes/contacts');
var License_Route = require('./routes/License');

var app = express();
	
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon-ico.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/style')));
app.use('/', Main_Route);
app.use('/FMW', FMW_Route);
app.use('/instructions', instructions_Route);
app.use('/RTU', RTU_Route);
app.use('/about', about_Route);
app.use('/license', License_Route);
app.use('/contacts', contacts_Route);
app.use('/RTUs', user_Route);


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


module.exports = app;
