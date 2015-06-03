var re = new RegExp("^[\\-]*[\\d]+$", "");
var integerNotValid = "Please enter a valid number in this field.";

angular.module("designModule")

.directive("otNumber", function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ngModel) {

            var validate = function (value) {
                var valid = re.test(value);
                ngModel.$setValidity('ot-number', valid);
                if (!valid) {
                    ngModel.message = integerNotValid;
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