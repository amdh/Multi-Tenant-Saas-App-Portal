/**
 * Created by jnirg on 4/2/2017.
 */
// create the module and name it scotchApp
var StarbucksApp = angular.module('StarbucksApp', ['ngRoute', 'ngTable']);

// configure our routes
StarbucksApp.config(function($routeProvider) {

    var link = 'http://54.183.83.252:8000/Starbucks2';

    console.log("route provider");

    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl : 'templates/index.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'templates/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/home', {
            templateUrl : 'templates/index.html',
            controller  : 'mainController'
        })


        .when('/placeorder', {
            templateUrl : 'templates/placeorder.html',
            controller  : 'placeorderController'
        })

        .when('/checkstatus', {
            templateUrl : 'templates/checkstatus.html',
            controller  : 'checkstatusController'
        })

        .when('/updateorder', {
            templateUrl : 'templates/updateorder.html',
            controller  : 'updateorderController'
        })

        .when('/cancelorder', {
            templateUrl : 'templates/cancelorder.html',
            controller  : 'cancelorderController'
        })

        .when('/payorder', {
            templateUrl : 'templates/payorder.html',
            controller  : 'payorderController'
        })

        .otherwise({redirectTo: '/'});
});

// create the controller and inject Angular's $scope
StarbucksApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

StarbucksApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

//--------------------------------- place order controller-------------------------------------------
StarbucksApp.controller("placeorderController", function ($scope, $http, $route, $rootScope,
                                                                  $interval) {
    $scope.msg = 'Placing an order';
    console.log("Heyo!!!!");

    $scope.placeOrder = function () {

        console.log("in the place order function");

        console.log("placeorder called");

        console.log("inside placeordeCtrl");
        var order = {
            "location": "store-1",
            "items": [{
                "qty": $scope.qty,
                "name": $scope.drink,
                "milk": $scope.milk,
                "size": $scope.size
            }]
        }



        console.log(order);

        $http({
            method: 'POST',
            url: link + '/store1/starbucks/order',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: order

        }).success(function (data) {
            $scope.msg = "Order placed";
            //message should be displayed that your order has been placed
            //manage this flag in UI
            $scope.msg_flag = false;
            $route.reload();
        }).error(function(error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
        });

    }
});



//--------------------------------- check status controller-------------------------------------------
StarbucksApp.controller("checkstatusController", function ($scope, $http, $route, $rootScope,
                                                          $interval) {

    console.log('check status controller');
    console.log($scope.orderId);


    $scope.checkStatus = function () {

        var urlLink = link + '/store1/starbucks/order/' +$scope.orderId;

        $http({
            method: 'GET',
            url: urlLink,
        }).success(function (data) {
            $scope.status = data.status;
            $scope.msg = data.message;
            $route.reload();
        }).error(function(error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            $route.reload();
        });



    }//end of checkstatus
                                                          });



//--------------------------------- update order controller-------------------------------------------
StarbucksApp.controller("updateorderController", function ($scope, $http, $route, $rootScope, $interval) {

    console.log('update order controller with isUpdateAllowed false');
    $scope.isUpdateDisabled = true;

    console.log($scope.orderid);


    $scope.getOrder = function () {

        var urlLink = link + '/store1/starbucks/order/' + $scope.orderid;

        $http({
            method: 'GET',
            url: urlLink,
        }).success(function (data) {
            $scope.orderstatus = data.status;
            $scope.drink = data.items.drink;
            $scope.size = data.items.size;
            $scope.milk = data.items.milk;
            $scope.qty = data.items.qty;
            $scope.location = data.location;
            $scope.msg = data.message;
            if($scope.orderstatus == "PLACED")
            {
                $scope.isUpdateDisabled = false;
            }
            $route.reload();
        }).error(function (error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            $route.reload();
        });
    }



    $scope.updateOrder = function(){
        var urlLink = link + '/store1/starbucks/order/' + $scope.orderid;
        var order = {
            "location": $scope.location,
            "items": [{
                "qty": $scope.qty,
                "name": $scope.drink,
                "milk": $scope.milk,
                "size": $scope.size
            }]
        }

        console.log(order);

        $http({
            method: 'PUT',
            url: urlLink,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: order

        }).success(function (data) {
            $scope.msg = "Order updated";
            //message should be displayed that your order has been placed
            //manage this flag in UI

            $route.reload();
        }).error(function(error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            $route.reload();
        });

    }

    });



//--------------------------------- cancel order controller-------------------------------------------
StarbucksApp.controller("cancelorderController", function ($scope, $http, $route, $rootScope,
                                                           $interval) {

    console.log('cancel order controller');
    console.log($scope.orderid);


    $scope.getOrder = function () {

        var urlLink = link + '/store1/starbucks/order/' + $scope.orderid;

        $http({
            method: 'GET',
            url: urlLink,
        }).success(function (data) {
            $scope.orderstatus = data.status;
            $scope.msg = data.message;

            $route.reload();
        }).error(function (error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            $route.reload();
        });
    }

});


//--------------------------------- pay order controller-------------------------------------------
StarbucksApp.controller("payorderController", function ($scope, $http, $route, $rootScope,
                                                           $interval) {

    console.log('pay order controller');

    $scope.getOrder = function () {

        var urlLink = link + '/store1/starbucks/order/' + $scope.orderid + '/pay';

        $http({
            method: 'POST',
            url: urlLink
        }).success(function (data) {
            $scope.orderstatus = data.status;
            $scope.msg = data.message;

            $route.reload();
        }).error(function (error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            $route.reload();
        });
    }

});