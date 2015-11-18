angular.module("designModule")
/**
*  Directive used for automatic attribute editor creation
*/
.directive("guiPageSelector", [
    "$location",
    "$routeParams",
    "$designService",
    "$dashboardListService",
    "$cmsApiService",
    function ($location, $routeParams, $designService, DashboardListService, $cmsApiService) {
        var serviceList = new DashboardListService(), showColumns;
        showColumns = {
            'identifier' : {'type' : 'select-link'},
            'enabled' : {},
            'title' : {}
        };

        return {
            restrict: "E",
            templateUrl: $designService.getTemplate("design/gui/editor/pageSelector.html"),

            scope: {
                "attribute": "=editorScope",
                "item": "=item"
            },

            controller: function ($scope) {
                var loadData;

                $scope.oldSearch = {};

                /**
                 * ??
                 *
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
                    serviceList.init('pages');
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
                     * Gets list of pages
                     */
                    var getPagesList = function () {
                        var params = $scope.search;
                        params["extra"] = serviceList.getExtraFields();
                        $cmsApiService.pageList(params).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.pagesTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    if (result[i].ID !== $scope.item._id) {
                                        $scope.pagesTmp.push(result[i]);
                                    }
                                }
                            }
                        );
                    };

                    /**
                     * Gets count of pages
                     */
                    $cmsApiService.pageCount($scope.search).$promise.then(
                        function (response) {
                            if (response.error === null) {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $cmsApiService.pageAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            serviceList.init('pages');
                            $scope.attributes = result;
                            serviceList.setAttributes($scope.attributes);
                            $scope.fields = serviceList.getFields(showColumns);
                            getPagesList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.pagesTmp === "undefined") {
                            return false;
                        }

                        $scope.items = serviceList.getList($scope.pagesTmp);
                    };

                    $scope.$watch("pagesTmp", prepareList);
                    $scope.$watch("attributes", prepareList);
                };

                $scope.$watch("search", function () {
                    loadData();
                });

            }
        };
    }]);
