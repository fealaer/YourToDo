var express = require('express'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    log = require('./lib/log')(module),
    oauth2 = require('./lib/oauth2'),
    passport = require('passport'),
    HttpError = require('./error').HttpError;

var app = express();

// all environments
app.set('port', process.env.PORT || config.get('port'));
var ENV = app.get('env');

if ('production' === ENV) {
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, '../dist'), { maxAge: 86400000 }));
  app.set('views', path.join(__dirname, '../dist'));
  app.use(express.logger('default'));
} else {
  app.use(express.static(path.join(__dirname, '../client')));
  app.set('views', path.join(__dirname, '../client'));
  app.use(express.logger('dev'));
}

app.use(express.bodyParser());
app.use(express.cookieParser(config.get('cookieSecret')));
app.use(passport.initialize());
app.use(express.methodOverride());

require('./lib/auth');
var mongoose = require('./lib/mongoose');

if ('production' !== ENV) {
  mongoose.set('debug', true);
}

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/checkDB'));

//var mongoStore = require('./lib/mongoStore');
//var store = mongoStore.createMongoStore(express, mongoose);
//
//app.use(express.session({
//  secret: config.get('session:secret'),
//  key: config.get('session:key'),
//  cookie: config.get('session:cookie'),
//  rolling: config.get('session:rolling'),
//  store: store
//}));
//
//app.use(require('./middleware/loadUser'));
app.use(app.router);

require('./routes')(app);

app.use(appErrorHandler());

function appErrorHandler() {
  return function (err, req, res, next) {
    if (typeof err === 'number') {
      err = new HttpError(err);
    }
    if (err instanceof HttpError && res) {
      res.sendHttpError(err);
    } else {
      if (res) {
        log.error(err.message, err);
        err = new HttpError(500);
        res.sendHttpError(err);
      } else {
        log.error(err.stack);
      }
    }
  };
}

process.on('uncaughtException', function (err) {
  log.error('Uncaught Exception: ' + err.message);
  log.error(err.stack);
});

http.createServer(app).listen(app.get('port'), function () {
  log.info('Express server listening on port ' + app.get('port'));
});