(function (define) {
    "use strict";

    define(["seo/init"], function (seoModule) {
        seoModule
            .controller("seoIndependentEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$seoApiService",
                "$dashboardUtilsService",
                function ($scope, $routeParams, $location, $q, $seoApiService, $dashboardUtilsService) {
                    // Functions
                    var getAttributeList, getDefaultSEO;
                    // Variables
                    var seoURL, seoAttributes;

                    seoAttributes = {"url":{"IsRequired": true, "Label": "URL"},
                        "title":{},
                        "meta_keywords":{},
                        "meta_description":{},
                        "rewrite":{"IsRequired": true},
                        "type":{"IsRequired": true, "Editors": "select", "Options": "page,category,product"}
                    };
                    // not_editable, seo_selector, product_selector, selector : Options: "new,pending,canceled,complete"

                    seoURL = $routeParams.id;

                    if (!seoURL && seoURL !== "new") {
                        $location.path("/seo");
                    }

                    if (seoURL === "new") {
                        seoURL = null;
                    }

                    getDefaultSEO = function () {
                        return {
                            "url": "",
                            "title": "",
                            "type": "",
                            "meta_keywords": "",
                            "meta_description": ""
                        };
                    };

                    $scope.seo = {};

                    getAttributeList = function() {
                        $scope.attributes = [];

                        for (var attributeName in seoAttributes) {
                            if (typeof seoAttributes[attributeName] !== "undefined") {
                                var obj = {
                                    "Attribute": attributeName,
                                    "Collection": "seo",
                                    "Default": "",
                                    "Editors": "text",
                                    "Group": "SEO",
                                    "IsRequired": false,
                                    "IsStatic": true,
                                    "Label": attributeName.charAt(0).toUpperCase() + attributeName.slice(1),
                                    "Model": "Seo",
                                    "Options": "",
                                    "Type": "text",
                                    "Value": ""
                                };

                                for (var attributeKeys in seoAttributes[attributeName]) {
                                    if  ( obj.hasOwnProperty(attributeKeys) ) {
                                        obj[attributeKeys] = seoAttributes[attributeName][attributeKeys];
                                    }
                                }
                                $scope.attributes.push(obj);
                            }
                        }
                    };

                    getAttributeList();

                    if (null !== seoURL) {
                        $seoApiService.get({"url": seoURL}).$promise.then(function (response) {
                            var result = response.result[0] || {};
                            $scope.seo = result;
                        });
                    }

                    $scope.back = function () {
                        $location.path("/seo");
                    };

                    /**
                     * Event handler to save the seo data.
                     * Creates new seo if ID in current seo is empty OR updates current seo if ID is set
                     */
                    $scope.save = function () {
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                        defer = $q.defer();

                        if (typeof $scope.seo !== "undefined") {
                            id = $scope.seo.Id || $scope.seo._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === null) {
                                $scope.seo = response.result || getDefaultSEO();
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'URL rewrite was created successfully');
                                defer.resolve(true);
                            }
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                            defer.resolve(false);
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === null) {
                                $scope.seo = response.result || getDefaultSEO();
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'URL rewrite was updated successfully');
                                defer.resolve(true);
                                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                            defer.resolve(false);
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                        };

                        if (!id) {
                            if ($scope.seo.url !== "" && $scope.seo.rewrite !== "" ) {
                                $seoApiService.add($scope.seo, saveSuccess, saveError);
                            }
                        } else {
                            $seoApiService.update({"itemID": id}, $scope.seo, updateSuccess, updateError);
                        }

                        return defer.promise;
                    };
                }
            ]
        );

        return seoModule;
    });
})(window.define);
