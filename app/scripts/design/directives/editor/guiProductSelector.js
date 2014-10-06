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
                function ($location, $routeParams, $designService, $dashboardListService, $productApiService, $designImageService, COUNT_ITEMS_PER_PAGE) {
                    return {
                        restrict: "E",
                        templateUrl: $designService.getTemplate("design/gui/editor/productSelector.html"),

                        scope: {
                            "attribute": "=editorScope",
                            "item": "=item"
                        },

                        controller: function ($scope) {
                            var loadData;


                            $scope.oldSearch = {};
                            $scope.selected = {};
                            $scope.isExpand = false;

                            var oldWidth;

                            /**
                             * Gets count items
                             *
                             * @returns {number}
                             */
                            $scope.getCountItems = function () {
                                var len = 0;
                                if (typeof $scope.item !== "undefined" &&
                                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined" &&
                                    $scope.item[$scope.attribute.Attribute].length) {
                                    len = $scope.item[$scope.attribute.Attribute].length;
                                }
                                return len;
                            };

                            $scope.show = function (id) {
                                $dashboardListService.init('products');
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
                                        {"extra": $dashboardListService.getExtraFields()}
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
                                                parts = splitName(result[i].Name);
                                                result[i].Name = parts[2];
                                                result[i].sku = parts[1];
                                                $scope.productsTmp.push(result[i]);
                                            }
                                        }
                                    );
                                };

                                /**
                                 * Gets list of products
                                 */
                                $productApiService.getCount($scope.search, {}).$promise.then(
                                    function (response) {
                                        if (response.error === "") {
                                            $scope.count = response.result;
                                        } else {
                                            $scope.count = 0;
                                        }
                                    }
                                );

                                $productApiService.attributesInfo().$promise.then(
                                    function (response) {
                                        var result = response.result || [];
                                        $dashboardListService.init('products');
                                        $scope.attributes = result;
                                        $dashboardListService.setAttributes($scope.attributes);
                                        $scope.fields = $scope.fields.concat($dashboardListService.getFields());
                                        getProductsList();
                                    }
                                );

                                var prepareList = function () {
                                    if (typeof $scope.attributes === "undefined" || typeof $scope.productsTmp === "undefined") {
                                        return false;
                                    }

                                    $scope.items = $dashboardListService.getList($scope.productsTmp);
                                };

                                $scope.$watch("productsTmp", prepareList);
                                $scope.$watch("attributes", prepareList);
                            };

                            $scope.$watch("item", function () {
                                $scope.selected = {};

                                if (typeof $scope.item !== "undefined" && $scope.item._id) {

                                    for (var i = 0; i < $scope.item[$scope.attribute.Attribute].length; i += 1) {
                                        if (typeof $scope.item[$scope.attribute.Attribute] === "object") {
                                            $scope.selected[$scope.item[$scope.attribute.Attribute][i]._id] = true;
                                        }
                                    }
                                }
                            });

                            $scope.$watch("search", function () {
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