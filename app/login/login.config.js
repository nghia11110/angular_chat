(function() {
    'use strict';
    angular.module('app.login').config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/landing");
        $stateProvider.state('login', {
            url: "/login",
            templateUrl: "app/login/login.html",
            controller: "LoginController",
            controllerAs: "vm"
        })
    }
})();