angular.module("configModule")

.filter('otStoreDate', ['timezoneService', '$filter',
    function(timezoneService, $filter) {
        return function(input) {
            if (!input) return "";

            return $filter('date')(input, 'MM/dd/yyyy hh:mma', timezoneService.storeTz);
        }
    }
]);

