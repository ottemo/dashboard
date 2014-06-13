(function (define) {
    'use strict';
    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.BrowseContainer', [])
            .directive('browseContainer', function () {
                return {
                    templateUrl: 'views/browse/container.html',
                    transclude: true,
                    restrict: 'E'
                };
            });
    });
})(window.define);
