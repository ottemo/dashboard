/**
*  Directive used for automatic attribute editor creation
*/
angular.module("coreModule")

.directive("otProductsSelector", [
"$location",
"$routeParams",
"dashboardListService",
"productApiService",
"coreImageService",
"COUNT_ITEMS_PER_PAGE",
function ($location, $routeParams, DashboardListService, productApiService, coreImageService, COUNT_ITEMS_PER_PAGE) {
    var serviceList = new DashboardListService(), showColumns;
    showColumns = {
        'name' : {'type' : 'select-link', 'label' : 'Name'},
        'enabled' : {},
        'sku' : {},
        'price' : {'type': 'price', 'label': 'Price'}
    };

    return {
        restrict: "E",
        templateUrl: "/views/core/directives/editor/ot-products-selector.html",

        scope: {
            "attribute": "=editorScope",
            "item": "=item",
            "parent": "=parent"
        },

        controller: function ($scope) {
            var loadData;

            $scope.oldSearch = {};
            $scope.selected = {};
            $scope.isExpand = false;
            $scope.countSelected = 0;

            var oldWidth, getCountItems;

            var clone = function (obj) {
                if (null === obj || "object" !== typeof obj) {
                    return obj;
                }
                var copy = obj.constructor();
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = obj[attr];
                    }
                }
                return copy;
            };

            /**
             * Gets count items
             *
             * @returns {number}
             */
            getCountItems = function () {
                $scope.countSelected = 0;
                if (typeof $scope.item !== "undefined" &&
                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined" &&
                    $scope.item[$scope.attribute.Attribute].length
                ) {
                    $scope.countSelected = $scope.item[$scope.attribute.Attribute].length;
                }
            };

            $scope.show = function (id) {
                // escape any dots in our selector
                var selector = '#' + id.split('.').join("\\.");
                $(selector).modal("show");
            };

            $scope.hide = function (id) {
                $("#" + id).modal("hide");
            };

            loadData = function () {
                $scope.fields = [];
                if (typeof $scope.search === "undefined") {
                    $scope.search = {};
                    $scope.search.limit = "0," + COUNT_ITEMS_PER_PAGE;
                }
                if (typeof $scope.search.limit === "undefined") {
                    $scope.search.limit = "0," + COUNT_ITEMS_PER_PAGE;
                }

                if (JSON.stringify($scope.oldSearch) === JSON.stringify($scope.search)) {
                    return false;
                }

                //remove empty query strings
                for (var k in $scope.search){
                    if (!$scope.search[k] || $scope.search[k] == "~") {
                        delete $scope.search[k]
                    }
                }

                $scope.oldSearch = clone($scope.search);

                var getProductsList = function () {
                    var params = $scope.search;
                    params["extra"] = serviceList.getExtraFields();
                    productApiService.productList(params).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.productsTmp = [];
                            result = response.result || [];

                            for (i = 0; i < result.length; i += 1) {
                                if (typeof $scope.parent.excludeItems !== "undefined" && -1 !== $scope.parent.excludeItems.indexOf(result[i].ID)) {
                                    continue;
                                }
                                result[i].Name = result[i].Extra.name;
                                result[i].sku = result[i].Extra.sku;
                                $scope.productsTmp.push(result[i]);
                            }
                        }
                    );
                };
                /**
                 * Gets list of products
                 */
                var getProductCount = function () {
                    productApiService.getCount($scope.search, {}).$promise.then(function (response) {
                        if (response.error === null) {
                            $scope.count = response.result;
                        } else {
                            $scope.count = 0;
                        }
                    });
                };

                var getAttributeList = function () {
                    productApiService.attributesInfo().$promise.then(function (response) {
                        var result = response.result || [];
                        $scope.attributes = result;
                        serviceList.setAttributes($scope.attributes);

                        $scope.fields = $scope.fields.concat(serviceList.getFields(showColumns));
                            //.filter(function(obj){
                            //    return ['name', 'enabled', 'sku', 'price'].indexOf(obj.attribute) >= 0
                            //});

                        getProductsList();
                    });
                };

                $scope.$watch(function () {
                    if (typeof $scope.attributes !== "undefined" && typeof $scope.productsTmp !== "undefined") {
                        return true;
                    }

                    return false;
                }, function (isInitAll) {
                    if (isInitAll) {
                        $scope.items = serviceList.getList($scope.productsTmp);
                    }
                });

                $scope.init = (function () {
                    getProductCount();
                    getAttributeList();
                })();
            };

            $scope.$watch("item", function () {
                if (typeof $scope.item !== "undefined" &&
                    $scope.item[$scope.attribute.Attribute] instanceof Array
                ) {

                    $scope.selected = {};
                    for (var i = 0; i < $scope.item[$scope.attribute.Attribute].length; i += 1) {

                        //TODO: it would be great if there were some explanation here
                        if (typeof $scope.item[$scope.attribute.Attribute][i] === "object") {
                            $scope.selected[$scope.item[ $scope.attribute.Attribute][i]._id ] = true;
                        } else {
                            $scope.selected[ $scope.item[$scope.attribute.Attribute][i] ] = true;
                        }
                    }
                    getCountItems();
                }
            });

            $scope.$watch("search", function () {
                delete $scope.productsTmp;
                loadData();
            });

            $scope.$watch("selected", function () {
                if ($scope.item) {
                    $scope.item[$scope.attribute.Attribute] = [];
                    for (var id in $scope.selected) {
                        if ($scope.selected[id]) {
                            $scope.item[$scope.attribute.Attribute].push(id);
                        }
                    }
                    getCountItems();
                };
            }, true);

            /**
             * Returns full path to image
             *
             * @param {string} path     - the destination path to product folder
             * @param {string} image    - image name
             * @returns {string}        - full path to image
             */
            $scope.getImage = function (image) {
                return coreImageService.getImage(image);
            };

            $scope.expand = function () {
                oldWidth = $('.modal-dialog').css("width");
                $('.modal-dialog').css("width", "90%");
                $scope.isExpand = true;
            };

            $scope.compress = function () {
                $('.modal-dialog').css("width", oldWidth || "600px");
                $scope.isExpand = false;
            };
        }
    };
}]);
