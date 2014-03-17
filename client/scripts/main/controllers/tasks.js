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
        $scope.tasks = [];


        $scope.submit = function (data, type) {
          switch (type) {
            case 'add':
              $scope.add(data);
              break;
            case 'edit':
              $scope.edit(data);
              break;
          }
        };

        $scope.add = function (data) {
          var newPage = new Tasks(data);
          newPage.$save().then(function (api) {
            if (api.status.code === 200) {
              // TODO add msg for user
              $location.path($location.path() + '/' + api.result.path + '/edit');
            }
          });
        };

        $scope.edit = function (data) {
          Tasks.update(data).$promise.then(function (api) {
            if (api.status.code === 200) {
              // TODO add msg for user
              refresh();
            }
          });
        };

        $scope.delete = function (data) {
          Tasks.delete({_id: data._id}).$promise.then(function (api) {
            if (api.status.code === 200) {
              // TODO add msg for user
              $location.path('/tasks');
            }
          });
        };


      }]);
