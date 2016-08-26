angular.module("cmsModule")

.controller("cmsPageListController", [
"$scope",
"$location",
"$routeParams",
"$q",
"dashboardListService",
"cmsApiService",
"COUNT_ITEMS_PER_PAGE",
function ($scope, $location, $routeParams, $q, DashboardListService, cmsApiService, COUNT_ITEMS_PER_PAGE) {
    var serviceList, getPageCount, getAttributeList, getPagesList, showColumns;
    serviceList = new DashboardListService();
    showColumns = {
        'identifier' : {'type' : 'select-link'},
        'enabled' : {},
        'title' : {}
    };

    // Initialize SEO
    if (typeof $scope.initSeo === "function") {
        $scope.initSeo("page");
    }

    $scope.idsSelectedRows = {};

    /**
     * Gets list of pages
     */
    getPagesList = function () {
        var params = $location.search();
        params["extra"] = serviceList.getExtraFields();
        cmsApiService.pageList(params).$promise.then(
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
    getPageCount = function () {
        cmsApiService.pageCount($location.search()).$promise.then(
            function (response) {
                if (response.error === null) {
                    $scope.count = response.result;
                } else {
                    $scope.count = 0;
                }
            }
        );
    };

    getAttributeList = function () {
        cmsApiService.pageAttributes().$promise.then(
            function (response) {
                var result = response.result || [];

                $scope.attributes = result;
                serviceList.setAttributes($scope.attributes);
                $scope.fields = serviceList.getFields(showColumns);
                getPagesList();
            }
        );
    };

    /**
     * Handler event when selecting the cms in the list
     *
     * @param id
     */
    $scope.select = function (id) {
        $location.path("/cms/pages/" + id);
    };

    /**
     *
     */
    $scope.create = function () {
        $location.path("/cms/pages/new");
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
     * Removes page by ID
     *
     */
    $scope.remove = function () {
        if (!hasSelectedRows()) {
            return true;
        }

        var i, answer, _remove;
        answer = window.confirm("You really want to remove this page(s)?");
        _remove = function (id) {
            var defer = $q.defer();

            cmsApiService.pageRemove({"pageID": id},
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
                    for (i = 0; i < $scope.pages.length; i += 1) {
                        if ($scope.pages[i].ID === response) {
                            $scope.pages.splice(i, 1);
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
        if (typeof $scope.attributes !== "undefined" && typeof $scope.pagesTmp !== "undefined") {
            return true;
        }

        return false;
    }, function (isInitAll) {
        if (isInitAll) {
            $scope.pages = serviceList.getList($scope.pagesTmp);
        }
    });

    $scope.init = (function () {
        if (JSON.stringify({}) === JSON.stringify($location.search())) {
            $location.search('limit', '0,' + COUNT_ITEMS_PER_PAGE).replace();
            return;
        }
        getPageCount();
        getAttributeList();
    })();
}]);
