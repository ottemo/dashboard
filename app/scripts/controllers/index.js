define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.controllers.IndexCtrl', [])
    .controller('IndexCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
