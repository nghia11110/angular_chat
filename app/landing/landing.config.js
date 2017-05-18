 (function() {
        'use strict';

        angular
            .module('app.landing')
            .config(config);

        config.$inject = ['$stateProvider', '$urlRouterProvider'];
        function config($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('landing', {
                    url: "/landing",
                    templateUrl: "app/landing/landing.html",
                    controller: "LandingController",
                    controllerAs: "vm"
                })
        }
    })();