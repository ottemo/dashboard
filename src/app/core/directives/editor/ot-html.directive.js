/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('coreModule')

.directive('otHtml', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/core/directives/editor/ot-html.html'
    };
}]);

