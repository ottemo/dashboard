(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsPageEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$cmsApiService",
                function ($scope, $routeParams, $location, $cmsApiService) {
                    var pageId, getDefaultPage;

                    // Initialize SEO
                    if(typeof $scope.initSeo === "function"){
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
                            "title": "",
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
                        $cmsApiService.pageGet({"id": pageId}).$promise.then(
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
                        var id, saveSuccess, saveError, updateSuccess, updateError;

                        if (typeof $scope.page !== "undefined") {
                            id = $scope.page.id || $scope.page._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                               window.alert("Page was saved");
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        saveError = function () {
                        };

                        /**
                         *
                         * @param response
                         */
                        updateSuccess = function (response) {
                            var i;
                            if (response.error === "") {
                                window.alert("Page was updated");
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                        };


                        if (!id) {
                            $cmsApiService.pageAdd($scope.page, saveSuccess, saveError);
                        } else {
                            $scope.page.id = id;
                            $cmsApiService.pageUpdate($scope.page, updateSuccess, updateError);
                        }
                    };

                }]); // jshint ignore:line
        return cmsModule;
    });
})(window.define);
