// socket.service.js
    (function () {
        'use strict';

        angular
            .module('app.chat')
            .factory('socket', socket);

        function socket(socketFactory) {
            var socketConnection = io.connect('http://localhost:9000'); // for test
            var socket = socketFactory({
                ioSocket: socketConnection
            });

            return socket;
        }
    })();