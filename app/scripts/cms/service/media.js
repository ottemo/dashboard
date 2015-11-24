angular.module('cmsModule')

.factory('cmsMedia', ['$http', 'REST_SERVER_URI',
    function($http, REST_SERVER_URI) {
        //TODO: update url
        var baseUri = REST_SERVER_URI + '/cms/media'

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
                    //TODO: CLEANUP
                    console.log('service ',resp);

                    //TODO: clean the response data
                    return resp;
                });
        }

        function remove(id) {
            return $http.delete(baseUri + '/' + id)
                .then(function(response) {
                    //TODO: what gets returned here
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

