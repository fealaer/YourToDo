var crypto = require('crypto'),
    async = require('async'),
    util = require('util'),
    AuthError = require('../error').AuthError,
    ValidationError = require('../error').ValidationError;

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: 'Username is required'
  },
  hashedPassword: {
    type: String
  },
  salt: {
    type: String
  }
}, { versionKey: false });

schema.pre('validate', function (next) {
  if (!this.hashedPassword)
    this.invalidate('password', 'Password is required');
  next();
});

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('userId')
    .get(function () {
      return this.id;
    });

schema.virtual('password')
    .set(function (password) {
      this._plainPassword = password;
      this.salt = Math.random();
      this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
      return this._plainPassword;
    });

schema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.register = function (username, password, callback) {
  var User = this;
  var validationError = new ValidationError();
  if (!password) validationError.addError('password', 'Password is required');
  if (!username) validationError.addError('username', 'Username is required');
  if (validationError.getErrorsSize() !== 0) {
    callback(validationError);
  } else {
    async.waterfall([
      function (callback) {
        User.findOne({username: username}, {_id: 1, username: 1}, callback);
      },
      function (user, callback) {
        if (user) {
          callback(new AuthError(400, 'User with this username already exists'));
        } else {
          user = new User({username: username, password: password});
          user.save(function (err) {
            if (err) {
              callback(err);
            } else {
              callback(null, user);
            }
          });
        }
      }
    ], callback);
  }
};

schema.statics.authorize = function (username, password, callback) {
  var User = this;
  var validationError = new ValidationError();
  if (!password) validationError.addError('password', 'Password is required');
  if (!username) validationError.addError('username', 'Username is required');
  if (validationError.getErrorsSize() !== 0) {
    callback(validationError);
  } else {
    async.waterfall([
      function (callback) {
        User.findOne({username: username}, {_id: 1, username: 1, hashedPassword: 1, salt: 1}, callback);
      },
      function (user, callback) {
        if (user && user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError(400, 'Wrong username or password'));
        }
      }
    ], callback);
  }
};

module.exports = mongoose.model('User', schema);