'use strict';

angular.module('sharedApp')
    .factory('Tasks', ['$resource',
      function ($resource) {
        return function(customHeaders) {
          return $resource('/api/v0/tasks/:_id/:userId', {}, {
            save: {method:'POST', isArray:false, headers: customHeaders || {}},
            delete: {method:'DELETE', isArray:false, headers: customHeaders || {}},
            queryByField: {method:'GET', url: '/api/v0/tasks/:field/:value', isArray:false, headers: customHeaders || {}},
            update: {method:'PUT', url: '/api/v0/tasks', isArray:false, headers: customHeaders || {}}
          });
        }
      }]);
