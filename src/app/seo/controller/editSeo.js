angular.module("seoModule")

	.controller("seoEditController", [
		"$scope",
		"$seoService",
		"$dashboardUtilsService",
		"$timeout",
		function ($scope, $seoService, $dashboardUtilsService, $timeout) {

			var isInit, seo, seoFields, seoUniqueFields, itemName, hasAttribute, save, remove, isModifySave, isInitUrlRewrite,
				modifyRemoveMethod, isModifyRemove, modifySaveMethod, addAttributes, addAttributesValue, getDefaultSeo,
				removeAttributes, saveSeo, getUniqueSeoNames;

			$seoService.init();

			getDefaultSeo = function () {
				var defObj = $seoService.getDefaultSeo();
				defObj.rewrite = typeof $scope[itemName] !== "undefined" ? $scope[itemName]._id : "";
				defObj.type = itemName;
				return defObj;
			};

			seoFields = $seoService.getSeoFields();
			seoUniqueFields = [];
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

			/**
			 * Checks existing attributes and add "seo_"
			 * to seo attribute names that can replace original
			 * unique fields are saved in seoUniqueFields variable
			 *
			 */
			getUniqueSeoNames = function () { /*jshint maxcomplexity:6 */
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
			};

			saveSeo = function (oldSeo) {
				var existingSeo = $seoService.find(itemName, oldSeo.rewrite);
				if (existingSeo) {
					var callback = function (response) {
						seo._id = response.result._id;
						$seoService.update(seo).then(
							function (response) {
								seo = response || null;
								for (var i = 0; i < seoFields.length; i += 1) {
									$scope[itemName][seoUniqueFields[i]] = seo[seoFields[i]];
								}
								isInitUrlRewrite = true;
							}
						);
					};
					$seoService.get(oldSeo._id).then(callback);
				} else {
					$seoService.save(seo).then(
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
			};

			/**
			 * Overrides the method save
			 */
			modifySaveMethod = function () {
				if (!isModifySave) {
					save = $scope.save;
					delete $scope.save;

					if (typeof seo._id === "undefined" && seo.url !== "") {
						$seoService.get(seo._id).then(function (response) {
							if (response.result !== null) {
								for (var i = 0; i < seoFields.length; i += 1) {
									$scope[itemName][seoUniqueFields[i]] = response.result[seoFields[i]];
								}
							}
						});
					}

					$scope.save = function () {
						var oldSeo = $dashboardUtilsService.clone(seo);
						for (var i = 0; i < seoFields.length; i += 1) {
							seo[seoFields[i]] = $scope[itemName][seoUniqueFields[i]];

							delete $scope[itemName][seoUniqueFields[i]];
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
								$seoService.remove(response.result);
							}
						};
						for (var id in $scope.idsSelectedRows) {
							if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
								seo = $seoService.find(itemName, id);
								if (seo !== null) {
									$seoService.get(seo._id).then(callback);
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
					for (var i=0; i < seoUniqueFields.length; i+=1) {
						if (!hasAttribute(seoUniqueFields[i])) {
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
			};

			removeAttributes = function () {
				if (typeof $scope.attributes !== "undefined") {
					for (var i=0; i < $scope.attributes.length; i+=1) {
						if (seoUniqueFields.indexOf($scope.attributes[i].Attribute) !== -1 && $scope.attributes[i].Group === "SEO") {
							$scope.attributes.splice(i, 1);
						}
					}

				}
			};

			/**
			 * Filling attributes for seo
			 */
			addAttributesValue = function () {
				$timeout(function() {
					if (typeof $scope[itemName] !== "undefined" && !isInitUrlRewrite) {
						seo = $seoService.find(itemName, $scope[itemName]._id);
						if (seo === null) {
							seo = getDefaultSeo();
						}
						for (var i = 0; i < seoFields.length; i += 1) {
							$scope[itemName][seoUniqueFields[i]] = seo[seoFields[i]];
						}
						isInitUrlRewrite = true;
					}
				}, 1000);
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

		}
	]
);
