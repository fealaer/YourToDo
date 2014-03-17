'use strict';

angular.module('LocalStorageModule').value('prefix', 'adminApp');
angular.module('adminApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute',
      'ngCookies',
      'LocalStorageModule',
      'ui.bootstrap',
      'ui.sortable',
      'sharedApp',
      'blueimp.fileupload'
    ])
    .config(['$routeProvider', '$httpProvider', 'fileUploadProvider',
      function ($routeProvider, $httpProvider, fileUploadProvider) {
        $routeProvider

            .otherwise({
              redirectTo: '/'
            });
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        fileUploadProvider.defaults.redirect = window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        );
        angular.extend(fileUploadProvider.defaults, {
          // Enable image resizing, except for Android and Opera,
          // which actually support image resizing, but fail to
          // send Blob objects via XHR requests:
          disableImageResize: /Android(?!.*Chrome)|Opera/
              .test(window.navigator.userAgent),
          maxFileSize: 10000000,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
      }])
    .run(['$rootScope', '$location', '$http', 'Auth', function ($rootScope, $location, $http, Auth) {
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
          if(!Auth.isLoggedIn() && next.templateUrl !== '/views/admin/signIn.html' ) $location.path('/signIn');
      });
    }]);
