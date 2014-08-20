(function (define) {
    "use strict";

    define(["visitor/init"], function (visitorModule) {

        visitorModule
            .controller("visitorEditController", ["$scope", "$visitorApiService", "$location", function ($scope, $visitorApiService, $location) {
                var getDefaultVisitor;

                getDefaultVisitor = function () {
                    return {};
                };
                /**
                 * Visitor by default
                 *
                 * @type {object}
                 */
                $scope.defaultVisitor = getDefaultVisitor();
                /**
                 * Type of list
                 *
                 * @type {string}
                 */
                $scope.activeView = "list";

                /**
                 * Changes type of list
                 *
                 * @param type
                 */
                $scope.switchListView = function (type) {
                    $scope.activeView = type;
                };

                /**
                 * Current selected visitor
                 *
                 * @type {Object}
                 */
                $scope.visitor = $scope.defaultVisitor;
                $scope.visitors = [];

                $scope.addressForm = function () {
                    $location.path("/visitor/address/" + $scope.visitor._id);
                };

                $scope.getFullName = function () {
                    return $scope.visitor.first_name + " " + $scope.visitor.last_name;                  // jshint ignore:line
                };

                /**
                 * Gets list all attributes of visitor
                 */
                $visitorApiService.attributesInfo().$promise.then(
                    function (response) {
                        var result = response.result || [];
                        $scope.attributes = result;
                    });

                /**
                 * Gets list of visitors
                 */
                $visitorApiService.visitorList().$promise.then(
                    function (response) {
                        var result, i;
                        result = response.result || [];
                        for (i = 0; i < result.length; i += 1) {
                            $scope.visitors.push(result[i]);
                        }
                    });

                /**
                 * Handler event when selecting the visitor in the list
                 *
                 * @param id
                 */
                $scope.select = function (id) {
                    $visitorApiService.load({"id": id}).$promise.then(
                        function (response) {
                            var result = response.result || {};
                            $scope.visitor = result;
                            if ($scope.visitor.shipping_address !== null) {                                 // jshint ignore:line
                                $scope.visitor.shipping_address_id = $scope.visitor.shipping_address._id;   // jshint ignore:line
                            }
                            if ($scope.visitor.billing_address !== null) {                                  // jshint ignore:line
                                $scope.visitor.billing_address_id = $scope.visitor.billing_address._id;     // jshint ignore:line
                            }
                        });
                };

                /**
                 * Clears the form to create a new visitor
                 */
                $scope.clearForm = function () {
                    $scope.visitor = getDefaultVisitor();
                };

                /**
                 * Removes visitor by ID
                 *
                 * @param {string} id
                 */
                $scope.remove = function (id) {
                    var i, answer;
                    answer = window.confirm("You really want to remove this visitor");
                    if (answer) {
                        $visitorApiService.remove({"id": id}, function (response) {
                            if (response.result === "ok") {
                                for (i = 0; i < $scope.visitors.length; i += 1) {
                                    if ($scope.visitors[i].Id === id) {
                                        $scope.visitors.splice(i, 1);
                                        $scope.visitor = $scope.defaultVisitor;
                                    }
                                }
                            }
                        });
                    }
                };

                $scope.getName = function () {
                    return "first_name";
                };

                /**
                 * Event handler to save the visitor data.
                 * Creates new visitor if ID in current visitor is empty OR updates current visitor if ID is set
                 */
                $scope.save = function () { // jshint ignore:line
                    var id, saveSuccess, saveError, updateSuccess, updateError;
                    if (typeof $scope.visitor !== "undefined") {
                        id = $scope.visitor.id || $scope.visitor._id;
                    }

                    /**
                     *
                     * @param response
                     */
                    saveSuccess = function (response) {
                        if (response.error === "") {
                            $scope.visitors.push({
                                "Id": response.result._id,
                                "Name": response.result.first_name + " " + response.result.last_name         // jshint ignore:line
                            });
                        }
                    };

                    /**
                     *
                     * @param response
                     */
                    saveError = function () {};

                    /**
                     *
                     * @param response
                     */
                    updateSuccess = function (response) {
                        var i;
                        if (response.error === "") {
                            for (i = 0; i < $scope.visitors.length; i += 1) {
                                if ($scope.visitors[i].Id === response.result._id) {
                                    $scope.visitors[i].Name = response.result.first_name + " " + response.result.last_name;     // jshint ignore:line
                                }
                            }
                        }
                    };

                    /**
                     *
                     * @param response
                     */
                    updateError = function () {};

                    /**
                     * @todo: review this approach with 'delete'
                     */
                    delete $scope.visitor.billing_address;                                              // jshint ignore:line
                    delete $scope.visitor.shipping_address;                                             // jshint ignore:line

                    if (!id) {
                        $visitorApiService.save($scope.visitor, saveSuccess, saveError);
                    } else {
                        $scope.visitor.id = id;
                        if ($scope.visitor.shipping_address_id === "") {                                // jshint ignore:line
                            delete $scope.visitor.shipping_address_id;                                  // jshint ignore:line
                        }
                        if ($scope.visitor.billing_address_id === "") {                                 // jshint ignore:line
                            delete $scope.visitor.billing_address_id;                                   // jshint ignore:line
                        }
                        $visitorApiService.update($scope.visitor, updateSuccess, updateError);
                    }
                };

            }]);
        return visitorModule;
    });
})(window.define);
