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
        { id: 0, desc: 'Rating' },
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
        
        var d = $q.defer();
        //Get Customer Data 
        var url = settings.webApiUrl + '/api/customer';
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

    function loadMockCustomerInfo() {

        var d = $q.defer();
        setTimeout(function() {
            model.user = mock.getCustomer();
            d.resolve();
        }, 100);

        return d.promise;
    }
    
    function loadCustomerOrderHistory() {
        var d = $q.defer();
        var url = settings.webApiUrl + '/api/orderHistory';
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

    function loadMockCustomerOrderHistory() {

        var d = $q.defer();
        setTimeout(function() {
            model.user = mock.getCustomerOrderHistory();
            d.resolve();
        }, 200);

        return d.promise;
    }

    function loadCustomer() {
        var p1 = loadCustomerInfo();
        var p2 = loadCustomerOrderHistory();

        return $q.all([p1, p2]);
    }
    
    function loadMockCustomer() {
        // use mock data for now :)
        var p1 = loadMockCustomerInfo();
        var p2 = loadMockCustomerOrderHistory();

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
    
    function loadMockProductList() {

        var d = $q.defer();
        setTimeout(function() {
            model.products = mock.getProducts();
            d.resolve();
        }, 150);

        return d.promise;
    }
    
    // get shopping cart (order items) from session storage
    function getShoppingCart() {
        return amplify.store.sessionStorage("shoppingCart") || [];
    }
    
    // set shopping cart (order items) from session storage
    function storeShoppingCart(shoppingCart) {
        return amplify.store.sessionStorage("shoppingCart", shoppingCart);
    }


    /**
      * construct client side model
      */
    var model = {
        sortBy: sortBy,
        orderItems: [],
        messages: [],
        getShoppingCart: getShoppingCart,
        storeShoppingCart: storeShoppingCart
    };

    // use mock data for now :)
    // var q1 = loadProductList();
    var q1 = loadMockProductList();
    
    var q2 = $q.when(model);    
    var q3 = loadMockCustomer();

    return $q.all([q1, q2, q3]);
}]);

storeApp.controller("productListController", ['$scope', '$http', 'storeOrderModel',
    function ($scope, $http, storeOrderModel) {
        
        storeOrderModel.then(function (data) {
            $scope.model = data[1];
            var vm = $scope.model;
            $scope.productFirstRow = vm.products.slice(0, 4);
            $scope.productSecondRow = vm.products.slice(4, 8);
            vm.orderItems = vm.getShoppingCart();
            $scope.addToCart = function (product) {
                var orderItem = {
                    id: product.id,
                    title: product.title,
                    price: product.price
                };
                vm.orderItems.push(orderItem);
                vm.storeShoppingCart(vm.orderItems);
            };
            
        });
    }
]);

storeApp.controller("shoppingCartController", ['$scope', '$http', 'storeOrderModel', 'settings',
    function ($scope, $http, storeOrderModel, settings) {
        storeOrderModel.then(function (results) {

            $scope.model = results[1];
            var vm = $scope.model;

            vm.orderItems = vm.getShoppingCart();

            $scope.totalPrice = function () {
                var total = 0;
                vm.orderItems.forEach(function (item) {
                    total += item.price;
                });

                return total;
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