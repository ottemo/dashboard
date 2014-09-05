(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsBlockListController", [
                "$scope",
                "$location",
                "$q",
                "$cmsApiService",
                function ($scope, $location, $q, $cmsApiService) {
                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "Name",
                            "type": "select-link",
                            "label": "Name"
                        }
                    ];
                    $scope.count = 100;

                    $scope.blocks = [];
                    $scope.removeIds = {};

                    /**
                     * Gets list of categories
                     */
                    $cmsApiService.blockListG().$promise.then(
                        function (response) {
                            var result, i;
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.blocks.push(result[i]);
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
                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(
                                        function (response) {
                                            if (response) {
                                                for (i = 0; i < $scope.blocks.length; i += 1) {
                                                    if ($scope.blocks[i].Id === response) {
                                                        $scope.blocks.splice(i, 1);
                                                    }
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    };
                }]); // jshint ignore:line
        return cmsModule;
    });
})(window.define);
