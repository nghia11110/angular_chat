 // chat.controller.js
    (function() {
        'use strict';

        angular
            .module('app.chat')
            .controller('ChatController', ChatController)

        ChatController.$inject = ['$state', '$http', '$localStorage', 'socket'];
        function ChatController ($state, $http,  $localStorage, socket) {
            var vm = this;
            vm.messages  = [];
            vm.text = '';
            vm.sendMsg  = sendMsg;

            joinChat();
            onNewUser();
            // tham gia phòng chát
            function joinChat() {
                if ($localStorage.currentUser) {
                    socket.emit('user_join', $localStorage.currentUser.username);
                } else {
                    return false;
                }
            }
            // có người tham gia phòng chát
            function onNewUser() {
                socket.on('new_user_join', function (data) {
                    console.log('new_user');
                    console.log(data);
                });
            }
            // gửi tin nhắn
            function sendMsg() {
                socket.emit('send_message', vm.text);
                vm.messages.push({username: $localStorage.currentUser.username, text: vm.text});
                vm.text = '';
            };
            // nhận tin nhắn
            socket.on('receive_message', function(data) {
                console.log(data);
                vm.messages.push(data);
            })
        }

    })();