(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorEmailController", [
                "$scope",
                "$location",
                "$visitorApiService",
                function ($scope, $location, $visitorApiService) {
                    var getDefaultEmail;

                    getDefaultEmail = function () {
                        return {
                            "visitor_ids": [],
                            "subject": "",
                            "content": ""
                        };
                    };

                    /**
                     * Current selected visitor
                     *
                     * @type {Object}
                     */
                    $scope.email = getDefaultEmail();

                    $scope.addressForm = function () {
                        $location.path("/visitor/" + $scope.visitor._id + "/addresses");
                    };

                    $scope.getFullName = function () {
                        return $scope.visitor['first_name'] + " " + $scope.visitor['last_name'];
                    };

                    $scope.attributes = [
                        {
                            "Attribute": "visitor_ids",
                            "Editors": "visitor_selector",
                            "Label": "Visitors"
                        },
                        {
                            "Attribute": "subject",
                            "Editors": "text",
                            "Label": "Subject"
                        },
                        {
                            "Attribute": "content",
                            "Editors": "html",
                            "Label": "Content"
                        }
                    ];

                    /**
                     * Event handler to save the visitor data.
                     * Creates new visitor if ID in current visitor is empty OR updates current visitor if ID is set
                     */
                    $scope.send = function () {
                        var successSend = function (response) {
                            if (response.result === "ok") {
                                $scope.message = {
                                    'type': 'success',
                                    'message': 'Emails sent successfully'
                                };
                            }
                        };


                        var errorSend = function (response) {
                            if (response.result === "ok") {
                                $scope.message = {
                                    'type': 'danger',
                                    'message': 'Something went wrong'
                                };
                            }
                        };

                        $visitorApiService.sendMail($scope.email, successSend, errorSend);
                    };

                }
            ]
        );

        return visitorModule;
    });
})(window.define);