angular.module('coreModule')

.directive('otPassword', [function() {
    return {
        restrict: 'EA',
        scope: {
            'attribute': '=editorScope',
            'item': '=item'
        },
        templateUrl: '/views/core/directives/editor/password.html'
    };
}]);

