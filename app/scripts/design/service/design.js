angular.module("designModule")
/**
*  $designService allows to do operations over very top HTML page
*/
.service("$designService", [function () {

    return {

        getTopPage: function () {
            return this.getTemplate('index.html');

        },


        getTemplate: function (templateName) {
            return '/themes/views/' + templateName;

        },


        getImage: function (img) {
            return "/themes/images/" + img;

        }

    }
}]);