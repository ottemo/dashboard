angular.module("seoModule")

.controller("seoEditController", [
    "$scope",
    "seoService",
    "dashboardUtilsService",
    "$timeout",
    function ($scope, seoService, dashboardUtilsService) {

        var seo, itemName;

        var seoFields = seoService.getSeoFields(),
            seoUniqueFields = [],
            isModifySave = false,
            isModifyRemove = false,
            isInitUrlRewrite = false,
            isInit = false;

        var seoServiceInitPromise = seoService.init();

        /////////////////////////////////////////////////

        function getDefaultSeo() {
            var defaultSeoItem = seoService.getDefaultSeo();

            defaultSeoItem.rewrite = $scope[itemName] !== undefined ? $scope[itemName]._id : '';
            defaultSeoItem.type = itemName;

            return defaultSeoItem;
        }

        /**
         * Checks on the existing attribute
         */
        function hasSeoAttribute(attributeName, attributes) {
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].Attribute === attributeName && attributes[i].Group === 'SEO') {
                    return true;
                }
            }

            return false;
        }

        /**
         * Checks existing attributes and add "seo_"
         * to seo attribute names that can replace original
         * unique fields are saved in seoUniqueFields variable
         *
         */
        function getUniqueSeoNames() { /*jshint maxcomplexity:6 */
            if (typeof $scope.attributes !== "undefined" && seoUniqueFields.length < 1) {
                var seoUniqueNames = seoUniqueFields;
                var i, uniqueSeoFirstWord = "seo_", existingAttributes = [];

                for (i = 0; i < $scope.attributes.length; i += 1) {
                    if ($scope.attributes[i].Group !== "SEO") {
                        existingAttributes[$scope.attributes[i].Attribute] = "";
                    }
                }

                for (i = 0; i < seoFields.length; i += 1) {
                    seoUniqueNames[i] = seoFields[i];
                    if (existingAttributes.hasOwnProperty(seoFields[i])) {
                        seoUniqueNames[i] = uniqueSeoFirstWord + seoUniqueNames[i];
                    }
                }
            }
        }

        function saveSeo(oldSeo) {
            var existingSeo = seoService.find(itemName, oldSeo.rewrite);
            if (existingSeo) {
                var callback = function (response) {
                    seo._id = response.result._id;
                    seoService.update(seo).then(
                        function (response) {
                            seo = response || null;
                            for (var i = 0; i < seoFields.length; i += 1) {
                                $scope[itemName][seoUniqueFields[i]] = seo[seoFields[i]];
                            }
                            isInitUrlRewrite = true;
                        }
                    );
                };
                seoService.canonical(oldSeo._id).then(callback);
            } else {
                seoService.save(seo).then(
                    function (response) {
                        seo = response || null;
                        for (var i = 0; i < seoFields.length; i += 1) {
                            $scope[itemName][seoUniqueFields[i]] = seo[seoFields[i]];
                        }
                        isInitUrlRewrite = true;
                    }
                );

                isInitUrlRewrite = true;
            }
        }

        /**
         * Overrides the method save
         */
        function modifySaveMethod() {
            if (!isModifySave) {
                var itemSaveHandler = $scope.save;
                delete $scope.save;

                if (typeof seo._id === "undefined" && seo.url !== "") {
                    seoService.canonical(seo._id).then(function (response) {
                        if (response.result !== null) {
                            for (var i = 0; i < seoFields.length; i += 1) {
                                $scope[itemName][seoUniqueFields[i]] = response.result[seoFields[i]];
                            }
                        }
                    });
                }

                $scope.save = function () {
                    var oldSeo = dashboardUtilsService.clone(seo);
                    for (var i = 0; i < seoFields.length; i += 1) {
                        seo[seoFields[i]] = $scope[itemName][seoUniqueFields[i]];

                        delete $scope[itemName][seoUniqueFields[i]];
                    }

                    return itemSaveHandler().then(
                        function () {
                            saveSeo(oldSeo);
                        }
                    );

                };

                isInitUrlRewrite = false;
                isModifySave = true;
            }
        }

        /**
         * Overrides the method review. Added remove rewrite rules
         */
        function modifyRemoveMethod() {
            if (!isModifyRemove) {
                var itemRemoveHandler = $scope.remove;
                delete $scope.remove;

                $scope.remove = function () {
                    var seo;
                    var callback = function (response) {
                        if (response.result !== null) {
                            seoService.remove(response.result);
                        }
                    };
                    for (var id in $scope.idsSelectedRows) {
                        if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                            seo = seoService.find(itemName, id);
                            if (seo !== null) {
                                seoService.canonical(seo._id).then(callback);
                            }
                        }
                    }

                    return itemRemoveHandler(id);
                };

                isInitUrlRewrite = false;
                isModifyRemove = true;
            }
        }

        /**
         * Initializes module
         *
         * @param {string} item - Type item with which will be work. Name object in child scope
         */
        $scope.initSeo = function(item) {
            var self = this;

            seoServiceInitPromise.then(function() {
                $scope = self;
                isModifySave = false;
                isModifyRemove = false;
                itemName = item;
                isInitUrlRewrite = false;
                isInit = true;
                seo = getDefaultSeo();

                /**
                 * Watches for the attributes
                 */
                $scope.$watch(function() {
                    if (!isInit) {
                        return false;
                    }

                    return $scope.attributes;

                }, function () {
                    if (!isInit) {
                        return false;
                    }

                    if (typeof $scope[itemName] !== "undefined" && $scope[itemName]._id != undefined) {
                        getUniqueSeoNames();
                        addAttributes();
                        addAttributesValue();
                        modifySaveMethod();
                    } else {
                        modifyRemoveMethod();
                        removeAttributes();
                    }
                }, true);

                /**
                 * Watches for the selected item in child scope
                 */
                $scope.$watch(function () {
                    if (!isInit || typeof $scope[itemName] === "undefined") {
                        return false;
                    }

                    return $scope[itemName]._id;
                }, function () {
                    if (!isInit) {
                        return false;
                    }

                    isInitUrlRewrite = false;

                }, true);
            })
        };

        /**
         * Adds attributes for seo
         */
        function addAttributes() {
            if ($scope.attributes !== undefined) {
                for (var i = 0; i < seoUniqueFields.length; i++) {
                    if (!hasSeoAttribute(seoUniqueFields[i], $scope.attributes)) {

                        $scope.attributes.push({
                            "Attribute": seoUniqueFields[i],
                            "Collection": "product",
                            "Default": "",
                            "Editors": "text",
                            "Group": "SEO",
                            "IsRequired": false,
                            "IsStatic": true,
                            "Label": seoFields[i].charAt(0).toUpperCase() + seoFields[i].slice(1),
                            "Model": "Product",
                            "Options": "",
                            "Type": "text",
                            "Value": ""
                        });
                    }
                }
            }
        }

        function removeAttributes() {
            if (typeof $scope.attributes !== "undefined") {
                for (var i=0; i < $scope.attributes.length; i+=1) {
                    if (seoUniqueFields.indexOf($scope.attributes[i].Attribute) !== -1 && $scope.attributes[i].Group === "SEO") {
                        $scope.attributes.splice(i, 1);
                    }
                }

            }
        }

        /**
         * Filling attributes for seo
         */
        function addAttributesValue() {
            if (typeof $scope[itemName] !== "undefined" && !isInitUrlRewrite) {
                seo = seoService.find(itemName, $scope[itemName]._id);
                if (seo === null) {
                    seo = getDefaultSeo();
                }
                for (var i = 0; i < seoFields.length; i += 1) {
                    $scope[itemName][seoUniqueFields[i]] = seo[seoFields[i]];
                }
                isInitUrlRewrite = true;
            }
        }
}]);
