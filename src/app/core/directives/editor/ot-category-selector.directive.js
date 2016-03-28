angular.module("coreModule")
/**
*  Directive used for automatic attribute editor creation
*/
.directive("otCategorySelector", [
    "$location",
    "$routeParams",
    "dashboardListService",
    "categoryApiService",
    function ($location, $routeParams, DashboardListService, categoryApiService) {
        var serviceList = new DashboardListService(), showColumns;
        showColumns = {
            'name' : {'type' : 'select-link', 'label' : 'Name'},
            'enabled' : {}
        };

        return {
            restrict: "E",
            templateUrl: "/views/core/directives/editor/category-selector.html",

            scope: {
                "attribute": "=editorScope",
                "item": "=item"
            },

            controller: function ($scope) {
                var loadData;

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
                    serviceList.init('categories');
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

                    if (typeof $scope.search === "undefined") {
                        $scope.search = {};
                    }

                    /**
                     * Gets list of categories
                     */
                    var getCategoriesList = function () {
                        var params = $scope.search;
                        params["extra"] = serviceList.getExtraFields();
                        categoryApiService.categoryList(params).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.categoriesTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    if (result[i].ID !== $scope.item._id) {
                                        $scope.categoriesTmp.push(result[i]);
                                    }
                                }
                            }
                        );
                    };

                    /**
                     * Gets count of categories
                     */
                    categoryApiService.getCount($scope.search).$promise.then(
                        function (response) {
                            if (response.error === null) {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    categoryApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            serviceList.init('categories');
                            $scope.attributes = result;
                            serviceList.setAttributes($scope.attributes);
                            $scope.fields = serviceList.getFields(showColumns);
                            getCategoriesList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.categoriesTmp === "undefined") {
                            return false;
                        }

                        $scope.items = serviceList.getList($scope.categoriesTmp);
                    };

                    $scope.$watch("categoriesTmp", prepareList);
                    $scope.$watch("attributes", prepareList);
                };

                $scope.$watch("search", function () {
                    loadData();
                });

            }
        };
    }]);
