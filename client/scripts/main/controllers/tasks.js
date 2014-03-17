'use strict';

angular.module('mainApp')
    .controller('TasksCtrl', ['$scope', '$location', 'Auth', 'Tasks',
      function ($scope, $location, Auth, Tasks) {
        $scope.user = Auth.getUser();
        Auth.subscribe($scope, function () {
          $scope.user = Auth.getUser();
        });

        $scope.signOutBtn = function () {
          Auth.signOut(function (err, res) {
            if (err) {
              $scope.error = {error: true, message: err.message};
            } else {
              $location.path('/signIn');
            }
          });
        };
        var defaultTask = {
          userId: $scope.user._id,
          task: '',
          priority: 'low',
          status: false
        };

        $scope.tasks = [];

        $scope.submit = function (data) {
          if (!data._id) {
            $scope.add(data);
          } else {
            $scope.edit(data);
          }
        };

        $scope.add = function (data) {
          data.userId = $scope.user._id;
          var headers = {};
          Auth.getToken(function (err, res) {
            if (!err) headers = {Authorization: res};
            Tasks(headers).save(data).$promise.then(function (api) {
              if (api.status.code === 200) {
                $scope.tasks.pop();
                $scope.tasks.push(api.result);
                $scope.tasks.push(angular.copy(defaultTask));
              }
            });
          });
        };

        $scope.edit = function (data) {
          var headers = {};
          Auth.getToken(function (err, res) {
            if (!err) headers = {Authorization: res};
            Tasks(headers).update(data).$promise.then(function (api) {
              if (api.status.code === 200) {

              }
            });
          });
        };

        $scope.delete = function (data) {
          var headers = {};
          Auth.getToken(function (err, res) {
            if (!err) headers = {Authorization: res};
            Tasks(headers).delete({_id: data._id, userId: $scope.user._id}).$promise.then(function (api) {
              if (api.status.code === 200) {
                var i = $scope.tasks.indexOf(data);
                if (i != -1) {
                  $scope.tasks.splice(i, 1);
                }
              }
            });
          });
        };
        function refresh() {
          var headers = {};
          Auth.getToken(function (err, res) {
            if (!err) headers = {Authorization: res};
            Tasks(headers).queryByField({field: 'userId', value: $scope.user._id}).$promise.then(function (api) {
              if (api.status.code === 200) {
                $scope.tasks = api.result;
                $scope.tasks.push(angular.copy(defaultTask));
              }
            });
          });
        }

        refresh();

      }]);
