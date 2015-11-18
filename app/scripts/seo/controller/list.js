angular.module("seoModule")

.controller("seoListController", [
    "$rootScope",
    "$scope",
    "$location",
    "$routeParams",
    "$q",
    "$dashboardListService",
    "$seoApiService",
    "COUNT_ITEMS_PER_PAGE",
    function ($rootScope, $scope, $location, $routeParams, $q, DashboardListService, $seoApiService, COUNT_ITEMS_PER_PAGE) {
        var getSeoList, serviceList, getAttributeList, showColumns, seoList, seoIdToUrl;

        serviceList = new DashboardListService();
        showColumns = {
            'url' : {'type' : 'select-link', 'label' : 'URL'},
            'type' : {'label' : 'Type', 'filter' : 'text'},
            'title': {}
        };

        $scope.idsSelectedRows = {};
        $scope.fields = [];

        /**
         * Gets list and count of url rewrites
         */
        getSeoList = function() {
            $seoApiService.list().$promise.then(
                function (response) {
                    seoList = response.result || [];
                    $scope.count = seoList.length;
                    $scope.rewritesTmp = [];
                    seoIdToUrl = {};

                    for (var i = 0; i < seoList.length; i += 1) {
						seoList[i]["ID"] = seoList[i]["_id"];
						seoIdToUrl[seoList[i]["_id"]] =  seoList[i]["url"];
						$scope.rewritesTmp.push(seoList[i]);
                    }
                }
            );
        };



        /**
         * Gets list of attributes for url rewrites
         */
        getAttributeList = function() {
            var fields = ["url", "title", "meta_keywords", "meta_description", "type"];
            $scope.attributes = [];

            for (var i = 0; i < fields.length; i+=1) {
                $scope.attributes.push({
                    "Attribute": fields[i],
                    "Collection": "seo",
                    "Default": "",
                    "Editors": "text",
                    "Group": "SEO",
                    "IsRequired": false,
                    "IsStatic": true,
                    "Label": fields[i].charAt(0).toUpperCase() + fields[i].slice(1),
                    "Model": "Seo",
                    "Options": "",
                    "Type": "text",
                    "Value": ""
                });
            }
            serviceList.init('seo');
            serviceList.setAttributes($scope.attributes);
            $scope.fields = $scope.fields.concat(serviceList.getFields(showColumns));
        };

        /**
         * Handler event when selecting the seo in the list
         *
         * @param id
         */
        $scope.select = function (id) {
            $location.path("/seo/" + id);
        };

        /**
         *
         */
        $scope.create = function () {
            $location.path("/seo/new");
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

                $seoApiService.remove({"itemID": id},
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

        $scope.$watch(function () {
            if (typeof $scope.attributes !== "undefined" && typeof $scope.rewritesTmp !== "undefined") {
                return ($scope.rewritesTmp.length === $scope.count);
            }

            return false;
        }, function (isInitAll) {
            if(isInitAll) {
                $scope.rewrites = serviceList.getList($scope.rewritesTmp);
            }
        });

        $scope.init = (function () {
            if (JSON.stringify({}) === JSON.stringify($location.search())) {
                $location.search("limit", "0," + COUNT_ITEMS_PER_PAGE);
                return;
            }
            getAttributeList();
            getSeoList();
        })();
    }
]);
