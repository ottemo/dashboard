angular.module("configModule")

.directive('otStoreDate',
    ['timezoneService', '$filter',
    function(timezoneService, $filter) {
        return {
            restrict: 'EA',
            template: '{{localDate}}',
            scope: {
                'date' : '=',
            },
            link: function(scope, element, attrs) {

                scope.localDate = '';

                activate();

                ////////////////

                function activate() {
                    update();
                    scope.$watch('date', update);
                }

                function update() {
                    scope.localDate = scope.date ? 'Loading...' : '-';

                    if (!scope.date) {
                        return;
                    }

                    timezoneService.get().then(function(tz){
                        scope.localDate = $filter('date')(scope.date, 'MM/dd/yyyy hh:mma', tz);
                    });
                }
            }
        };
    }
]);

