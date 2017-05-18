 (function() {
        'use strict';

        angular
        .module('app.header')
        .controller('HeaderController', HeaderController);

        HeaderController.$inject = ['AuthService', '$state'];
        function HeaderController (AuthService, $state) {

            var vm = this;
            vm.currentUser = AuthService.currentUser;

            vm.logout = logout;

            function logout() {
                AuthService.logout();
                $state.go('landing');
            }
        }
    })();