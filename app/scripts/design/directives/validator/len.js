(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {

        var stringToShort = "Text length does not satisfy specified text range.";
        var stringToLong = "Text length does not satisfy specified text range.";

        designModule
            .directive("otLen", function () {
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    link: function (scope, elem, attrs, ngModel) {
                        var params = elem.attr('ot-len').split(",");

                        var validate = function (value) {
                            var valid;
                            if (typeof value !== "undefined" &&
                                value.length < params[0]) {
                                ngModel.message = stringToShort;
                                valid = false;
                            } else if (typeof value !== "undefined" && value.length > params[1]) {
                                ngModel.message = stringToLong;
                                valid = false;
                            } else {
                                valid = true;
                            }

                            ngModel.$setValidity('ot-len', valid);
                            return valid ? value : undefined;
                        };

                        //For DOM -> model validation
                        ngModel.$parsers.unshift(validate);
                        //For model -> DOM validation
                        ngModel.$formatters.unshift(validate);
                    }
                };
            });
    });
})(window.define);