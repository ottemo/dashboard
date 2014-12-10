(function (define) {
    "use strict";
    define(["design/init"], function (designModule) {

        var re = new RegExp("^\\d*\\.*\\d{0,2}$", "");
        var priceNotValid = "not valid price";

        designModule
            .directive("otPrice", function () {
                return {
                    restrict: 'A',
                    require: '?ngModel',
                    link: function (scope, elem, attrs, ngModel) {

                        var validate = function (value) {
                            var valid = re.test(value);
                            ngModel.$setValidity('ot-price', valid);
                            if (!valid) {
                                ngModel.message = priceNotValid;
                            }

                            return value;
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