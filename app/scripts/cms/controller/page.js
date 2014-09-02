(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsPageController", [
                "$scope",
                "$cmsApiService",
                function ($scope, $cmsApiService) {
                    var getDefaultPage;

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
                     * Type of list
                     *
                     * @type {string}
                     */
                    $scope.activeView = "list";

                    /**
                     * Current selected cms
                     *
                     * @type {Object}
                     */
                    $scope.page = getDefaultPage();
                    $scope.pages = [];

                    /**
                     * Gets list all attributes of cms
                     */
                    $cmsApiService.pageAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        });

                    /**
                     * Gets list of categories
                     */
                    $cmsApiService.pageListG().$promise.then(
                        function (response) {
                            var result, i;
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.pages.push(result[i]);
                            }
                        });

                    /**
                     * Clears the form to create a new cms
                     */
                    $scope.clearForm = function () {
                        $scope.page = getDefaultPage();
                    };

                    $scope.clearForm();

                    /**
                     * Changes type of list
                     *
                     * @param type
                     */
                    $scope.switchListView = function (type) {
                        $scope.activeView = type;
                    };

                    /**
                     * Handler event when selecting the cms in the list
                     *
                     * @param id
                     */
                    $scope.select = function (id) {
                        $cmsApiService.pageGet({"id": id}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.page = result;
                            });
                    };

                    /**
                     * Removes cms by ID
                     *
                     * @param {string} id
                     */
                    $scope.remove = function (id) {
                        var i, answer;
                        answer = window.confirm("You really want to remove this cms");
                        if (answer) {
                            $cmsApiService.pageRemove({"id": id}, function (response) {
                                if (response.result === "ok") {
                                    for (i = 0; i < $scope.pages.length; i += 1) {
                                        if ($scope.pages[i].Id === id) {
                                            $scope.pages.splice(i, 1);
                                            $scope.page = getDefaultPage();
                                        }
                                    }
                                }
                            });
                        }
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
                                $scope.pages.push({
                                    "Id": response.result._id,
                                    "Name": response.result.identifier
                                });
                                $scope.clearForm();
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
                                for (i = 0; i < $scope.pages.length; i += 1) {
                                    if ($scope.pages[i].Id === response.result._id) {
                                        $scope.pages[i] = {
                                            "Id": response.result._id,
                                            "Name": response.result.identifier
                                        };
                                    }
                                }
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
