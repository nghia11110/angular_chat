 (function() {
            'use strict';
            angular.module('app.core').factory('AuthService', AuthService);
            AuthService.$inject = ['$http', '$localStorage'];

            function AuthService($http, $localStorage) {
                var baseUrl = 'http://localhost:9000'; // for test
                var authService = {
                    currentUser: {
                        token: null,
                        username: null
                    },
                    login: login,
                    logout: logout,
                    signin: signin,
                    updateCurrentUser: function(token, username) {
                         this.currentUser.token = token;
                         this.currentUser.username = username;
                    },
                    isAuthenticated: function() {
                        return this.currentUser.token !== null ? true : false;
                    }
                }
                return authService;

                function login(email, password) {
                    return $http.post(baseUrl + '/authenticate', {
                        email: email,
                        password: password
                    }).then(function(data, status, headers, config) {
                        var res = data.data;
                        if (res.status) {
                            $http.defaults.headers.common.Authorization = 'Bearer ' + res.token;
                            $localStorage.currentUser = {
                                username: res.data.name,
                                token: res.token
                            };
                            authService.currentUser.token = res.token;
                            authService.currentUser.username = res.data.name;
                        }
                        return res;
                    });
                }

                function logout() {
                    $http.defaults.headers.common.Authorization = null;
                    $localStorage.currentUser = null;
                    authService.currentUser.token = null;
                    authService.currentUser.username = null;
                    return;
                }

                function signin(email,name,password) {
                    return $http.post(baseUrl + '/signin',{
                        email : email,
                        name : name,
                        password : password
                    }).then(function(data,status,headers,config){
                        var res = data.data;
                        if (res.status) {
                            $http.defaults.headers.common.Authorization = 'Bearer ' + res.token;
                            $localStorage.currentUser = {
                                username: res.data.name,
                                token: res.token
                            };
                            authService.currentUser.token = res.token;
                            authService.currentUser.username = res.data.name;
                        }
                        return;
                    });
                }
            }
        })()