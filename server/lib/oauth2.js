var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    crypto = require('crypto'),
    config = require('../config'),
    User = require('../models/user'),
    Client = require('../models/client'),
    AccessToken = require('../models/accessToken'),
    RefreshToken = require('../models/refreshToken');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (!user.checkPassword(password)) {
      return done(null, false);
    }

    RefreshToken.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
      if (err) return done(err);
    });
    AccessToken.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
      if (err) return done(err);
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');
    var refreshTokenValue = crypto.randomBytes(32).toString('base64');
    var token = new AccessToken({ token: tokenValue, clientId: client.clientId, userId: user.userId });
    var refreshToken = new RefreshToken({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
    refreshToken.save(function (err) {
      if (err) {
        return done(err);
      }
    });
    var info = { scope: '*' }
    token.save(function (err, token) {
      if (err) {
        return done(err);
      }
      done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
    });
  });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
  RefreshToken.findOne({ token: refreshToken }, function (err, token) {
    if (err) {
      return done(err);
    }
    if (!token) {
      return done(null, false);
    }
    if (!token) {
      return done(null, false);
    }

    User.findById(token.userId, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      RefreshToken.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
        if (err) return done(err);
      });
      AccessToken.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
        if (err) return done(err);
      });

      var tokenValue = crypto.randomBytes(32).toString('base64');
      var refreshTokenValue = crypto.randomBytes(32).toString('base64');
      var token = new AccessToken({ token: tokenValue, clientId: client.clientId, userId: user.userId });
      var refreshToken = new RefreshToken({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
      refreshToken.save(function (err) {
        if (err) {
          return done(err);
        }
      });
      var info = { scope: '*' }
      token.save(function (err, token) {
        if (err) {
          return done(err);
        }
        done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
      });
    });
  });
}));


// token endpoint
exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
]