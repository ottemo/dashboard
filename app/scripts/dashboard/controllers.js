(function (define) {
    'use strict';

    define(['dashboard/init'], function (dashboardModule) {

        dashboardModule
            /*
             *  HTML top page header manipulator (direct service mapping)
             */
            .controller('dashboardHeaderController', ['$scope', '$dashboardHeaderService', function ($scope, $dashboardHeaderService) {
                $scope.it = $dashboardHeaderService;
                $scope.leftMenu= $dashboardHeaderService.getMenuLeft();
                $scope.rightMenu = $dashboardHeaderService.getMenuRight();
            }])

            .controller('dashboardSidebarController', ['$scope', '$dashboardSidebarService', function ($scope, $dashboardSidebarService) {
                $scope.it = $dashboardSidebarService;
                $scope.items = $dashboardSidebarService.getItems();
            }])

            .controller('dashboardController', ['$scope', '$loginService', function($scope) {
                $scope.x = 'dashboardController';
            }]);

        return dashboardModule;
    });
})(window.define);