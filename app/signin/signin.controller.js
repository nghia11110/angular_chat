(function() {
    'use strict';

    angular
        .module('app.signin')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['$state', '$http', 'AuthService'];
    function SigninController ($state, $http,  AuthService) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.name = '';
        vm.signin = signin;

        function signin() {
            AuthService
                    .signin(vm.email, vm.name, vm.password)
                    .then(
                        function(data, status, headers, config) {
                            if (AuthService.isAuthenticated)
                                return $state.go('landing');
                        },
                        function (error) {
                            alert(error);
                        }
                    );
        };
    }
})();