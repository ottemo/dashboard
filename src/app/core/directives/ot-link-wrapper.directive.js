angular.module('coreModule')

    .directive('otLinkWrapper', [function() {
        return {
            restrict: 'AE',
            scope: {
                url: '=',
                showLink: '='
            },
            transclude: true,
            templateUrl: '/views/core/directives/ot-link-wrapper.directive.html'
        }
    }]);