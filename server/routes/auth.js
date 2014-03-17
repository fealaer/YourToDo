var User = require('../models/user'),
    AccessToken = require('../models/accessToken'),
    RefreshToken = require('../models/refreshToken'),
    JsonResponse = require('../helpers/json/response');

function returnUser(req, res, user) {
  user = JSON.parse(JSON.stringify(user));
  delete user['hashedPassword'];
  delete user['salt'];
  res.json(new JsonResponse(null, user));
}
module.exports.register = function (req, res, next) {
  var rawData = req.body.data || req.body;
  var username = rawData.username;
  var password = rawData.password;

  User.register(username, password, function (err, user) {
    if (err) next(err);
    else returnUser(req, res, user);
  });
};

module.exports.logIn = function (req, res, next) {
  var rawData = req.body.data || req.body;
  var username = rawData.username;
  var password = rawData.password;

  User.authorize(username, password, function (err, user) {
    if (err) next(err);
    else returnUser(req, res, user);
  });
};

module.exports.logOut = function(req, res, next) {
  var rawData = req.body.data || req.body;
  if (rawData.userId) {
    AccessToken.remove({userId: rawData.userId}, function (err, affected) {
      if (err) next(err);
    });
    RefreshToken.remove({userId: rawData.userId}, function (err, affected) {
      if (err) next(err);
    });
  }
  if (req.session) req.session.destroy();
  res.json(new JsonResponse(null, {}));
};
