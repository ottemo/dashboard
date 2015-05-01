angular.module("configModule", ["ngRoute", "ngResource", "designModule"])

/**
 *  Basic routing configuration
 */

.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/settings/:group", {
            templateUrl: angular.getTheme("config/edit.html"),
            controller: "configEditController"
        });
}])

.run([
    "$designService",
    "$route",
    "$dashboardSidebarService",
    "$configService",
    function ($designService, $route, $dashboardSidebarService, $configService) {

        // Adds item in the left sidebar
        $dashboardSidebarService.addItem("/settings", "Settings", null, "fa fa-cogs", 2);

        $configService.init().then(
            function () {
                var sections = $configService.getConfigGroups();
                for (var i = 0; i < sections.length; i += 1) {
                    $dashboardSidebarService.addItem("/settings/" + sections[i].Id, sections[i].Name, "/settings/" + sections[i].Id, "", i);
                }
            }
        );
    }
]);