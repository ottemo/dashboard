angular.module("designModule")
/**
*  $designService allows to do operations over very top HTML page
*/
.service("$designService", [function () {

    return {
        getTemplate: function (templateName) {
            return '/themes/views/' + templateName;
        },
        getImage: function (img) {
            return "/themes/images/" + img;
        }
    }
}]);