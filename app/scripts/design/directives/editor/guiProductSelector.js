(function (define, $) {
    "use strict";

    define(["design/init"], function (designModule) {
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
        designModule
        /**
         *  Directive used for automatic attribute editor creation
         */
            .directive("guiProductSelector", [
                "$location",
                "$routeParams",
                "$designService",
                "$dashboardListService",
                "$productApiService",
                "$designImageService",
                "COUNT_ITEMS_PER_PAGE",
                function ($location, $routeParams, $designService, DashboardListService, $productApiService, $designImageService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList = new DashboardListService();
                    return {
                        restrict: "E",
                        templateUrl: $designService.getTemplate("design/gui/editor/productSelector.html"),

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

                            /**
                             * Gets count items
                             *
                             * @returns {number}
                             */
                            getCountItems = function () {
                                $scope.countSelected = 0;
                                if (typeof $scope.item !== "undefined" &&
                                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined" &&
                                    $scope.item[$scope.attribute.Attribute].length) {
                                    $scope.item[$scope.attribute.Attribute].map(function (val) {
                                        if ("" !== val && typeof val !== "undefined") {
                                            $scope.countSelected += 1;
                                        }
                                    });
                                }
                            };

                            $scope.show = function (id) {
                                serviceList.init('products');
                                $("#" + id).modal("show");
                            };

                            $scope.hide = function (id) {
                                $("#" + id).modal("hide");
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
                                    $productApiService.productList(
                                        $scope.search,
                                        {"extra": serviceList.getExtraFields()}
                                    ).$promise.then(
                                        function (response) {
                                            var result, i, parts, splitName;
                                            $scope.productsTmp = [];
                                            splitName = function (string) {
                                                var parts;
                                                var regExp = /\[(.+)\](.+)/i;
                                                parts = string.match(regExp);

                                                return parts;
                                            };
                                            result = response.result || [];

                                            for (i = 0; i < result.length; i += 1) {
                                                if (typeof $scope.parent.excludeItems !== "undefined" && -1 !== $scope.parent.excludeItems.indexOf(result[i].ID)) {
                                                    continue;
                                                }
                                                parts = splitName(result[i].Name);
                                                if (parts instanceof Array) {
                                                    result[i].Name = parts[2];
                                                    result[i].sku = parts[1];
                                                    $scope.productsTmp.push(result[i]);
                                                }
                                            }
                                        }
                                    );
                                };
                                /**
                                 * Gets list of products
                                 */
                                var getProductCount = function () {
                                    $productApiService.getCount($scope.search, {}).$promise.then(function (response) {
                                        if (response.error === null) {
                                            $scope.count = response.result;
                                        } else {
                                            $scope.count = 0;
                                        }
                                    });
                                };

                                var getAttributeList = function () {
                                    $productApiService.attributesInfo().$promise.then(function (response) {
                                        var result = response.result || [];
                                        serviceList.init('products');
                                        $scope.attributes = result;
                                        serviceList.setAttributes($scope.attributes);
                                        $scope.fields = $scope.fields.concat(serviceList.getFields());
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
                                $scope.selected = {};

                                if (typeof $scope.item !== "undefined" &&
                                    $scope.item._id &&
                                    $scope.item[$scope.attribute.Attribute] instanceof Array) {
                                    for (var i = 0; i < $scope.item[$scope.attribute.Attribute].length; i += 1) {
                                        if (typeof $scope.item[$scope.attribute.Attribute][i] === "object") {
                                            $scope.selected[$scope.item[$scope.attribute.Attribute][i]._id] = true;
                                        } else {
                                            $scope.selected[$scope.item[$scope.attribute.Attribute][i]] = true;
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
                                var id;
                                $scope.item[$scope.attribute.Attribute] = [];
                                for (id in $scope.selected) {
                                    if ($scope.selected.hasOwnProperty(id) && $scope.selected[id] === true) {
                                        $scope.item[$scope.attribute.Attribute].push(id);
                                    }
                                }
                                getCountItems();
                            }, true);

                            /**
                             * Returns full path to image
                             *
                             * @param {string} path     - the destination path to product folder
                             * @param {string} image    - image name
                             * @returns {string}        - full path to image
                             */
                            $scope.getImage = function (image) {
                                return $designImageService.getFullImagePath("", image);
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

        return designModule;
    });
})(window.define, jQuery);
