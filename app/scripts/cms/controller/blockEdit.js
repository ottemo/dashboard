(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsBlockEditController", [
                "$scope",
                "$routeParams",
                "$location",
                "$cmsApiService",
                function ($scope, $routeParams, $location, $cmsApiService) {
                    var blockId, getDefaultBlock;

                    blockId = $routeParams.id;

                    if (!blockId && blockId !== "new") {
                        $location.path("/cms/blocks");
                    }

                    if (blockId === "new") {
                        blockId = null;
                    }

                    getDefaultBlock = function () {
                        return {
                            "id": "",
                            "url": "",
                            "identifier": "",
                            "content": "",
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
                    $scope.block = getDefaultBlock();

                    /**
                     * Gets list all attributes of cms
                     */
                    $cmsApiService.blockAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        }
                    );

                    $cmsApiService.blockGet({"id": blockId}).$promise.then(
                        function (response) {
                            var result = response.result || {};
                            $scope.block = result;
                        }
                    );

                    $scope.back = function () {
                        $location.path("/cms/blocks");
                    };

                    /**
                     * Event handler to save the cms data.
                     * Creates new cms if ID in current cms is empty OR updates current cms if ID is set
                     */
                    $scope.save = function () {
                        var id, saveSuccess, saveError, updateSuccess, updateError;

                        if (typeof $scope.block !== "undefined") {
                            id = $scope.block.id || $scope.block._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                                window.alert("Block was saved");
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
                            if (response.error === "") {
                                window.alert("Block was saved");
                            }
                        };

                        /**
                         *
                         * @param response
                         */
                        updateError = function () {
                        };


                        if (!id) {
                            $cmsApiService.blockAdd($scope.block, saveSuccess, saveError);
                        } else {
                            $scope.block.id = id;
                            $cmsApiService.blockUpdate($scope.block, updateSuccess, updateError);
                        }
                    };

                }]); // jshint ignore:line
        return cmsModule;
    });
})(window.define);
