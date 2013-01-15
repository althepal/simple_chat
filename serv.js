var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server)
, routes = require('./routes');
var fs = require('fs');
var redis = require('redis');
var db = redis.createClient();

io.set('log level', 1);

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
//	io.set('transports', ['xhr-polling']);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
//	app.use(express.methodOverride());
	app.use(express.cookieParser('yaba daba doo'));
	app.use(express.session());
	app.use(app.router);
	app.use('/static', express.static(__dirname + '/static'));
});

app.configure('development', function(){
});
app.get('/', routes.index);
app.get('/a', routes.test);
app.post('/a', routes.testpost);

var msg_cnt = 0;
app.get('/send', function(req, res) {
	msg_cnt++;
	io.sockets.emit('news', { msg: "MESSAGE " + msg_cnt })
	res.send(".");
});

app.set('port', 8070);

server.listen(app.get('port'), function(){
	console.log("Server listening on port " + app.get('port'));
});


var users = {};
function sendUserList(socket){
	sendto = socket || io.sockets
	sendto.emit('users', { users: users });
}
function removeUser(username){
	io.sockets.emit('news', { msg: username + " disconnected", username: "Root", time: Date.now() });
	delete users[username];
	sendUserList();
}

io.sockets.on('connection', function (socket) {
	sendUserList(socket);
	db.lrange('history', 0, -1, function(err, replies){
		replies.forEach(function(reply, i) {
			var data = JSON.parse(reply);
			socket.emit('news', data);
		});
	});
	socket.on('im_here', function(data) {
		var username = data.username;
		if (users[username]){
			socket.emit('name-set', { code: "username is taken" });
		} else {
			socket.username = username;
			users[username] = { time: Date.now() };
			socket.emit('name-set', { code: "OK", username: username });
			socket.broadcast.emit('news', { msg: username + " connected", username: "Root", time: Date.now() });
			sendUserList();
		}
	});
	socket.on('disconnect', function(){
		if (socket.username) {
			removeUser(socket.username);
		}
	});
	socket.on('newMsg', function (data) {
		data.username = socket.username;
		io.sockets.emit('news', data);
		var tmp = JSON.stringify(data);
//		console.log(tmp);
		db.rpush('history', tmp, function(err, len){
			while (len > 30){
				db.lpop('history');
				len--;
			}
		});
	});
});
