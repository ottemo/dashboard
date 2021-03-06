angular.module("cmsModule")

.controller("cmsBlockListController", [
"$scope",
"$location",
"$routeParams",
"$q",
"dashboardListService",
"cmsApiService",
"COUNT_ITEMS_PER_PAGE",
function ($scope, $location, $routeParams, $q, DashboardListService, cmsApiService, COUNT_ITEMS_PER_PAGE) {
    var serviceList, getBlockCount, getAttributeList, getBlocksList, showColumns;
    serviceList = new DashboardListService();
    showColumns = {
        'identifier' : {'type' : 'select-link', 'label' : 'Name'},
        'created_at' : {'label' : 'Creation Date', 'type' : 'date'},
        'updated_at' : {'label' : 'Last Updated', 'type' : 'date'}
    };

    $scope.idsSelectedRows = {};

    /**
     * Gets list of blocks
     */
    getBlocksList = function () {
        var params = $location.search();
        params["extra"] = serviceList.getExtraFields();
        cmsApiService.blockList(params).$promise.then(
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
    getBlockCount = function () {
        cmsApiService.blockCount($location.search()).$promise.then(
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
        cmsApiService.blockAttributes().$promise.then(
            function (response) {
                var result = response.result || [];
                $scope.attributes = result;
                serviceList.setAttributes($scope.attributes);
                $scope.fields = serviceList.getFields(showColumns);
                getBlocksList();
            }
        );
    };

    /**
     * Handler event when selecting the cms in the list
     *
     * @param id
     */
    $scope.select = function (id) {
        $location.path("/cms/blocks/" + id);
    };

    /**
     *
     */
    $scope.create = function () {
        $location.path("/cms/blocks/new");
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
     * Removes block by ID
     *
     */
    $scope.remove = function () {
        if (!hasSelectedRows()) {
            return true;
        }

        var i, answer, _remove;
        answer = window.confirm("You really want to remove this block(s)?");
        _remove = function (id) {
            var defer = $q.defer();

            cmsApiService.blockRemove({"blockID": id},
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
                    for (i = 0; i < $scope.blocks.length; i += 1) {
                        if ($scope.blocks[i].ID === response) {
                            $scope.blocks.splice(i, 1);
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
        if (typeof $scope.attributes !== "undefined" && typeof $scope.blocksTmp !== "undefined") {
            return true;
        }

        return false;
    }, function (isInitAll) {
        if (isInitAll) {
            $scope.blocks = serviceList.getList($scope.blocksTmp);
        }
    });

    $scope.init = (function () {
        if (JSON.stringify({}) === JSON.stringify($location.search())) {
            $location.search('limit', '0,' + COUNT_ITEMS_PER_PAGE).replace();
            return;
        }
        getBlockCount();
        getAttributeList();
    })();
}]);
