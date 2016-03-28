/**
*  Directive used for automatic attribute editor creation
*/
angular.module("coreModule")

.directive("otProductsSelector", [
"$location",
"$routeParams",
"dashboardListService",
"productApiService",
"designImageService",
"COUNT_ITEMS_PER_PAGE",
function ($location, $routeParams, DashboardListService, productApiService, designImageService, COUNT_ITEMS_PER_PAGE) {
    var serviceList = new DashboardListService(), showColumns;
    showColumns = {
        'name' : {'type' : 'select-link', 'label' : 'Name'},
        'enabled' : {},
        'sku' : {},
        'price' : {}
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

            var oldWidth;

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
             * Get Name of selected object
             *
             * @returns string
             */
            $scope.getParentName = function () {
                var name = "";
                if (typeof $scope.item !== "undefined" &&
                    typeof $scope.items !== "undefined" &&
                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined") {

                    for (var i = 0; i < $scope.items.length; i += 1) {

                        if ($scope.items[i].ID === $scope.item[$scope.attribute.Attribute] ||
                            $scope.items[i].ID === $scope.item.parent) {
                            name = $scope.items[i].Name;
                            break;
                        }
                    }
                }

                return name;
            };

            $scope.select = function (id) {
                $scope.item[$scope.attribute.Attribute] = id;
                $scope.hide($scope.attribute.Attribute);
            };

            $scope.show = function (id) {
                serviceList.init('products');
                $("#" + id).modal("show");
            };

            $scope.hide = function (id) {
                $("#" + id).modal("hide");
            };

            $scope.clear = function () {
                $scope.item[$scope.attribute.Attribute] = "";
                $scope.item.parent = "";
            };


            loadData = function () {
                $scope.fields = [
                    {
                        "attribute": "Image",
                        "type": "image",
                        "label": "",
                        "visible": true
                    }
                ];
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
                        serviceList.init('products');
                        $scope.attributes = result;
                        serviceList.setAttributes($scope.attributes);
                        $scope.fields = $scope.fields.concat(serviceList.getFields(showColumns));
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

            $scope.$watch("search", function () {
                delete $scope.productsTmp;
                loadData();
            });



            /**
             * Returns full path to image
             *
             * @param {string} path     - the destination path to product folder
             * @param {string} image    - image name
             * @returns {string}        - full path to image
             */
            $scope.getImage = function (image) {
                return designImageService.getImage(image);
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
