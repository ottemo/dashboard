(function (define) {
    'use strict';

    define([
            'dashboard/init'
        ],
        function (dashboardModule) {

            dashboardModule
                /*
                 *  Directive to solve browser auto-fill issue on model
                 */
                .directive('autoFillSync', ['$timeout', function ($timeout) {
                    return {
                        require: 'ngModel',
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

                /*
                 *  jQuery layout directive
                 */
                .directive('jqLayout', function () {
                    return {
                        restrict: 'A',
                        link: function (scope, elem, attrs) {
                            jQuery(elem).layout({ applyDefaultStyles: true });
                        }
                    };
                });

            return dashboardModule;
        });

})(window.define);