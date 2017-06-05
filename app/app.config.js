// app.config.js
    (function () {
        'use strict';

        angular
            .module('app')
            .config(configure)
            .run(runBlock);

        configure.$inject =  ['$locationProvider'];
        function configure($locationProvider) {
            $locationProvider.html5Mode(true);
        }

        runBlock.$inject = ['$http', '$rootScope', '$localStorage', '$state', 'AuthService'];
        function runBlock( $http, $rootScope, $localStorage, $state, AuthService) {
                if ($localStorage.currentUser) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
                    AuthService.updateCurrentUser($localStorage.currentUser.token, $localStorage.currentUser.username);
                }

                $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams, options){
                        if (toState.name == 'login' || toState.name == 'landing') {

                        } else {
                            if (!AuthService.isAuthenticated()) {
                                event.preventDefault();
                                $state.go('login');
                            }
                        }
                });
            }
    })();