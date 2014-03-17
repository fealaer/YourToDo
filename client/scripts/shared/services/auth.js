'use strict';

angular.module('sharedApp')
    .service('Auth', ['$rootScope', '$http', '$cookies', 'localStorageService',
      function Auth($rootScope, $http, $cookies, localStorageService) {
        this.eventName = 'Auth.changes';
        var client_id = 'webAppV1';
        var client_secret = 'verySmallSecret';
        var user = {};
        Auth.prototype.isLoggedIn = function () {
          return localStorageService.get('user') ? true : false;
        };
        Auth.prototype.getUser = function () {
          return localStorageService.get('user') || user;
        };
        Auth.prototype.signUp = function (data, callback) {
          $http.post('/register', data).success(function (result) {
            if (result.status.code !== 200) {
              callback(result.error, null);
            } else {
              Auth.prototype.createToken(data, function (err) {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, result.result);
                  localStorageService.set('user', result.result);
                  Auth.prototype.broadcast();
                }
              });
            }
          });
        };
        Auth.prototype.signIn = function (data, callback) {
          $http.post('/login', data).success(function (result) {
            if (result.status.code !== 200) {
              callback(result.error, null);
            } else {
              Auth.prototype.createToken(data, function (err) {
                if (err) {
                  callback(err, null);
                } else {
                  localStorageService.set('user', result.result);
                  callback(null, result.result);
                  Auth.prototype.broadcast();
                }
              });
            }
          });
        };
        Auth.prototype.signOut = function (callback) {
          var data = {userId: localStorageService.get('user')._id};
          $http.post('/logout', data).success(function (result) {
            if (result.status.code !== 200) {
              callback(result.error, null);
            } else {
              clearAuthData();
              Auth.prototype.broadcast();
              callback(null, result.result);
            }
          });
        };
        Auth.prototype.createToken = function (data, callback) {
          data.grant_type = 'password';
          data.client_id = client_id;
          data.client_secret = client_secret;
          $http.post('/oauth/token', data).success(function (result) {
            if (result.error) {
              callback(result.error, null);
            } else {
              result.expired_at = expiredAt(result.expires_in);
              localStorageService.set('tokens', result);
              callback(null, result);
            }
          });
        };

        Auth.prototype.refreshToken = function (callback) {
          var data = {
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_secret
          };
          data.refresh_token = localStorageService.get('tokens').refresh_token;
          $http.post('/oauth/token', data).success(function (result) {
            if (result.error) {
              callback(result.error, null);
            } else {
              result.expired_at = expiredAt(result.expires_in);
              localStorageService.set('tokens', result);
              callback(null, result);
            }
          });
        };
        Auth.prototype.subscribe = function ($scope, callback) {
          $scope.$on(Auth.eventName, callback);
        };
        Auth.prototype.broadcast = function () {
          $rootScope.$broadcast(Auth.eventName);
        };
        Auth.prototype.getToken = function (callback) {
          var tokens = localStorageService.get('tokens');
          if (!tokens) {
            callback({}, null);
          } else if (tokens.expired_at < (new Date()).getTime()) {
            Auth.prototype.refreshToken(function(err, res) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, res.token_type + ' ' + res.access_token);
              }
            });
          } else {
            callback(null, tokens.token_type + ' ' + tokens.access_token);
          }
        };
        function expiredAt(expires_in) {
          return (new Date((new Date()).getTime() + (expires_in - 300) * 1000)).getTime();
        }

        function clearAuthData() {
          localStorageService.remove('user');
          localStorageService.remove('tokens');
        }
      }]);
