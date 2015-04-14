(function (define, $) {
    "use strict";

    define(["seo/init"], function (seoModule) {
        seoModule
            .controller("seoListController", [
                "$rootScope",
                "$scope",
                "$location",
                "$routeParams",
                "$q",
                "$dashboardListService",
                "$seoService",
                "$seoApiService",
                "COUNT_ITEMS_PER_PAGE",
                function ($rootScope, $scope, $location, $routeParams, $q, DashboardListService, $seoService, $seoApiService, COUNT_ITEMS_PER_PAGE) {
                    var getSeoList, serviceList, getSeoCount, getAttributeList, showColumns;

                    serviceList = new DashboardListService();
                    showColumns = {
                        'url' : {'type' : 'select-link', 'label' : 'URL'},
                        'type' : {'label' : 'Type', 'filter' : 'text'}
                    };

//                    $seoService.init();
                    $scope.idsSelectedRows = {};
                    $scope.fields = [];
                    $scope.attributes = [];

                    getSeoList = function() {
                        $seoApiService.list().$promise.then(
                            function (response) {
                                var result = response.result || [];
                                $scope.rewritesTmp = [];

                                for (var i = 0; i < result.length; i += 1) {
                                    $scope.rewritesTmp.push(result[i]);
                                }
                                console.log($scope.rewritesTmp);
                            }
                        );
                    };

                    getAttributeList = function() {
                        var fields = ["url", "title", "meta_keywords", "meta_description", "type"];
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
                    $scope.select = function (url) {
                        $location.path("/seo/" + url);
                    };

                    /**
                     *
                     */
                    $scope.create = function () {
                        $location.path("/seo/new");
                    };

                    $scope.$watch(function () {
                        if (typeof $scope.attributes !== "undefined" && typeof $scope.rewritesTmp !== "undefined") {
                            return true;
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
            ]
        );

        return seoModule;
    });
})(window.define, jQuery);
