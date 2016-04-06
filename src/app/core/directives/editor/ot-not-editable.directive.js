/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('coreModule')

.directive('otNotEditable', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/core/directives/editor/ot-not-editable.html',

        controller: ['$scope', function() {

        }]
    };
}]);

