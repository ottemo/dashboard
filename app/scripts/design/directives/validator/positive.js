(function (define) {
    "use strict";

    define(["design/init"], function (designModule) {

        var re = new RegExp("^[\\-]*[\\d]+[\\.\\d]*$", "");
        var integerNotValid = "not valid number";
        var positiveNotValid = "value should be more than zero";

        designModule.directive("otPositive", function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function (scope, elem, attrs, ngModel) {

                    var validate = function (value) {
                        var valid;
                        valid = re.test(value);
                        if(!valid){
                            ngModel.$setValidity('ot-positive', valid);
                            if (!valid) {
                                ngModel.message = integerNotValid;
                            }

                            return value;
                        }

                        valid = parseFloat(value) >= 0;
                        ngModel.$setValidity('ot-positive', valid);
                        if (!valid) {
                            ngModel.message = positiveNotValid;
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