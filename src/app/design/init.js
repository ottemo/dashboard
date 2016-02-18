angular.module("designModule",[])

.constant("MEDIA_BASE_PATH", angular.appConfigValue("general.app.media_path"))
.constant("PRODUCT_DEFAULT_IMG", "placeholder.png")

/**
 *  Startup for designModule - registration globally visible functions
 */
.run(["$designService", "$rootScope", function ($designService, $rootScope) {

    /**
     *  Global functions you can use in any angular template
     */
    $rootScope.getTemplate = $designService.getTemplate;
    $rootScope.getImg = $designService.getImage;

}]);