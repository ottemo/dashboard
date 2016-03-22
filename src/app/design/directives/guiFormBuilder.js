/**
 *  Directive used for automatic attributes editor form creation
 */
angular.module('designModule')

.directive('guiFormBuilder', [function() {
    return {
        restrict: 'E',
        scope: {
            'parent': '=object',
            'item': '=item',
            'attributes': '=attributes'
        },
        templateUrl: '/views/design/gui/formBuilder.html',
        controller: ['$scope',
            function($scope) {
                if (typeof $scope.parent === 'undefined') {
                    $scope.parent = {};
                }
            }
        ]
    };
}]);

