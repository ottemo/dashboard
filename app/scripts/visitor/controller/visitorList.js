(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorListController", [
                "$scope",
                "$routeParams",
                "$visitorApiService",
                "$location",
                "$q",
                function ($scope, $routeParams, $visitorApiService, $location, $q) {

                    /**
                     * List fields which will shows in table
                     *
                     * @type [object]
                     */
                    $scope.fields = [
                        {
                            "attribute": "Name",
                            "type": "select-link",
                            "label": "Name",
                            "visible": true,
                            "notDisable": true
                        },

                        {
                            "attribute": "email",
                            "type": "string",
                            "label": "Email",
                            "visible": true,
                            "notDisable": true
                        }
                    ];

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,5");
                    }

                    $scope.removeIds = {};

                    $scope.getFullName = function () {
                        return $scope.visitor.first_name + " " + $scope.visitor.last_name;                  // jshint ignore:line
                    };

                    /**
                     * Gets list of visitors
                     */
                    $visitorApiService.visitorList($location.search(), {}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.visitors = [];
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.visitors.push(result[i]);
                            }
                        }
                    );

                    /**
                     * Gets list of visitors
                     */
                    $visitorApiService.getCountVisitors($location.search(), {}).$promise.then(
                        function (response) {
                            if (response.error === "") {
                                $scope.count = response.result;
                            } else {
                                $scope.count = 0;
                            }
                        }
                    );

                    /**
                     * Handler event when selecting the visitor in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $location.path("/visitor/" + id);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/visitor/new");
                    };

                    var remove = function (id) {
                        var defer = $q.defer();

                        $visitorApiService.remove({"id": id},
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
                     * Removes visitor by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this visitor");
                        if (answer) {
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.visitors.length; i += 1) {
                                        if ($scope.visitors[i].Id === response) {
                                            $scope.visitors.splice(i, 1);
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

        return visitorModule;
    });
})(window.define);
