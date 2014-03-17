var AuthError = require('../error').AuthError,
    JsonResponse = require('../helpers/json/response');

module.exports = function(req, res, next) {
  var rawData = req.body.data || req.body;
  if (req.params) {
    if (req.params.value && req.params.field === 'userId') rawData.userId = req.params.value;
    if (req.params.userId) rawData.userId = req.params.userId;
  }
  if (!req.user || !req.user.userId || req.user.userId != rawData.userId) {
    return next(new AuthError(401, 'You aren\'t authorized'));
  }
  next();
};