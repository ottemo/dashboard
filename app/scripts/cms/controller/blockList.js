(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsBlockListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$dashboardListService",
                "$cmsApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $location, $routeParams, $q, DashboardListService, $cmsApiService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList = new DashboardListService();

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                    }

                    $scope.removeIds = {};

                    /**
                     * Gets list of blocks
                     */
                    var getBlocksList = function(){
                        $cmsApiService.blockListP($location.search(), {"extra": serviceList.getExtraFields()}).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.blocksTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.blocksTmp.push(result[i]);
                                }
                            }
                        );
                    };

                    /**
                     * Gets list of blocks
                     */
                    $cmsApiService.getCountB($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    $cmsApiService.blockAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            serviceList.init('blocks');
                            $scope.attributes = result;
                            serviceList.setAttributes($scope.attributes);
                            $scope.fields = serviceList.getFields();
                            getBlocksList();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.blocksTmp === "undefined") {
                            return false;
                        }

                        $scope.blocks = serviceList.getList($scope.blocksTmp);
                    };

                    $scope.$watch("blocksTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

                    /**
                     * Handler event when selecting the cms in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/cms/block/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/cms/block/new");
                    };


                    var remove = function (id) {
                        var defer = $q.defer();

                        $cmsApiService.blockRemove({"id": id},
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
                        answer = window.confirm("You really want to remove this block(s)");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.blocks.length; i += 1) {
                                        if ($scope.blocks[i].Id === response) {
                                            $scope.blocks.splice(i, 1);
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
