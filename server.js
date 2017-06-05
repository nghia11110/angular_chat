 // server.js
    // load các module
    var express = require('express');
    var morgan     = require("morgan");
    var bodyParser = require("body-parser");
    var jwt        = require("jsonwebtoken");
    var mongoose   = require("mongoose");
    require('dotenv').config({silent: true});

    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var port = process.env.PORT;

    server.listen(port, function () {
      console.log('Server listening at port '  + port);
    });
    var User     = require('./server/models/user');
    // Connect to DB
    var mongo_url = process.env.MONGO_URL;
    mongoose.connect(mongo_url);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan("dev"));
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
        next();
    });
    process.on('uncaughtException', function(err) {
        console.log(err);
    });

    app.post('/authenticate', function(req, res) {
        User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
            if (err) {
                res.json({
                    status: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                   res.json({
                        status: true,
                        data: user,
                        token: user.token
                    });
                } else {
                    res.json({
                        status: false,
                        data: "Incorrect email/password"
                    });
                }
            }
        });
    });

    app.post('/signin', function(req, res) {
        User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
            if (err) {
                res.json({
                    status: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    res.json({
                        status: false,
                        data: "User already exists!"
                    });
                } else {
                    var userModel = new User();
                    userModel.email = req.body.email;
                    userModel.password = req.body.password;
                    userModel.name = req.body.name;
                    userModel.save(function(err, user) {
                        user.token = jwt.sign(user, process.env.JWT_SECRET);
                        user.save(function(err, user1) {
                            res.json({
                                status: true,
                                data: user1,
                                token: user1.token
                            });
                        });
                    })
                }
            }
        });
    });

    app.get('/me', ensureAuthorized, function(req, res) {
        User.findOne({token: req.token}, function(err, user) {
            if (err) {
                res.json({
                    status: false,
                    data: "Error occured: " + err
                });
            } else {
                res.json({
                    status: true,
                    data: user
                });
            }
        });
    });

    function ensureAuthorized(req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.send(403);
        }
    }

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

