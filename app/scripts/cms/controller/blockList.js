(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsBlockListController", [
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$cmsApiService",
                function ($scope, $location, $routeParams, $q, $cmsApiService) {
                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "identifier",
                            "type": "select-link",
                            "label": "Name",
                            "visible": true,
                            "notDisable": true,
                            "filter": "text",
                            "filterValue": $routeParams.identifier
                        }
                    ];

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,5");
                    }

                    var getFields = function () {
                        var arr, i;
                        arr = [];

                        for (i = 0; i < $scope.fields.length; i += 1) {
                            arr.push($scope.fields[i].attribute);
                        }
                        return arr.join(",");
                    };

                    $scope.removeIds = {};

                    /**
                     * Gets list of blocks
                     */
                    $cmsApiService.blockListP($location.search(), {"extra": getFields()}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.blocks = [];
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.blocks.push(result[i]);
                            }
                        }
                    );

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
