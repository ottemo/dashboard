angular.module("seoModule")

.controller("seoIndependentEditController", [
    "$scope",
    "$routeParams",
    "$location",
    "$q",
    "$seoApiService",
    "$dashboardUtilsService",
    function ($scope, $routeParams, $location, $q, $seoApiService, $dashboardUtilsService) {
        // Functions
        var getAttributeList, getDefaultSEO, checkAttributePosition, getRewriteList;
        // Variables
        var seoId, seoAttributes, seoRewriteNum, seoRewriteList;


        seoRewriteNum = 5;
        seoAttributes = {"url":{"IsRequired": true, "Label": "URL"},
            "title":{},
            "meta_keywords":{},
            "meta_description":{},
            "type":{"IsRequired": true, "Editors": "select", "Options": "page,category,product", "Default": "page"},
            "rewrite":{"IsRequired": true, "Label": "Object"}
        };

		seoId = $routeParams.id;

        if (!seoId && seoId !== "new") {
            $location.path("/seo");
        }

        if (seoId === "new") {
			seoId = null;
        }

        getDefaultSEO = function () {
            return {
                "url": "",
                "title": "",
                "type": "",
                "meta_keywords": "",
                "meta_description": ""
            };
        };

        $scope.seo = {};

        getAttributeList = function() {
            $scope.attributes = [];

            for (var attributeName in seoAttributes) {
                if (typeof seoAttributes[attributeName] !== "undefined") {
                    var obj = {
                        "Attribute": attributeName,
                        "Collection": "seo",
                        "Default": "",
                        "Editors": "text",
                        "Group": "SEO",
                        "IsRequired": false,
                        "IsStatic": true,
                        "Label": attributeName.charAt(0).toUpperCase() + attributeName.slice(1),
                        "Model": "Seo",
                        "Options": "",
                        "Type": "text",
                        "Value": ""
                    };

                    for (var attributeKeys in seoAttributes[attributeName]) {
                        if  ( obj.hasOwnProperty(attributeKeys) ) {
                            obj[attributeKeys] = seoAttributes[attributeName][attributeKeys];
                        }
                    }
                    $scope.attributes.push(obj);
                }
            }
        };

        getAttributeList();

         /**
         * Gets values for url rewrites :(
         */
        var getSeoValues = function(id) {
                $seoApiService.canonical({"id": id}).$promise.then(
                    function (response) {
                        seoRewriteList[response.result["rewrite"]] = response.result["_id"];
                    }
                );
        };

        getRewriteList = function () {
            $seoApiService.list().$promise.then(
                function (response) {
                    seoRewriteList = {};
                    var i, seoList = response.result || [];
                    for (i = 0; i < seoList.length; i += 1) {
                        getSeoValues(seoList[i]["_id"]);
                    }
                }
            );
        };

        getRewriteList();

        if (null !== seoId) {
            $seoApiService.canonical({"id": seoId}).$promise.then(function (response) {
                var result = response.result || {};
                $scope.seo = result;
            });
        }

        $scope.back = function () {
            $location.path("/seo");
        };

        /**
         * Event handler to save the seo data.
         * Creates new seo if ID in current seo is empty OR updates current seo if ID is set
         */
        $scope.save = function () { /*jshint maxcomplexity:9 */
            $('[ng-click="save()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

            var id, defer, saveSuccess, saveError, updateSuccess, updateError, regexp = /^\w*/;
            defer = $q.defer();

            if (typeof $scope.seo !== "undefined") {
                id = $scope.seo.Id || $scope.seo._id;
            }

            /**
             *
             * @param response
             */
            saveSuccess = function (response) {
                if (response.error === null) {
                    $scope.seo = response.result || getDefaultSEO();
                    $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'URL rewrite was created successfully');
                    defer.resolve(true);
                }
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            };

            /**
             *
             * @param response
             */
            saveError = function () {
                defer.resolve(false);
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            };

            /**
             *
             * @param response
             */
            updateSuccess = function (response) {
                if (response.error === null) {
                    $scope.seo = response.result || getDefaultSEO();
                    $scope.message = $dashboardUtilsService.getMessage(null, 'success', 'URL rewrite was updated successfully');
                    defer.resolve(true);
                    $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                    $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
                }
            };

            /**
             *
             * @param response
             */
            updateError = function () {
                defer.resolve(false);
                $('[ng-click="save()"]').removeClass('disabled').children('i').remove();
                $('[ng-click="save()"]').siblings('.btn').removeClass('disabled');
            };

            /**
            * Check for valid rewrite and url if not, drop a message for it
            * checking is rewrite don't replace existing
            */
            if (!$scope.seo.rewrite || $scope.seo.rewrite === "" || $scope.seo.rewrite.length < 4 || !regexp.test($scope.seo.url)) {
                $scope.message = $dashboardUtilsService.getMessage(null, 'warning', 'Need to specify object to rewrite and valid url');
                updateError();
            } else {
                if (typeof seoRewriteList[$scope.seo.rewrite] === "undefined") {
                    if (typeof id !== "undefined") {
                        $seoApiService.update({"itemID": id}, $scope.seo, updateSuccess, updateError);
                    } else {
                        $seoApiService.add($scope.seo, saveSuccess, saveError);
                    }
                }
                else {
                    if (id === seoRewriteList[$scope.seo.rewrite]) {
                        $seoApiService.update({"itemID": id}, $scope.seo, updateSuccess, updateError);
                    }
                    $scope.message = $dashboardUtilsService.getMessage(null, 'warning', 'Rewrite for this object is already exist');
                    saveError();
                }
            }

            return defer.promise;
        };

        checkAttributePosition = function () {
            if ($scope.attributes[seoRewriteNum]["Attribute"] === "rewrite") {
                return seoRewriteNum;
            } else {
                for (var i=0; i < $scope.attributes.length; i+=1){
                    if ($scope.attributes[i]["Attribute"] === "rewrite") {
                        seoRewriteNum = i;
                        return i;
                    }
                }
            }
        };

        $scope.$watch(function () {
                return $scope.seo.type;

        }, function (newVal, oldVal) {/*jshint maxcomplexity:6 */
            if (typeof $scope.attributes !== "undefined") {
                checkAttributePosition();
                if (typeof newVal !== "undefined" && typeof oldVal !== "undefined"){
                    $scope.seo.rewrite = "";
                }
                switch (newVal) {
                    case "category":
                        $scope.attributes[seoRewriteNum]["Editors"] = "category_selector";
                        break;

                    case "product":
                        $scope.attributes[seoRewriteNum]["Editors"] = "products_selector";
                        break;

                    case "page":
                        $scope.attributes[seoRewriteNum]["Editors"] = "page_selector";
                        break;

                    default:
                        $scope.attributes[seoRewriteNum]["Editors"] = "not_editable";
                }
            }
        }, true);
    }
]);
