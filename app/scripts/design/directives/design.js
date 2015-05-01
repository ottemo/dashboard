angular.module("designModule")

/**
*  Directive that allows to declare CSS inside module templates
*  (TODO: not working currently as html creation going before)
*/
.directive("addCss", ["$designService", function ($designService) {
    return {
        restrict: "E",
        link: function (scope, elem, attrs) {
            var cssFile = attrs.src;
            if (typeof cssFile !== "undefined" && cssFile !== "") {
                $designService.addCss(cssFile);
            }
        }
    };
}])

/**
*  Directive to solve browser auto-fill issue on model
*/
.directive("autoFillSync", ["$timeout", function ($timeout) {
    return {
        require: "ngModel",
        link: function (scope, elem, attrs, ngModel) {
            var origVal = elem.val();
            $timeout(function () {
                var newVal = elem.val();
                if (ngModel.$pristine && origVal !== newVal) {
                    ngModel.$setViewValue(newVal);
                }
            }, 500);
        }
    };
}])

/**
* Fix issue with the dynamic names fields in the form for validation form
*/
.directive('dynamicName', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-name'))(scope);
            elem.removeAttr('dynamic-name');
            elem.attr('name', name);
            $compile(elem)(scope);
        }
    };
})

/**
*  jQuery layout directive
*/
.directive("jqLayout", function () {
    return {
        restrict: "A",
        link: function (scope, elem) {
            jQuery(elem).layout({ applyDefaultStyles: true });
        }
    };
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive("otController", function () {
    return {
        scope: false,
        controller: "@",
        priority: 500
    };
})

.directive("otInclude", ["$designService", function ($designService) {
    return {
        restrict: "E",
        scope: false,
        templateUrl: function (element, attr) {
            return $designService.getTemplate(attr.src);
        }
        // controller: function (element, attr) { return attr.controller; }
    };
}])

.directive('errSrc', ["$rootScope", function ($rootScope) {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src !== attrs.errSrc) {
                    attrs.$set('src', $rootScope.getImg(attrs.errSrc));
                }
            });
        }
    };
}]);