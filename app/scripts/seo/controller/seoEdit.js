(function (define) {
    "use strict";

    define(["seo/init"], function (seoModule) {
        seoModule
            .controller("seoEditController", [
                "$scope",
                "$seoService",
                "$dashboardUtilsService",
                function ($scope, $seoService, $dashboardUtilsService) {

                    var isInit, seo, seoFields, itemName, hasAttribute, save, remove, isModifySave, isInitUrlRewrite,
                        modifyRemoveMethod, isModifyRemove, modifySaveMethod, addAttributes, addAttributesValue, getDefaultSeo,
                        removeAttributes, saveSeo;

                    $seoService.init();

                    getDefaultSeo = function () {
                        var defObj = $seoService.getDefaultSeo();
                        defObj.rewrite = typeof $scope[itemName] !== "undefined" ? $scope[itemName]._id : "";
                        defObj.type = itemName;
                        return defObj;
                    };

                    seoFields = $seoService.getSeoFields();
                    isModifySave = false;
                    isModifyRemove = false;
                    isInitUrlRewrite = false;
                    isInit = false;

                    /**
                     * Checks on the existing attribute
                     *
                     * @param {string} attr
                     * @returns {boolean}
                     */
                    hasAttribute = function (attr) {
                        var i, flag;
                        flag = false;
                        if (typeof $scope.attributes !== "undefined") {

                            for (i = 0; i < $scope.attributes.length; i += 1) {
                                if ($scope.attributes[i].Attribute === attr && $scope.attributes[i].Group === "SEO") {
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        return flag;
                    };

                    saveSeo = function (oldSeo) {
                        var existingSeo = $seoService.find(itemName, oldSeo.rewrite);
                        if (existingSeo) {
                            var callback = function (response) {
                                seo._id = response.result[0]._id;
                                $seoService.update(seo).then(
                                    function (response) {
                                        seo = response || null;
                                        for (var i = 0; i < seoFields.length; i += 1) {

                                            $scope[itemName][seoFields[i]] = seo[seoFields[i]];
                                        }
                                        isInitUrlRewrite = true;
                                    }
                                );
                            };
                            $seoService.get(oldSeo.url).then(callback);
                        } else {
                            $seoService.save(seo).then(
                                function (response) {
                                    seo = response || null;
                                    for (var i = 0; i < seoFields.length; i += 1) {

                                        $scope[itemName][seoFields[i]] = seo[seoFields[i]];
                                    }
                                    isInitUrlRewrite = true;
                                }
                            );

                            isInitUrlRewrite = true;
                        }
                    };

                    /**
                     * Overrides the method save
                     */
                    modifySaveMethod = function () {
                        if (!isModifySave) {

                            save = $scope.save;
                            delete $scope.save;

                            if (typeof seo._id === "undefined" && seo.url !== "") {
                                $seoService.get(seo.url).then(function (response) {
                                    if (response.result !== null) {
                                        for (var i = 0; i < seoFields.length; i += 1) {
                                            $scope[itemName][seoFields[i]] = response.result[0][seoFields[i]];
                                        }
                                    }
                                });
                            }

                            $scope.save = function () {
                                var oldSeo = $dashboardUtilsService.clone(seo);
                                for (var i = 0; i < seoFields.length; i += 1) {
                                    seo[seoFields[i]] = $scope[itemName][seoFields[i]];

                                    delete $scope[itemName][seoFields[i]];
                                }

                                save().then(
                                    function () {
                                        saveSeo(oldSeo);
                                    }
                                );

                            };

                            isInitUrlRewrite = false;
                            isModifySave = true;
                        }
                    };

                    /**
                     * Overrides the method review. Added remove rewrite rules
                     */
                    modifyRemoveMethod = function () {
                        if (!isModifyRemove) {

                            remove = $scope.remove;
                            delete $scope.remove;

                            $scope.remove = function () {
                                var seo;
                                var callback = function (response) {
                                    if (response.result !== null) {
                                        $seoService.remove(response.result[0]);
                                    }
                                };
                                for (var id in $scope.idsSelectedRows) {
                                    if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                                        seo = $seoService.find(itemName, id);
                                        if (seo !== null) {
                                            $seoService.get(seo.url).then(callback);
                                        }
                                    }
                                }

                                remove(id);
                            };

                            isInitUrlRewrite = false;
                            isModifyRemove = true;
                        }
                    };

                    /**
                     * Initializes module
                     *
                     * @param {string} item - Type item with which will be work. Name object in child scope
                     */
                    $scope.initSeo = function (item) {
                        $scope = this;
                        itemName = item;
                        isModifySave = false;
                        isModifyRemove = false;
                        isInitUrlRewrite = false;
                        isInit = true;
                        seo = getDefaultSeo();
                    };

                    /**
                     * Adds attributes for seo
                     */
                    addAttributes = function () {
                        if (typeof $scope.attributes !== "undefined") {
                            for (var i = 0; i < seoFields.length; i += 1) {
                                if (!hasAttribute(seoFields[i])) {
                                    $scope.attributes.push({
                                        "Attribute": seoFields[i],
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
                    };

                    removeAttributes = function () {
                        if (typeof $scope.attributes !== "undefined") {

                            for (var i = 0; i < $scope.attributes.length; i += 1) {
                                if (seoFields.indexOf($scope.attributes[i].Attribute) !== -1) {
                                    $scope.attributes.splice(i, 1);
                                }
                            }

                        }
                    };

                    /**
                     * Filling attributes for seo
                     */
                    addAttributesValue = function () {
                        if (typeof $scope[itemName] !== "undefined" && !isInitUrlRewrite) {

                            seo = $seoService.find(itemName, $scope[itemName]._id);
                            if (seo === null) {
                                seo = getDefaultSeo();
                            }
                            for (var i = 0; i < seoFields.length; i += 1) {
                                $scope[itemName][seoFields[i]] = seo[seoFields[i]];
                            }
                            isInitUrlRewrite = true;
                        }
                    };

                    /**
                     * Watches for the attributes
                     */
                    $scope.$watch(function () {
                        if (!isInit) {
                            return false;
                        }

                        return $scope.attributes;
                    }, function () {
                        if (!isInit) {
                            return false;
                        }
                        if (typeof $scope[itemName] !== "undefined" && typeof $scope[itemName]._id !== "undefined") {
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

                }
            ]
        )
        ;
        return seoModule;
    });
})(window.define);
