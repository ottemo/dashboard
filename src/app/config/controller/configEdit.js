angular.module("configModule")

.controller("configEditController", [
    "$scope",
    "$routeParams",
    "configApiService",
    "configService",
    "dashboardUtilsService",
    function ($scope, $routeParams, configApiService, configService, dashboardUtilsService) {

        $scope.items = {};
        $scope.currentGroup = $routeParams.group;
        $scope.currentPath = "";
        var activeTab;

        $scope.init = function () {
            configService.init().then(
                function () {
                    var regExp, parts, tabs;
                    regExp = new RegExp("(\\w+)\\.(\\w+).*", "i");
                    tabs = {};

                    $scope.sections = configService.getConfigTabs($scope.currentGroup);

                    for (var i = 0; i < $scope.sections.length; i += 1) {
                        var attr = $scope.sections[i];

                        if (attr.Type === "group") {
                            if (typeof tabs[attr.Group] === "undefined") {
                                tabs[attr.Group] = [];
                            }
                            tabs[attr.Group].push(attr);
                        }
                    }
                    activeTab = Object.keys(tabs)[0];
                    parts = tabs[activeTab][0].Path.match(regExp);

                    if (parts instanceof Array) {
                        $scope.currentPath = parts[2];
                        configService.load($scope.currentPath).then(
                            function () {
                                $scope.items = configService.getItems($scope.currentPath);
                            }
                        );
                    }
                }
            );
        };

        $scope.selectTab = function (path) {
            $scope.currentPath = path;
            configService.load($scope.currentPath).then(
                function () {
                    $scope.items = configService.getItems($scope.currentPath);
                }
            );
        };

        $scope.save = function () {
            configService.save($scope.currentPath).then(
                function () {
                    $scope.message = dashboardUtilsService.getMessage(null, 'success', 'config was saved successfully');
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
}]);