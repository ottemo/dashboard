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
                            "attribute": "first_name",
                            "type": "string",
                            "label": "First name",
                            "visible": true,
                            "notDisable": false,
                            "filter": "text",
                            "filterValue": $routeParams['first_name']
                        },
                        {
                            "attribute": "last_name",
                            "type": "string",
                            "label": "Last name",
                            "visible": true,
                            "notDisable": false,
                            "filter": "text",
                            "filterValue": $routeParams['last_name']
                        },
                        {
                            "attribute": "email",
                            "type": "string",
                            "label": "Email",
                            "visible": true,
                            "notDisable": false,
                            "filter": "text",
                            "filterValue": $routeParams.email
                        },
                        {
                            "attribute": "group",
                            "type": "string",
                            "label": "Group",
                            "visible": true,
                            "notDisable": false,
                            "filter": "select",
                            "filterValue": $routeParams.group
                        }
                    ];

                    if (JSON.stringify({}) === JSON.stringify($location.search())) {
                        $location.search("limit", "0,5");
                    }

                    $scope.removeIds = {};

                    /**
                     * Gets list of visitors
                     */
                    $visitorApiService.visitorList($location.search(), {"extra": "email,group,last_name,first_name"}).$promise.then(
                        function (response) {
                            var result, i;
                            $scope.visitorsTmp = [];
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.visitorsTmp.push(result[i]);
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

                    $visitorApiService.attributesInfo().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                            var prepareGroups = function () {
                                for (var i = 0; i < $scope.fields.length; i += 1) {
                                    if (typeof $scope.fields[i].filter !== "undefined" && -1 !== $scope.fields[i].filter.indexOf("select")) {
                                        for (var j = 0; j < $scope.attributes.length; j += 1) {
                                            if ($scope.fields[i].attribute === $scope.attributes[j].Attribute) {
                                                $scope.fields[i].filter = "select" + $scope.attributes[j].Options;
                                            }
                                        }
                                    }
                                }
                            };
                            prepareGroups();
                        }
                    );

                    var prepareList = function () {
                        if (typeof $scope.attributes === "undefined" || typeof $scope.visitorsTmp === "undefined") {
                            return false;
                        }

                        var getOptions, substituteKeyToValue, prepareVisitor;

                        getOptions = function (opt) {
                            var options = {};

                            if (typeof opt === "string") {
                                try {
                                    options = JSON.parse(opt.replace(/'/g, "\""));
                                }
                                catch (e) {
                                    var parts = opt.split(",");
                                    for (var i = 0; i < parts.length; i += 1) {
                                        options[parts[i]] = parts[i];
                                    }
                                }
                            } else {
                                options = opt;
                            }

                            return options;
                        };

                        substituteKeyToValue = function (attribute, jsonStr) {
                            var options = getOptions(jsonStr);
                            var replace = function (key) {
                                return options[key];
                            };
                            for (var i = 0; i < $scope.visitorsTmp.length; i += 1) {
                                $scope.visitorsTmp[i].Extra[attribute] = $scope.visitorsTmp[i].Extra[attribute].map(replace);
                                $scope.visitorsTmp[i].Extra[attribute] = $scope.visitorsTmp[i].Extra[attribute].join(", ");
                            }
                        };

                        prepareVisitor = function () {
                            for (var i = 0; i < $scope.fields.length; i += 1) {
                                if (typeof $scope.fields[i].filter !== "undefined" && -1 !== $scope.fields[i].filter.indexOf("select")) {
                                    for (var j = 0; j < $scope.attributes.length; j += 1) {
                                        if ($scope.fields[i].attribute === $scope.attributes[j].Attribute) {
                                            substituteKeyToValue($scope.attributes[j].Attribute, $scope.attributes[j].Options);
                                        }
                                    }
                                }
                            }

                            return $scope.visitorsTmp;
                        };

                        $scope.visitors = prepareVisitor();

                    };

                    $scope.$watch("visitorsTmp", prepareList);
                    $scope.$watch("attributes", prepareList);

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
