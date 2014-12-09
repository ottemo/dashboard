(function (define) {
    'use strict';

    define(['design/init'], function (designModule) {

        /**
         * getClass(page)
         * setPage(page)
         * getPages()
         */
        designModule.directive('guiPaginator', ['$location', '$designService', function ($location, $designService) {
            return {
                restrict: 'E',
                scope: {
                    'parent': '=object'
                },
                templateUrl: $designService.getTemplate('design/gui/paginator.html')
            };
        }]);

        return designModule;
    });
})(window.define);
