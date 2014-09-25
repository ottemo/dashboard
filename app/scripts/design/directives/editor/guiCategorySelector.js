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
            .directive("guiCategorySelector", [
                "$location",
                "$routeParams",
                "$designService",
                "$categoryApiService",
                function ($location, $routeParams, $designService, $categoryApiService) {
                    return {
                        restrict: "E",
                        templateUrl: $designService.getTemplate("design/gui/editor/categorySelector.html"),

                        scope: {
                            "attribute": "=editorScope",
                            "item": "=item"
                        },

                        controller: function ($scope) {
                            var loadData;

                            $scope.fields = [
                                {
                                    "attribute": "Name",
                                    "type": "select-link",
                                    "label": "Name",
                                    "visible": true,
                                    "notDisable": true,
                                    "filter": "text",
                                    "filterValue": ""
                                }
                            ];

                            $scope.oldSearch = {};

                            /**
                             * Gets count items
                             *
                             * @returns {number}
                             */
                            $scope.getParentName = function () {
                                var name = "";
                                if (typeof $scope.item !== "undefined" &&
                                    typeof $scope.items !== "undefined" &&
                                    typeof $scope.item[$scope.attribute.Attribute] !== "undefined") {

                                    for (var i = 0; i < $scope.items.length; i += 1) {

                                        if ($scope.items[i].Id === $scope.item[$scope.attribute.Attribute] ||
                                            $scope.items[i].Id === $scope.item.parent) {
                                            name = $scope.items[i].Name;
                                            break;
                                        }
                                    }
                                }

                                return name;
                            };

                            $scope.select = function (id) {
                                $scope.item[$scope.attribute.Attribute] = id;
                                $scope.hide("parent_id");
                            };

                            $scope.show = function (id) {
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

//                                if (typeof $scope.search === "undefined") {
//                                    $scope.search = {};
//                                    $scope.search.limit = "0," + COUNT_ITEMS_PER_PAGE;
//                                }
//                                if (typeof $scope.search.limit === "undefined") {
//                                    $scope.search.limit = "0," + COUNT_ITEMS_PER_PAGE;
//                                }

                                if (JSON.stringify($scope.oldSearch) === JSON.stringify($scope.search)) {
                                    return false;
                                }

                                $scope.oldSearch = clone($scope.search);

                                $categoryApiService.categoryList(
                                    $scope.search, {}).$promise.then(
                                    function (response) {
                                        var result, i;
                                        $scope.items = [];
                                        result = response.result || [];
                                        for (i = 0; i < result.length; i += 1) {
                                            if (result[i].Id !== $scope.item._id) {
                                                $scope.items.push(result[i]);
                                            }
                                        }
                                    }
                                );

                                /**
                                 * Gets list of products
                                 */
//                                $categoryApiService.getCount($scope.search, {}).$promise.then(
//                                    function (response) {
//                                        if (response.error === "") {
//                                            $scope.count = response.result;
//                                        } else {
//                                            $scope.count = 0;
//                                        }
//                                    }
//                                );
                            };

                            $scope.$watch("search", function () {
                                loadData();
                            });

                        }
                    };
                }]);

        return designModule;
    });
})(window.define, jQuery);