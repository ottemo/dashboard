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

        function add(files) {
            var formData = _fileToFormData(files);

            return $http.post(baseUri, formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                .then(function(resp) {
                    console.log('service ',resp);
                    return resp;
                });
        }

        function remove(id) {
            return $http.delete(baseUri + '/' + id)
                .then(function(response) {
                    return respones;
                });
        }

        function _fileToFormData(files) {
            var fd = new FormData();
            angular.forEach(files, function(file) {
                fd.append('file', file);
            });

            return fd;
        }
    }
]);

