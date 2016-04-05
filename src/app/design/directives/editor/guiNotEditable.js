/**
 *  Directive used for automatic attribute editor creation
 */
angular.module('designModule')

.directive('guiNotEditable', [function() {
    return {
        restrict: 'E',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/design/gui/editor/notEditable.html',

        controller: ['$scope', function() {

        }]
    };
}]);

