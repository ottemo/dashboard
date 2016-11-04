angular.module("cmsModule")

.controller("cmsBlogListController", [
"$scope",
"$location",
"$routeParams",
"$q",
"dashboardListService",
"cmsApiService",
"COUNT_ITEMS_PER_PAGE",
function ($scope, $location, $routeParams, $q, DashboardListService, cmsApiService, COUNT_ITEMS_PER_PAGE) {
    var serviceList, getAttributeList, getBlogList, showColumns;
    serviceList = new DashboardListService();
    showColumns = {
        'identifier' : {'type' : 'select-link', 'label' : 'Name'},
        'created_at' : {'label' : 'Creation Date', 'type' : 'date'},
        'updated_at' : {'label' : 'Last Updated', 'type' : 'date'}
    };

    // Initialize SEO
    if (typeof $scope.initSeo === "function") {
        $scope.initSeo("post");
    }

    $scope.idsSelectedRows = {};
    $scope.mapping = {
        id: '_id'
    };

    /**
     * Gets list of blog
     */
    getBlogList = function () {
        var params = $location.search();
        cmsApiService.blogList(params).$promise.then(
            function (response) {
                var result, i;
                $scope.postTmp = [];
                result = response.result || [];
                for (i = 0; i < result.length; i += 1) {
                    $scope.postTmp.push(result[i]);
                }
            }
        );
    };

    getAttributeList = function () {
        cmsApiService.blogAttributes().$promise
            .then(function(response) {
                $scope.attributes = response.result || [];
                serviceList.setAttributes($scope.attributes);
                $scope.fields = serviceList.getFields(showColumns);

                getBlogList();
        });
    };

    /**
     * Handler event when selecting the cms in the list
     *
     * @param id
     */
    $scope.select = function (id) {
        $location.path("/cms/posts/" + id);
    };

    /**
     *
     */
    $scope.create = function () {
        $location.path("/cms/posts/new");
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
     * Removes blog by ID
     *
     */
    $scope.remove = function () {
        if (!hasSelectedRows()) {
            return true;
        }

        var i, answer, _remove;
        answer = window.confirm("You really want to remove this blog(s)?");
        _remove = function (id) {
            var defer = $q.defer();

            cmsApiService.blogRemove({"postID": id},
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
                    for (i = 0; i < $scope.posts.length; i += 1) {
                        if ($scope.posts[i].ID === response) {
                            $scope.posts.splice(i, 1);
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
        if (typeof $scope.attributes !== "undefined" && typeof $scope.postTmp !== "undefined") {
            return true;
        }

        return false;
    }, function (isInitAll) {
        if (isInitAll) {
            $scope.posts = serviceList.getList($scope.postTmp);
        }
    });

    $scope.init = (function () {
        if (JSON.stringify({}) === JSON.stringify($location.search())) {
            $location.search('limit', '0,' + COUNT_ITEMS_PER_PAGE).replace();
            return;
        }
        getAttributeList();
    })();
}]);
