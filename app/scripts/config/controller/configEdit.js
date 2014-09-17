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

                    $scope.config = $configService;
                    $scope.currentGroup = null;
                    $scope.items = {};

                    $scope.currentGroup = $routeParams.group;
                    $scope.sections = $scope.config.getConfigTabs($scope.currentGroup);
                    $scope.currentPath = "";

                    $scope.init = function () {
                        $scope.config.init();
                        var regExp = new RegExp("(\\w+)\\.(\\w+).*", "i");
                        var parts = $scope.sections[0].Path.match(regExp);
                        $scope.currentPath = parts[2];
                        $scope.config.load($scope.currentPath);
                    };

                    $scope.selectTab = function (path) {
                        $scope.currentPath = path;
                        $scope.config.load(path);
                    };

                    $scope.save = function () {
                        $scope.config.save($scope.currentPath).then(
                            function () {
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'config was saved successfully'
                                };
                                $scope.config.load($scope.currentPath, true);
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