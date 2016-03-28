/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('coreModule')

.directive('otText', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/core/directives/editor/text.html',

        controller: ['$scope', function() {}]
    };
}]);

