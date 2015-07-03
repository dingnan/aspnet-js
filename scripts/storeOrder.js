'use strict';

var storeApp = angular.module('storeApp', ['ngRoute', 'ui.bootstrap', 'ui.utils', 'ngplus', 'storeModule']);

storeApp.run([
    "$rootScope", function ($rootScope) {
        $rootScope.$on("$routeChangeSuccess", function (e, current) {
            $rootScope.query = $.param(current.params);
        });
    }
]);

storeApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.when("/productList", {
        controller: "productListController",
        templateUrl: "productList.html"
    });

    $routeProvider.when("/shoppingCart", {
        controller: "shoppingCartController",
        templateUrl: "shoppingCart.html"
    });

    $routeProvider.when("/orderSummary", {
        controller: "orderSummaryController",
        templateUrl: "orderSummary.html"
    });

    $routeProvider.otherwise({ redirectTo: "/productList" });
    $httpProvider.defaults.withCredentials = true;
}]);

storeApp.factory('productDataTransformer', function () {
    return {
        toServerModel: function (model) {
        },
        toClientModel: function (model, serverData) {
        }
    };
});

storeApp.factory('storeOrderModel', ['productDataTransformer', '$http', 'settings', '$location', '$q', function (productDataTransformer, $http, settings, $location, $q) {

    /**
     * lookup values
     */

    var sortBy = [
        { id: 0, desc: 'Featured' },
        { id: 1, desc: 'Price: Low to High' },
        { id: 1, desc: 'Price: High to Low' }
    ];


    /**
      * private helper functions
      */

    function calculateAge(dob) {
        var birthday = null;
        if (angular.isDate(dob))
            birthday = dob;
        else
            birthday = new Date(dob);

        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    function getPhone(phones) {
        if (angular.isArray(phones) && phones.length > 0) {
            var primary = phones.filter(function (phone) {
                return phone.isPrimary;
            });

            if (primary.length > 0)
                return primary[0].phoneNumber;
        }

        return '';
    }

    function loadCustomerInfo() {
        
        $.getJSON(settings.webApiUrl + '/data/customer.json', function (json) {
            console.log(json); // this will show the info it in firebug console
        });
        var d = $q.defer();
        //Get Customer Data 
        var url = settings.webApiUrl + '/data/customer.json';
        $http.get(url).then(function (response) {
            if (response.data == 'null') {
                model.user = null;
                d.reject();
            } else {
                model.user = response.data;
                if (!!model.user.dateOfBirth)
                    model.user.age = calculateAge(model.user.dateOfBirth);

                model.user.phone = getPhone(model.user.phones);
                d.resolve();
            }
        }, function (reason) {
            model.messages.push(
                { type: 'danger', msg: reason.statusText }
            );
            d.reject();
        });

        return d.promise;
    }

    function loadCustomerOrderHistory() {
        var d = $q.defer();
        var url = settings.webApiUrl + '/api/customer/orderHistory';
        $http.get(url).then(function (response) {
            if (response.data == 'null')
                model.orders = [];
            else
                model.orders = response.data || [];

            d.resolve();
        }, function (reason) {
            model.messages.push(
                { type: 'danger', msg: reason.statusText }
            );
            d.reject();
        });

        return d.promise;
    }

    function loadCustomer() {
        var p1 = loadCustomerInfo();
        var p2 = loadCustomerOrderHistory();
        return $q.all([p1, p2]);
    }

    function loadProductList() {
        var d = $q.defer();
        var url = settings.webApiUrl + '/api/products';
        $http.get(url).then(function (response) {
            if (response.data == 'null')
                model.products = [];
            else
                model.products = response.data || [];

            d.resolve();
        }, function (reason) {
            model.messages.push(
                { type: 'danger', msg: reason.statusText }
            );
            d.reject();
        });

        return d.promise;
    }

    /**
      * construct client side model
      */
    var model = {
        sortBy: sortBy,
        orderItems: [],
        messages: []
    };

    var q1 = loadProductList();
    var q2 = $q.when(model);
    var q3 = loadCustomer();

    return $q.all([q1, q2, q3]);
}]);

storeApp.controller('AlertCtrl', ['$scope', 'storeOrderModel',
    function ($scope, storeOrderModel) {
        storeOrderModel.then(function (data) {
            $scope.alerts = data[1].messages;

            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };
        });
    }
]);

storeApp.controller("productListController", ['$scope', '$http', 'storeOrderModel',
    function ($scope, $http, storeOrderModel) {
        storeOrderModel.then(function (data) {
            $scope.model = data[1];
        });
    }
]);

storeApp.controller("shoppingCartController", ['$scope', '$http', 'storeOrderModel', 'settings',
    function ($scope, $http, storeOrderModel, settings) {
        storeOrderModel.then(function (results) {

            $scope.model = results[1];

            $scope.checkout = function () {
                // checkout process
                // charge credit card
                // confirm shipping address
            };
        });
    }
]);

storeApp.controller('orderSummaryController', ['$scope', '$http', 'settings', 'storeOrderModel', 'productDataTransformer',
    function ($scope, $http, settings, storeOrderModel, productDataTransformer) {
        storeOrderModel.then(function (results) {

            $scope.model = results[1];

            $scope.confirmation = function () {
            };
        });
    }
]);