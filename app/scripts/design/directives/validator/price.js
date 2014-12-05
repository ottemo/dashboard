(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {

        var re = new RegExp("^\\d*\\.*\\d{0,2}$", "");
        var priceNotValid = "not valid price";

        designModule
            .directive("price", function () {
                return {
                    restrict: 'EA',
                    terminal: true,
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ngModel) {
                        //For DOM -> model validation
                        ngModel.$parsers.unshift(function (value) {
                            var valid = re.test(value);
                            ngModel.$setValidity('price', valid);
                            ngModel.message = priceNotValid;
                            return valid ? value : undefined;
                        });

                        //For model -> DOM validation
                        ngModel.$formatters.unshift(function (value) {
                            var valid = re.test(value);
                            ngModel.$setValidity('price', valid);
                            ngModel.message = priceNotValid;
                            return value;
                        });
                    }
                };
            });
    });
})(window.define);