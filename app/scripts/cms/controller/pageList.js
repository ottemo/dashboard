(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsPageListController", [
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

                    /**
                     * Current selected cms
                     *
                     * @type {Object}
                     */
                    $scope.pages = [];
                    $scope.removeIds = {};

                    /**
                     * Gets list of categories
                     */
                    $cmsApiService.pageListP({"extra" : "content"}).$promise.then(
                        function (response) {
                            var result, i;
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.pages.push(result[i]);
                            }
                        }
                    );

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
                            for (id in $scope.removeIds) {
                                if ($scope.removeIds.hasOwnProperty(id) && true === $scope.removeIds[id]) {
                                    remove(id).then(
                                        function (response) {
                                            if (response) {
                                                for (i = 0; i < $scope.pages.length; i += 1) {
                                                    if ($scope.pages[i].Id === response) {
                                                        $scope.pages.splice(i, 1);
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
