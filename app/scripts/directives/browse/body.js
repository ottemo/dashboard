(function (define) {
    'use strict';
    define(['angular'], function (angular) {

        angular.module('dashboardApp.directives.BrowseBody', [])
            .directive('browseBody', function () {
                return {
                    templateUrl: 'views/browse/body.html',
                    transclude: true,
                    restrict: 'E'
                };
            });
    });
})(window.define);