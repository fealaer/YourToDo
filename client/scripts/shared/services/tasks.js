'use strict';

angular.module('sharedApp')
    .factory('Tasks', ['$resource',
      function ($resource) {
        return $resource('/api/v0/tasks/:_id', {}, {
          getByField: {method:'GET', url: '/api/v0/tasks/:field/:value', isArray:true},
          update: {method:'PUT', url: '/api/v0/tasks', isArray:false}
        });
      }]);
