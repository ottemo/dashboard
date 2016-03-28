/**
 *  Directive used for automatic attributes editor form creation
 */
angular.module('coreModule')

.directive('otFormBuilder', [function() {
    return {
        restrict: 'E',
        scope: {
            'parent': '=object',
            'item': '=item',
            'attributes': '=attributes'
        },
        templateUrl: '/views/core/directives/form-builder.html',
        controller: ['$scope',
            function($scope) {
                if (typeof $scope.parent === 'undefined') {
                    $scope.parent = {};
                }
            }
        ]
    };
}]);

