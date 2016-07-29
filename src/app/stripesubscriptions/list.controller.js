angular.module("stripeSubscriptionsModule")

.controller("stripeSubscriptionsListController", [
"$rootScope",
"$scope",
"$location",
"$routeParams",
"$q",
"dashboardListService",
"stripeSubscriptionsApiService",
"COUNT_ITEMS_PER_PAGE",
function ($rootScope, $scope, $location, $routeParams, $q, DashboardListService, stripeSubscriptionsApiService, COUNT_ITEMS_PER_PAGE) {

    var serviceList = new DashboardListService();
    var showColumns = {
        _id : {type: 'select-link', label : 'Subscription ID', filter: 'text'},
        customer_email : {},
        customer_name : {},
        status : {},
        created_at : {label : 'Created At', type : 'date'}
    };

    $scope.subscriptions; // []
    $scope.fields;        // []
    $scope.count = 0;
    $scope.select = select;

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

        stripeSubscriptionsApiService.list(params).$promise.then(
            function (response) {
                var result = response.result || [];
                $scope.subscriptions = serviceList.getList(result);
            }
        );
    }

    function getCount() {
        stripeSubscriptionsApiService.getCount().$promise
            .then(function (response) {
                $scope.count = (!response.error && response.result) ? response.result : 0;
            });
    }

    function setAttributes() {
        var result =[
            {
              "Attribute": "_id",
              "Type": "id",
              "Label": "ID",
              "IsStatic": true,
              "Editors": "not_editable",
            },
            {
              "Attribute": "customer_email",
              "Type": "varchar",
              "Label": "Customer Email",
              "IsStatic": true,
              "Editors": "line_text",
            },
            {
              "Attribute": "customer_name",
              "Type": "varchar",
              "Label": "Customer Name",
              "IsStatic": true,
              "Editors": "line_text",
            },
            {
              "Attribute": "status",
              "Type": "varchar",
              "Label": "Status",
              "IsStatic": true,
              "Editors": "selector",
              "Options": "suspended,confirmed,canceled",
            },
            {
              "Attribute": "created_at",
              "Type": "datetime",
              "Label": "Created At",
              "IsStatic": true,
              "Editors": "not_editable",
            },
          ];

        serviceList.init('stripesubscriptions'); // not sure what this does
        serviceList.setAttributes(result);
        $scope.fields = serviceList.getFields(showColumns);
    }

    function select(id) {
        $location.path("/stripesubscriptions/" + id).search('');
    }

}]);
