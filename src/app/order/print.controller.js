angular.module('orderModule')

.controller('orderPrintController', [
    '$scope',
    '$location',
    '$q',
    '$timeout',
    'orderApiService',
    'cmsApiService',
    function($scope, $location, $q, $timeout, orderApiService, cmsApiService) {

        $scope.options = {
            showPrice: showPrice()
        };
        $scope.orders = [];

        var headerIdentifier = 'dash-order-print-header';
        var footerIdentifier = 'dash-order-print-footer';
        $scope.cms = {
            header: '',
            footer: ''
        };

        activate();

        ////////////////////////

        function activate() {
            var ids = $location.search().ids.split(',');

            var o = fetchOrders(ids);
            var c = fetchCmsHeader();
            $q.all([o,c]).then(function(){
                // introduce a delay so angular has time to render before we print
                $timeout(window.print, 500);
            });

        }

        // REFACTOR: We should just be making a single request to the server
        // http://api.ottemo.io/orders?_id=562125eb30dd91015200003d,5621252c30dd91015200001f
        // but right now the response from /orders is different than /order/:id
        function fetchOrders(ids) {
            var allPromises = ids.map(function(id) {
                var params = { 'orderID': id };
                return orderApiService.getOrder(params).$promise;
            });

            // Wait for all requests to complete
            return $q.all(allPromises).then(function(results) {
                    var orders = results.map(function(resp){
                        return resp.result;
                    });

                    $scope.orders = orders;
                });
        }

        // Fetch cms header details
        function fetchCmsHeader() {

            var params = {
                'identifier': [
                    headerIdentifier,
                    footerIdentifier,
                ].join(','),
                'extra': 'content',
            };

            return cmsApiService.blockList(params).$promise
                .then(function(resp) {
                    // Normalize response
                    if (resp.result) {
                        return resp.result || [];
                    }
                })
                .then(assignBlocks);

            function assignBlocks(blocks) {
                angular.forEach(blocks, function(block) {
                    if (block.Name === headerIdentifier) {
                        $scope.cms.header = block.Extra.content;
                    } else if( block.Name === footerIdentifier) {
                        $scope.cms.footer = block.Extra.content;
                    }
                });
            }
        }

        // By default show the price
        function showPrice() {
            var showPrice = true;
            if (angular.isDefined($location.search().price)) {
                showPrice = parseInt($location.search().price, 10);
            }

            return showPrice;
        }
    }
]);

