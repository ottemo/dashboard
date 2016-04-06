angular.module('coreModule')

.directive('otMessageManager', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            'obj': '=item'
        },
        templateUrl: '/views/core/directives/ot-message-manager.html',
        link: function($scope) {
            var timeout;
            $scope.isShow = false;
            $scope.$watch('obj', function() {

                if (typeof $scope.obj !== 'undefined') {

                    $scope.msg = $scope.obj.message;
                    $scope.type = $scope.obj.type || 'success';
                    $scope.cssClass = 'alert-' + $scope.type;
                    $scope.isShow = true;
                    timeout = $scope.obj.timeout;

                    if (timeout > 0) {
                        $timeout(function() {
                            $scope.close();
                        }, 2000);
                    }
                }

            });

            $scope.close = function() {
                $scope.isShow = false;
                $scope.msg = false;
            };

        }
    };
}]);

