(function() {
    'use strict';
    angular.module('app.signin').config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/landing");
        $stateProvider.state('signin', {
            url: "/signin",
            templateUrl: "app/signin/signin.html",
            controller: "SigninController",
            controllerAs: "vm"
        })
    }
})();