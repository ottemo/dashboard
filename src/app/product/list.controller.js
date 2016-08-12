angular.module("productModule")

.controller("productListController", [
"$scope",
"$location",
"$routeParams",
"$q",
"dashboardListService",
"productApiService",
"dashboardUtilsService",
"COUNT_ITEMS_PER_PAGE",
function ($scope, $location, $routeParams, $q, DashboardListService, productApiService,
          dashboardUtilsService, COUNT_ITEMS_PER_PAGE) {
    var serviceList, getProductsList, getAttributeList, getProductCount, showColumns;

    // Initialize SEO
    if (typeof $scope.initSeo === "function") {
        $scope.initSeo("product");
    }

    serviceList = new DashboardListService();
    showColumns = {
        'name' : {'type' : 'select-link', 'label' : 'Name'},
        'sku' : {},
        'enabled' : {}
        // 'price' : {},
        // 'weight' : {}
    };

    $scope.idsSelectedRows = {};
    $scope.fields = [
        {
            "attribute": "Image",
            "type": "image",
            "label": "",
            "visible": true
        }
    ];

    /**
     * Gets list of products
     */
    getProductsList = function () {
        var params = $location.search();
        params["extra"] = serviceList.getExtraFields();
        productApiService.productList(params).$promise.then(
            function (response) {
                var result, i;
                $scope.productsTmp = [];

                result = response.result || [];
                for (i = 0; i < result.length; i += 1) {
                    result[i].Name = result[i].Extra.name;
                    result[i].sku = result[i].Extra.sku;
                    $scope.productsTmp.push(result[i]);
                }
            }
        );
    };

    /**
     * Gets count products
     */
    getProductCount = function () {
        productApiService.getCount($location.search(), {}).$promise.then(function (response) {
            if (response.error === null) {
                $scope.count = response.result;
            } else {
                $scope.count = 0;
            }
        });
    };

    /**
     * Gets attribute list
     */
    getAttributeList = function () {
        productApiService.attributesInfo().$promise.then(function (response) {
            var result = response.result || [];

            $scope.attributes = result;
            serviceList.setAttributes($scope.attributes);
            $scope.fields = $scope.fields.concat(serviceList.getFields(showColumns));
            getProductsList();
        });
    };

    /**
     * Handler event when selecting the product in the list
     *
     * @param id
     */
    $scope.select = function (id) {
        $location.path("/products/" + id);
    };

    /**
     *
     */
    $scope.create = function () {
        $location.path("/products/new");
    };

    var hasSelectedRows = function () {
        var result = false;
        for (var _id in $scope.idsSelectedRows) {
            if ($scope.idsSelectedRows.hasOwnProperty(_id) && $scope.idsSelectedRows[_id]) {
                result = true;
            }
        }
        return result;
    };

    /**
     * Removes product
     *
     */
    $scope.remove = function () {
        if (!hasSelectedRows()) {
            return true;
        }

        var answer, id, i, _remove;
        answer = window.confirm("Please confirm you want to remove this product.");
        _remove = function (id) {
            var defer = $q.defer();

            productApiService.remove({"productID": id},
                function (response) {
                    if (response.result === "ok") {
                        defer.resolve(id);
                    } else {
                        defer.resolve(false);
                    }
                }
            );

            return defer.promise;
        };

        if (answer) {
            $('[ng-click="parent.remove()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
            var callback = function (response) {
                if (response) {
                    for (i = 0; i < $scope.products.length; i += 1) {
                        if ($scope.products[i].ID === response) {
                            $scope.products.splice(i, 1);
                        }
                    }
                    $scope.message = dashboardUtilsService.getMessage(null, 'success', 'Product(s) was removed successfully');
                }
            };
            for (id in $scope.idsSelectedRows) {

                if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                    _remove(id).then(callback);
                }
            }
        }
        $('[ng-click="parent.remove()"]').removeClass('disabled').children('i').remove();
        $('[ng-click="parent.remove()"]').siblings('.btn').removeClass('disabled');
    };

    $scope.$watch(function () {
        if (typeof $scope.attributes !== "undefined" && typeof $scope.productsTmp !== "undefined") {
            return true;
        }

        return false;
    }, function (isInitAll) {
        if(isInitAll) {
            $scope.products = serviceList.getList($scope.productsTmp);
        }
    });

    $scope.init = (function () {
        if (JSON.stringify({}) === JSON.stringify($location.search())) {
            $location.search('limit', '0,' + COUNT_ITEMS_PER_PAGE).replace();
            return;
        }
        getProductCount();
        getAttributeList();
    })();
}]);

