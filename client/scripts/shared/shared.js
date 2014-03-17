'use strict';

angular.module('LocalStorageModule').value('prefix', 'sharedApp');
angular.module('sharedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'LocalStorageModule'
]);
