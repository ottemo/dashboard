(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsPageListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$dashboardListService",
                "$cmsApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $location, $routeParams, $q, $dashboardListService, $cmsApiService, COUNT_ITEMS_PER_PAGE) {

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

                    $scope.removeIds = {};

                    /**
                     * Gets list of pages
                     */
                    var getPagesList = function(){
//                        $cmsApiService.pageListP($location.search(), {"extra": $dashboardListService.getExtraFields()}).$promise.then(
                        $cmsApiService.pageListP($location.search(), {"extra": "title"}).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.pagesTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.pagesTmp.push(result[i]);
                                }
                            }
                        );
                    };

                    /**
                     * Gets list of pages
                     */
                    $cmsApiService.getCountP($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $cmsApiService.pageAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $dashboardListService.init('pages');
                            $scope.attributes = result;
                            $dashboardListService.setAttributes($scope.attributes);
                            $scope.fields = $dashboardListService.getFields();
                            getPagesList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.pagesTmp === "undefined") {
                            return false;
                        }

                        $scope.pages = $dashboardListService.getList($scope.pagesTmp);
                    };

                    $scope.$watch("pagesTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

                    /**
                     * Handler event when selecting the cms in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/cms/page/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/cms/page/new");
                    };


                    var remove = function (id) {
                        var defer = $q.defer();

                        $cmsApiService.pageRemove({"id": id},
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

                    /**
                     * Removes cms by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this page(s)");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.pages.length; i += 1) {
                                        if ($scope.pages[i].Id === response) {
                                            $scope.pages.splice(i, 1);
                                        }
                                    }
                                }
                            };

                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(callback);
                                }
                            }
                        }
                    };

                }
            ]
        );

        return cmsModule;
    });
})(window.define);
