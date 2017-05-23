 // chat.config.js
    (function () {
        'use strict';

        angular
            .module('app.chat')
            .config(config);

        function config($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/landing");

            $stateProvider
                .state('chat', {
                    url: "/chat",
                    templateUrl: "app/chat/chat.html",
                    controller: "ChatController",
                    controllerAs: "vm"
            })
        }
    })();