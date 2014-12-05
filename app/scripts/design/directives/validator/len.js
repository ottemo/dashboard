(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {

        var stringToShort = "string too much short";
        var stringToLong = "string too much long";

        designModule
            .directive("len", function () {
                return {
                    restrict: 'EA',
                    terminal: true,
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ngModel) {
                        var params = elem.attr('len').split(",");

                        if (params.length > 1) {

                            //For DOM -> model validation
                            ngModel.$parsers.unshift(function (value) {
                                var valid;
                                if (typeof value !== "undefined" && value.length < params[0]) {
                                    ngModel.message = stringToShort;
                                    valid = false;
                                } else if (typeof value !== "undefined" && value.length > params[1]) {
                                    ngModel.message = stringToLong;
                                    valid = false;
                                } else {
                                    valid = true;
                                }
                                ngModel.$setValidity('len', valid);
                                return valid ? value : undefined;
                            });

                            //For model -> DOM validation
                            ngModel.$formatters.unshift(function (value) {
                                var valid;
                                if (typeof value !== "undefined" && value.length < params[0]) {
                                    ngModel.message = stringToShort;
                                    valid = false;
                                } else if (typeof value !== "undefined" && value.length > params[1]) {
                                    ngModel.message = stringToLong;
                                    valid = false;
                                } else {
                                    valid = true;
                                }
                                ngModel.$setValidity('len', valid);
                                return value;
                            });
                        }
                    }
                };
            });
    });
})(window.define);