/**
 * https://github.com/TheSharpieOne/angular-validation-match
 * attrs:
 *  ot-match="matchagainst"
 *  match-caseless
 *  not-match
 */
angular.module("coreModule")
    .directive("otMatch", ['$parse', function($parse) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    if (console && console.warn) {
                        console.warn('Match validation requires ngModel to be on the element');
                    }
                    return;
                }

                var matchGetter = $parse(attrs.otMatch);
                var caselessGetter = $parse(attrs.matchCaseless);
                var noMatchGetter = $parse(attrs.notMatch);

                scope.$watch(getMatchValue, function() {
                    ctrl.$$parseAndValidate();
                });

                ctrl.$validators.match = function() {
                    var match = getMatchValue();
                    var notMatch = noMatchGetter(scope);
                    var value;

                    if (caselessGetter(scope)) {
                        value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
                    } else {
                        value = ctrl.$viewValue === match;
                    }
                    value ^= notMatch;

                    return !!value;
                };

                function getMatchValue() {
                    var match = matchGetter(scope);
                    if (angular.isObject(match) && match.hasOwnProperty('$viewValue')) {
                        match = match.$viewValue;
                    }
                    return match;
                }
            }
        }
    }]);

