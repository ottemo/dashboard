angular.module("seoModule")

.controller("seoListController", [
    "$rootScope",
    "$scope",
    "$location",
    "$routeParams",
    "$q",
    "dashboardListService",
    "seoApiService",
    "COUNT_ITEMS_PER_PAGE",
    function (
        $rootScope,
        $scope,
        $location,
        $routeParams,
        $q,
        DashboardListService,
        seoApiService,
        COUNT_ITEMS_PER_PAGE) {

        var serviceList = new DashboardListService();

        var showColumns = {
            'url' : {
                'type' : 'select-link',
                'label' : 'URL'
            },
            'type' : {
                'label' : 'Type',
                'filter' : 'text'
            },
            'title': {}
        };

        var searchDefaults = {
            sort: "^url",
            limit: "0,15"
        };

        $scope.selectedIds = [];
        $scope.idsSelectedRows = {};
        $scope.fields = [];

        $scope.select = select;
        $scope.create = create;

        activate();

        ///////////////////////////////////////

        function activate() {
            $scope.$watch("idsSelectedRows", function(newVal, oldVal) {
                var ids = [];
                angular.forEach($scope.idsSelectedRows, function(active, id) {
                    if (active) {
                        ids.push(id);
                    }
                });
                $scope.selectedIds = ids;
            }, true);

            setSearchDefaults();

            getSeoCount();
            getAttributeList();
        }

        function setSearchDefaults() {
            if (JSON.stringify({}) === JSON.stringify($location.search())) {
                $location.search(searchDefaults).replace();
            }
        }

        /**
         * Gets list and count of url rewrites
         */
        function getSeoList() {
            var params = $location.search();
            params.extra = serviceList.getExtraFields();

            seoApiService.listSeo(params).$promise
                .then(function (response) {
                    var result = response.result || [];
                    $scope.rewrites = serviceList.getList(result);
                }
            );
        }

        function getSeoCount() {
            seoApiService.getCount($location.search()).$promise
                .then(function(response) {
                    $scope.count = (response.error === null) ? response.result : 0;
                });
        }

        function getAttributeList() {
            seoApiService.getAttributes().$promise.then(
                function(response) {
                    $scope.attributes = response.result || [];
                    serviceList.setAttributes($scope.attributes);
                    $scope.fields = serviceList.getFields(showColumns);

                    getSeoList();
                }
            );
        }

        function select (id) {
            $location.path("/seo/" + id).search("");
        }

        function create() {
            $location.path("/seo/new");
        }

        function hasSelectedRows() {
            return $scope.selectedIds.length;
        }

        /**
         * Removes seo by ID
         *
         */
        $scope.remove = function () {

            if (!hasSelectedRows()) {
                return true;
            }

            var i, answer, _remove;
            answer = window.confirm("Please confirm you want to remove this url rewrite.");
            _remove = function (id) {
                var defer = $q.defer();

                seoApiService.remove({"itemID": id},
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
                        for (i = 0; i < $scope.rewrites.length; i += 1) {
                            if ($scope.rewrites[i].ID === response) {
                                $scope.rewrites.splice(i, 1);
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
    }
]);
