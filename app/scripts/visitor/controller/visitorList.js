(function (define, $) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorListController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$dashboardListService",
                "$visitorApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($scope, $routeParams, $location, $q, DashboardListService, $visitorApiService, COUNT_ITEMS_PER_PAGE) {
                    var serviceList, getVisitorsList, getVisitorCount, getAttributeList, showColumns;

                    serviceList = new DashboardListService();

                    showColumns = {
                        'last_name' : {},
                        'first_name' : {},
                        'email' : {},
                        'is_admin' : {}
                    };

                    $scope.idsSelectedRows = {};

                    /**
                     * Gets list of visitors
                     */
                    getVisitorsList = function () {
                        var params = $location.search();
                        params["extra"] = serviceList.getExtraFields();
                        $visitorApiService.visitorList(params).$promise.then(
                            function (response) {
                                var result, i;
                                $scope.visitorsTmp = [];
                                result = response.result || [];
                                for (i = 0; i < result.length; i += 1) {
                                    $scope.visitorsTmp.push(result[i]);
                                }
                            }
                        );
                    };

                    /**
                     * Gets count visitors
                     */
                    getVisitorCount = function() {
                        $visitorApiService.getCountVisitors($location.search(), {}).$promise.then(
                            function (response) {
                                if (response.error === null) {
                                    $scope.count = response.result;
                                } else {
                                    $scope.count = 0;
                                }
                            }
                        );
                    };

                    /**
                     * Gets visitor attributes
                     */
                    getAttributeList = function() {
                        $visitorApiService.attributesInfo().$promise.then(
                            function (response) {
                                var result = response.result || [];
                                serviceList.init('visitors');
                                $scope.attributes = result;
                                serviceList.setAttributes($scope.attributes);
                                $scope.fields = serviceList.getFields(showColumns);
                                getVisitorsList();
                            }
                        );
                    };

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

                    var hasSelectedRows = function () {
                        var result = false;
                        for (var _id in $scope.idsSelectedRows) {
                            if ($scope.idsSelectedRows.hasOwnProperty(_id) && $scope.idsSelectedRows[_id]) {
                                result = true;
                            }
                        }
                        return result;
                    };

                    /**
                     * Removes visitor
                     *
                     */
                    $scope.remove = function () {

                        if (!hasSelectedRows()) {
                            return true;
                        }

                        var i, answer, _remove;
                        answer = window.confirm("Please confirm you want to remove this visitor.");
                        _remove = function (id) {
                            var defer = $q.defer();

                            $visitorApiService.remove({"visitorID": id},
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
                        if (answer) {
                            $('[ng-click="parent.remove()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');
                            var callback = function (response) {
                                if (response) {
                                    for (i = 0; i < $scope.visitors.length; i += 1) {
                                        if ($scope.visitors[i].ID === response) {
                                            $scope.visitors.splice(i, 1);
                                        }
                                    }
                                }
                            };

                            for (var id in $scope.idsSelectedRows) {
                                if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                                    _remove(id).then(callback);
                                }
                            }
                        }
                        $('[ng-click="parent.remove()"]').removeClass('disabled').children('i').remove();
                        $('[ng-click="parent.remove()"]').siblings('.btn').removeClass('disabled');
                    };

                    $scope.$watch(function () {
                        if (typeof $scope.attributes !== "undefined" && typeof $scope.visitorsTmp !== "undefined") {
                            return true;
                        }

                        return false;
                    }, function (isInitAll) {
                        if(isInitAll) {
                            $scope.visitors = serviceList.getList($scope.visitorsTmp);
                        }
                    });

                    $scope.init = (function () {
                        if (JSON.stringify({}) === JSON.stringify($location.search())) {
                            $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                            return;
                        }
                        getVisitorCount();
                        getAttributeList();
                    })();
                }
            ]
        );

        return visitorModule;
    });
})(window.define, jQuery);
