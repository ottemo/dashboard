(function (define, $) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsPageEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$q",
                "$cmsApiService",
                "$dashboardUtilsService",
                function ($scope, $routeParams, $location, $q, $cmsApiService, $dashboardUtilsService) {
                    var pageId, getDefaultPage;

                    // Initialize SEO
                    if (typeof $scope.initSeo === "function") {
                        $scope.initSeo("page");
                    }

                    pageId = $routeParams.id;

                    if (!pageId && pageId !== "new") {
                        $location.path("/cms/pages");
                    }

                    if (pageId === "new") {
                        pageId = null;
                    }

                    getDefaultPage = function () {
                        return {
                            "id": "",
                            "url": "",
                            "identifier": "",
                            "pagetitle": "",
                            "content": "",
                            "meta_keywords": "",
                            "meta_description": "",
                            "created_at": "",
                            "updated_at": ""
                        };
                    };

                    $scope.count = 100;

                    /**
                     * Current selected cms
                     *
                     * @type {Object}
                     */
                    $scope.page = getDefaultPage();


                    /**
                     * Gets list all attributes of cms
                     */
                    $cmsApiService.pageAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        }
                    );

                    if (null !== pageId) {
                        $cmsApiService.pageGet({"pageID": pageId}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.page = result;
                            }
                        );
                    }

                    $scope.back = function () {
                        $location.path("/cms/pages");
                    };

                    /**
                     * Event handler to save the cms data.
                     * Creates new cms if ID in current cms is empty OR updates current cms if ID is set
                     */
                    $scope.save = function () {
                        //disable buttons
                        $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

                        var id, defer, saveSuccess, saveError, updateSuccess, updateError;
                        defer = $q.defer();
                        if (typeof $scope.page !== "undefined") {
                            id = $scope.page.id || $scope.page._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === null) {
                                var result = response.result || getDefaultPage();
                                $scope.page._id = response.result._id;
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Page was created successfully');
                                defer.resolve(result);

                                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            defer.resolve(false);
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            if (response.error === null) {
                                var result = response.result || getDefaultPage();
                                $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'Page was updated successfully');
                                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                                defer.resolve(result);
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                            $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                            $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                            defer.resolve(false);
                        };

                        if (!id) {
                            $cmsApiService.pageAdd($scope.page, saveSuccess, saveError);
                        } else {
                            $scope.page.id = id;
                            $cmsApiService.pageUpdate($scope.page, updateSuccess, updateError);
                        }

                        return defer.promise;
                    };

                }
            ]
        );

        return cmsModule;
    });
})(window.define, jQuery);
