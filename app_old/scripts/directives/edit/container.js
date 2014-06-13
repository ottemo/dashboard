(function (define) {
    'use strict';
    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.EditContainer', [])
            .directive('editContainer', function () {
                return {
                    templateUrl: 'views/edit/container.html',
                    transclude: true,
                    restrict: 'E'
                };
            });
    });
})(window.define);
