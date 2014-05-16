define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.BrowseController', [])
    .directive('browseController', function () {
      return {
        scope      : true,
        templateUrl: 'views/browse/controller.html',
        restrict   : 'E',
        controller : function ($rootScope, $scope) {
          var switchView, addNewEntity, searchEntity;
          /**
           * dispatches 'change.the.browse.view' event
           *
           * @todo use constants for the event name
           */
          switchView = function(view) {
            if ($scope.activeView == view) {
              return;
            }
            if (view == 'list' || view == 'tile') {
              $scope.activeView = view;
            } else {
              $scope.activeView = $scope.activeView == 'list' ? 'tile' : 'list';
            }
            $rootScope.$broadcast('change.the.browse.view', $scope.activeView);
          };

          /**
           *  dispatches 'add.new.entity' event
           *
           *  @todo use constants for the event name
           */
          addNewEntity = function() {
            $rootScope.$broadcast('add.new.entity', {});
          };

          /**
           * dispatches 'search.for.entity' event
           *
           * @param query {string}
           * @todo use constants for the event name
           */
          searchEntity = function(query) {
            $rootScope.$broadcast('search.for.entity', query);
          };

          $scope.addNewEntity = addNewEntity;
          $scope.switchView = switchView;
          $scope.searchEntity = searchEntity;
        }
      };
    });
});
