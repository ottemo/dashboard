angular.module('dashboardModule')

.controller('dashboardMenuController', [
    '$scope',
    'menuService',
    'loginLoginService',
    '$rootScope',
    function($scope, menuService, loginLoginService, $rootScope) {
        $scope.user = loginLoginService;

        $scope.isMenuActive = false;
        $scope.items = menuService.items;
        $scope.closeAll = menuService.closeAll;

        $rootScope.$on('$locationChangeSuccess', function(){
            menuService.update();
            $scope.isMenuActive = false;
        });
    }
]);