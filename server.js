var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];
app.use('/js1', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/dist')); // redirect CSS bootstrap

server.listen(process.env.PORT || 8000);

console.log('Server Running');
app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');

});

io.sockets.on('connection', function (socket) {

    connections.push(socket);
    console.log("Connected" + connections.length);

    socket.on('disconnect', function (data) {
     
        users.splice(users.indexOf(socket.username),1);
        updateusernames();
        connections.splice(connections.indexOf(socket))
        console.log("Disconnected " + connections.length);
    });

    socket.on('sendmessage', function (data) {
        console.log(data);
        io.sockets.emit('new message', { msg: data ,user: socket.username})
    });


    //new user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username=data;
        users.push(socket.username);
        updateusernames();
    })

    function updateusernames(){

        io.sockets.emit('get users',users); 
    }
});