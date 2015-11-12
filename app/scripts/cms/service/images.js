angular.module('cmsModule')

.factory('cmsImages', ['$http', 'REST_SERVER_URI',
    function($http, REST_SERVER_URI) {
        var baseUri = REST_SERVER_URI + '/cms/gallery/images'
        return {
            all: all,
            add: add,
            remove: remove
        };

        /////////////////////////

        function all() {
            return $http.get(baseUri)
                .then(function(response) {
                    return (response.error == null) ? response.data.result : [];
                });
        }

        function add(data) {
            // return $http.post(baseUri, data)
        }

        function remove(id) {
            return $http.delete(baseUri + '/' + id)
                .then(function(response) {
                    return respones;
                })
        }

    }
]);


// "galleryAdd": {
//     method: "POST",
//     url: REST_SERVER_URI + "/cms/gallery/image/:mediaName",
//     headers: {"Content-Type": undefined },
//     transformRequest: angular.identity // jshint ignore:line
// },

