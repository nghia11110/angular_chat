 // server.js
    // load các module
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var port = process.env.PORT || 9000;
    // khởi tạo server listen cổng 9000
    server.listen(port, function () {
      console.log('Server listening at port '  + port);
    });

    var numUsers = 0;
    // khởi tạo kết nối socket
    io.on('connection', function(socket) {
        console.log('a socket connected');
        var addedUser = false;
        // socket nhận tin nhắn từ 1 client
        socket.on('send_message', function(text) {
            console.log(socket.username);
            // gửi tin nhắn tới các client đang kết nối socket
            // ngoại trừ client đang kết nối (gửi tin nhắn)
            socket.broadcast.emit('receive_message', {
                username: socket.username,
                text: text
            });
        });
        // socket client  join vào room chát
        socket.on('user_join', function(username) {
            if (addedUser)
                return false;
            socket.username = username;
            console.log('user_join: '+ socket.username);

            ++ numUsers;
            addedUser = true;
            // báo cho client đang join phòng thành công
            socket.emit('login', {
                numberUsers: numUsers
            });
            // báo cho client khác biết có người mới join vào phòng
            socket.broadcast.emit('new_user_join', {
                username: socket.username,
                numUsers: numUsers
            });
        });

        socket.on('typing', function(data) {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        socket.on('disconnect', function() {
                if (addedUser)
                    -- numUsers;
                socket.broadcast.emit('user_left', {
                    username: socket.username,
                    numUsers: numUsers
                });
        })
    });