(function (define) {
    'use strict';
    define(['angular'], function (angular) {
        angular.module('dashboardApp.directives.VisitorList', [])
            .directive('visitorList', function () {
                return {
                    templateUrl: 'views/visitor/list.html',
                    restrict: 'E',
                    scope: true,
                    controller: function ($scope) {
                        /**
                         * @todo utilize a constant here
                         */
                        $scope.$on('change.the.browse.view', function (event, value) {
                            $scope.activeView = value;
                        });
                        $scope.activeView = 'list';
                    }
                };
            });
    });
})(window.define);
