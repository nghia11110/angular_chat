 (function() {
            'use strict';
            angular.module('app.core').factory('AuthService', AuthService);
            AuthService.$inject = ['$http', '$localStorage'];

            function AuthService($http, $localStorage) {
                var authService = {
                    currentUser: {
                        token: null,
                        username: null
                    },
                    login: login,
                    logout: logout,
                    updateCurrentUser: function(token, username) {
                         this.currentUser.token = token;
                         this.currentUser.username = username;
                    },
                    isAuthenticated: function() {
                        return this.currentUser.token ? true : false;
                    }
                }
                return authService;

                function login(email, password) {
                    return $http.get('/data/login.json', { // for test
                        email: email,
                        password: password
                    }).then(function(data, status, headers, config) {
                        var res = data.data;
                        res.data = res.data[Math.floor(Math.random() * 2)]; // for test
                        if (res.status) {
                            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
                            $localStorage.currentUser = {
                                username: res.data.name,
                                token: res.data.token
                            };
                            authService.currentUser.token = res.data.token;
                            authService.currentUser.username = res.data.name;
                        }
                        return;
                    });
                }

                function logout() {
                    $http.defaults.headers.common.Authorization = null;
                    $localStorage.currentUser = null;
                    authService.currentUser.token = null;
                    authService.currentUser.username = null;
                    return;
                }
            }
        })()