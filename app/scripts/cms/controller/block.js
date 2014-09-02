(function (define) {
    "use strict";

    define(["cms/init"], function (cmsModule) {
        cmsModule
            .controller("cmsBlockController", [
                "$scope",
                "$cmsApiService",
                function ($scope, $cmsApiService) {
                    var getDefaultBlock;

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
                    $scope.block = getDefaultBlock();
                    $scope.blocks = [];

                    /**
                     * Gets list all attributes of cms
                     */
                    $cmsApiService.blockAttributes().$promise.then(
                        function (response) {
                            var result = response.result || [];
                            $scope.attributes = result;
                        });

                    /**
                     * Gets list of categories
                     */
                    $cmsApiService.blockListG().$promise.then(
                        function (response) {
                            var result, i;
                            result = response.result || [];
                            for (i = 0; i < result.length; i += 1) {
                                $scope.blocks.push(result[i]);
                            }
                        });

                    /**
                     * Clears the form to create a new cms
                     */
                    $scope.clearForm = function () {
                        $scope.block = getDefaultBlock();
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
                        $cmsApiService.blockGet({"id": id}).$promise.then(
                            function (response) {
                                var result = response.result || {};
                                $scope.block = result;
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
                            $cmsApiService.blockRemove({"id": id}, function (response) {
                                if (response.result === "ok") {
                                    for (i = 0; i < $scope.blocks.length; i += 1) {
                                        if ($scope.blocks[i].Id === id) {
                                            $scope.blocks.splice(i, 1);
                                            $scope.block = getDefaultBlock();
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

                        if (typeof $scope.block !== "undefined") {
                            id = $scope.block.id || $scope.block._id;
                        }

                        /**
                         *
                         * @param response
                         */
                        saveSuccess = function (response) {
                            if (response.error === "") {
                                $scope.blocks.push({
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
                                for (i = 0; i < $scope.blocks.length; i += 1) {
                                    if ($scope.blocks[i].Id === response.result._id) {
                                        $scope.blocks[i] = {
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
