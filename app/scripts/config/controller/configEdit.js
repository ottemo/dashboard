(function (define) {
    "use strict";

    define(["config/init"], function (configModule) {
        configModule
            .controller("configEditController", [
                "$scope",
                "$routeParams",
                "$configApiService",
                "$configService",
                function ($scope, $routeParams, $configApiService, $configService) {

                    $scope.currentGroup = null;
                    $scope.items = {};
                    $scope.currentGroup = $routeParams.group;
                    $scope.currentPath = "";

                    $scope.init = function () {
                        $configService.init().then(
                            function () {
                                var regExp = new RegExp("(\\w+)\\.(\\w+).*", "i");

                                $scope.sections = $configService.getConfigTabs($scope.currentGroup);
                                var parts = $scope.sections[0].Path.match(regExp);
                                if (parts instanceof Array) {
                                    $scope.currentPath = parts[2];
                                    $configService.load($scope.currentPath).then(
                                        function () {
                                            $scope.items = $configService.getItems($scope.currentPath);
                                        }
                                    );
                                }
                            }
                        );
                    };

                    $scope.selectTab = function (path) {
                        $scope.currentPath = path;
                        $configService.load($scope.currentPath).then(
                            function () {
                                $scope.items = $configService.getItems($scope.currentPath);
                            }
                        );
                    };

                    $scope.save = function () {
                        $configService.save($scope.currentPath).then(
                            function () {
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'config was saved successfully'
                                };
                                $configService.load($scope.currentPath, true);
                            }
                        );
                    };

                    $scope.getGroupName = function () {
                        return $scope.currentGroup !== null ?
                            $scope.currentGroup.charAt(0).toUpperCase() + $scope.currentGroup.slice(1) :
                            "Configuration";
                    };

                    $scope.getGroupPath = function (attributes) {
                        var path, parts;
                        if (attributes instanceof Array) {
                            path = attributes[0].Path;
                            parts = path.split(".");
                            return parts[0] + "." + parts[1];
                        }
                    };

                    $scope.isThemeManager = function () {
                        if ("themes" === $scope.currentGroup && "themes_manager" === $scope.sections[0].Editor) {
                            return true;
                        }

                        return false;
                    };
                }
            ]
        );

        return configModule;
    });
})(window.define);