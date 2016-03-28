angular.module("coreModule")

.directive('otRouteClass', [function() {
    return {
        restrict: 'A',
        link: function($scope, elem, iAttrs, controller) {
            var cssPrefix = 'route__';
            var routeRegex = new RegExp(cssPrefix + ".*", "g");

            $scope.$on('$routeChangeSuccess', function(e, current, previous) {
                // console.log('current', current);

                // Remove all classes that this module applies
                elem.removeClass(function(i, css) {
                    return (css.match(routeRegex) || []).join(' ');
                });

                // Adding Classes
                // NOTE: there is a load initially that doesn't have route info
                if (current.$$route) {

                    // controller class
                    if (current.$$route.controller) {
                        var ctrl = current.$$route.controller
                        ctrl = ctrl.toLowerCase();
                        ctrl = ctrl.replace('controller', '');

                        var newClass = cssPrefix + 'ctrl--';
                        newClass += ctrl;
                        elem.addClass(newClass);
                    }

                    // template class
                    if (current.$$route.templateUrl) {
                        var url = current.$$route.templateUrl
                        url = url.replace('/views/', ''); // strip the dir
                        url = url.replace('.html', '') // strip the extension
                        url = url.replace('/', '-'); // replace the slashes

                        var newClass = cssPrefix + 'tmpl--' + url;
                        elem.addClass(newClass);
                    }
                }
            });
        }
    };
}]);

