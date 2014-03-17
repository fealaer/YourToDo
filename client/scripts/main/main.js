'use strict';

angular.module('LocalStorageModule').value('prefix', 'mainApp');
angular.module('mainApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute',
      'LocalStorageModule',
      'ui.bootstrap',
      'sharedApp'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            templateUrl: '/views/main/tasks.html',
            controller: 'TasksCtrl'
          }).when('/signIn', {
            templateUrl: '/views/main/signIn.html',
            controller: 'AuthCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
    })
    .run(['$rootScope', '$location', '$http', 'Auth', function ($rootScope, $location, $http, Auth) {
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!Auth.isLoggedIn() && next.templateUrl !== '/views/main/signIn.html') $location.path('/signIn');
      });
    }]);
