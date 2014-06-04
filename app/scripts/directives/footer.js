(function (define) {
    'use strict';
    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.DashboardFooter', [])
            .directive('dashboardFooter', function () {
                return {
                    templateUrl: '../../views/footer/footer.html',
                    restrict: 'E'
                };
            });
    });
})(window.define);