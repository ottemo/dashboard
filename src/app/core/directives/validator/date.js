angular.module("coreModule")

.directive("otDate", function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ngModel) {
			var dateNotValid = "Please enter a valid date (mm/dd/yyyy)";

            var validate = function (value) {
                var date = new Date(value);
                var valid = (!isNaN(date) && value.length === 10);
                ngModel.$setValidity('ot-date', valid);
                if (!valid) {
                    ngModel.message = dateNotValid;
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
