angular.module("visitorModule")

.controller("reviewsListController", [
"$rootScope",
"$scope",
"$location",
"$routeParams",
"$q",
"dashboardListService",
"visitorApiService",
"COUNT_ITEMS_PER_PAGE",
function ($rootScope, $scope, $location, $routeParams, $q, DashboardListService, visitorApiService, COUNT_ITEMS_PER_PAGE) {

    var serviceList = new DashboardListService();
    var showColumns = {
        username : {},
        approved : {},
        rating : {},
        review : {},
        created_at : {label : 'Created At', type : 'date'}
    };

    $scope.reviews; // []
    $scope.fields;        // []
    $scope.count = 0;
    $scope.select = select;
    $scope.idsSelectedRows = {};

    $scope.mapping = {
        id: '_id'
    };

    activate();

    //////////////////////////////

    function activate() {

        // test if it is an empty object
        if (JSON.stringify({}) === JSON.stringify($location.search())) {
            $location.search({
                sort: '^created_at',
                limit: '0,50',
            }).replace();
        }

        getCount();
        setAttributes();
        getList();
    }

    function getList() {
        var params = $location.search();
        params["extra"] = serviceList.getExtraFields();

        visitorApiService.reviewList(params).$promise.then(
            function (response) {
                $scope.reviews = response.result || [];
            }
        );
    }

    function getCount() {
        visitorApiService.getCount($location.search(), {}).$promise
            .then(function (response) {
                $scope.count = (!response.error && response.result) ? response.result : 0;
            });
    }

    function setAttributes() {
        var result =[
            {
              "Attribute": "username",
              "Type": "varchar",
              "Label": "Customer Name",
              "IsStatic": true,
              "Editors": "line_text",
            },
            {
                Attribute : "approved",
                Editors : "boolean",
                IsLayered : false,
                IsPublic : false,
                IsRequired : true,
                IsStatic : true,
                Label : "Is approved",
                Options : "",
                Type : "bool",
                Validators : ""
            },
            {
              "Attribute": "rating",
              "Type": "varchar",
              "Label": "Rating",
              "IsStatic": true,
              "Editors": "select",
              "Options": "{1,2,3,4,5}",
            },
            {
              "Attribute": "created_at",
              "Type": "datetime",
              "Label": "Created At",
              "IsStatic": true,
              "Editors": "not_editable",
            },
          ];

        serviceList.setAttributes(result);
        $scope.fields = serviceList.getFields(showColumns);
    }

    function select(id) {
        $location.path("/review/" + id);
    }

    var hasSelectedRows = function () {
        var result = false;
        for (var _id in $scope.idsSelectedRows) {
            if ($scope.idsSelectedRows.hasOwnProperty(_id) && $scope.idsSelectedRows[_id]) {
                result = true;
            }
        }
        return result;
    };

    /**
     * Remove review by ID
     *
     */
    $scope.remove = function () {
        if (!hasSelectedRows()) {
            return true;
        }

        var answer, _remove;
        answer = window.confirm("Are you really want to remove this review(s)?");
        _remove = function (id) {
            var defer = $q.defer();

            visitorApiService.deleteReview({"reviewID": id},
                function (response) {
                    if (response.result === "ok") {
                        defer.resolve(id);
                    } else {
                        defer.resolve(false);
                    }
                }
            );

            return defer.promise;
        };
        if (answer) {
            $('[ng-click="parent.remove()"]').addClass('disabled').append('<i class="fa fa-spin fa-spinner"><i>').siblings('.btn').addClass('disabled');

            for (var id in $scope.idsSelectedRows) {
                if ($scope.idsSelectedRows.hasOwnProperty(id) && true === $scope.idsSelectedRows[id]) {
                    _remove(id);
                }
            }
        }
        $('[ng-click="parent.remove()"]').removeClass('disabled').children('i').remove();
        $('[ng-click="parent.remove()"]').siblings('.btn').removeClass('disabled');

    };

}]);
