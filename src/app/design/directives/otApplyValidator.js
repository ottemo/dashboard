
angular.module("designModule")

.directive("otApplyValidator", function ($parse, $compile) {

        var addValidator, link;

        addValidator = function (elem, validator) {
            var regExp, matches;
            if (validator !== "") {
                regExp = /(\w+)(\((.*)\))*/g;

                matches = regExp.exec(validator);

                if (matches.length > 1 && typeof matches[3] !== "undefined") {
                    elem.attr("ot-" + matches[1], matches[3]);
                } else {
                    elem.attr("ot-" + matches[1], "true");
                }
            }
        };

        link = function ($scope, elem) {

            var validatorStr = $parse(elem.attr('ot-apply-validator'))($scope) || "";

            if (typeof validatorStr !== "string" && validatorStr !== "") {
                return true;
            }

            var i, validatorList, validator;
            validatorList = validatorStr.split(/[ ]/);

            for (i = 0; i < validatorList.length; i += 1) {
                validator = validatorList[i];
                addValidator(elem, validator);

            }

            elem.removeAttr("ot-apply-validator");
            $compile(elem, null, 10000)($scope);
        };


        return({
            link: link,
            priority: 10000,
            restrict: "A",
            terminal: true
        });

    });