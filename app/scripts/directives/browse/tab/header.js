define(['angular'], function (angular) {
  'use strict';

  angular.module('dashboardApp.directives.BrowseTabHeader', [])
    .directive('browseTabHeader', function () {
      return {
        scope: true,
        templateUrl: 'views/browse/tab/header.html',
        link: function(scope, element, attributes) {
          scope.activeTab = 0;
          for (var i = 0; i < scope.tabs.length; i += 1) {
            if (attributes.activeTab  == scope.tabs[i].name) {
              scope.activeTab = i;
              break;
            }
          }
        },
        controller: function($scope) {
          $scope.tabs = [
            {
              name: 'visitors',
              img: 'images/icon-visitor.png',
              url: '/dashboard/visitor'
            },
            {
              name: 'products',
              img: 'images/icon-product.png',
              url: '/dashboard/product'
            },
            {
              name: 'help',
              img: 'images/icon-help.jpg',
              url: '/dashboard/help'
            }
          ]
        },
        restrict: 'E'
      };
    });
});