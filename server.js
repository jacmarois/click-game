//Jacinto Marois
//Project 2
//Server application

//Set up dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();	//Create an express application
var server = http.Server(app);	//Add the express app to a new server
var io = socketIO(server);	//Set up an object for socket input/output

app.set('port',8550);	//Open the server on port 8550
app.use('/static',express.static(__dirname + '/static'));	//Makes this directory accessible to the client, but they aren't allowed to make changes to it

//This sets the default server request to redirect to index.html, help keep the server data from being accessible to the client
app.get('/',function(request,response){
	response.sendFile(path.join(__dirname, '/index.html'));	//Send the index page
});

//Start the server, and have it listen to port 8550
server.listen(8550,function(){
	console.log(`Server has started on port ${server.address().port}!`);	//Show a message to let the server owner know it has been started
});

var players = {};	//Create an associative array to store player data
var playerCount = 0;	//Create a var to count the number of players
var goal = {}	//Create a goal for the players to click

io.on('connection', function(socket) {
	socket.on('new player', function(){
		playerCount++;
		players[socket.id] = {
			x: Math.random() * 798 + 1,
			y: Math.random() * 598 + 1,
			r: Math.random() * 128 + 128,
			g: Math.random() * 128 + 128,
			b: Math.random() * 128 + 128,
			points: 0,
			num: playerCount
		}
		if(playerCount == 2){
			goal = {
				x: Math.random() * 780 + 10,
				y: Math.random() * 580 + 10
			}
		}
		console.log(`Player ${players[socket.id].num} connected`);
		socket.emit('points',players[socket.id]);
	});
	socket.on('mousemove', function(data) {
		var player = players[socket.id] || {};
		player.x = data.x;
		player.y = data.y;

		if(player.x >= goal.x && player.x <= goal.x+20 && player.y >= goal.y && player.y <= goal.y+20){	//This player scored!
			player.points += 10;
			goal = {
				x: Math.random() * 780 + 10,
				y: Math.random() * 580 + 10
			}
			socket.emit('points',players[socket.id]);
			console.log(`Player ${player.num} scored!`);
		}
	});
	socket.on('disconnect', function() {
		if(players[socket.id]){
			console.log(`Player ${players[socket.id].num} has disconnected`);
			delete players[socket.id];
		}
	});
});

leaderboard = {
	t:0,
	tp: 0,
	m:0,
	mp: 0,
	b:0,
	bp: 0
}

//This block sends the state data to every client 60 times per second
setInterval(function() {
	for(var id in players){
		player = players[id];
		if(player.points > leaderboard.t) {
			var tempm = leaderboard.t;
			var tempmp = leaderboard.tp;
			if(tempmp = player.num) tempmp,tempm = 0;
			var tempb = leaderboard.m;
			var tempbp = leaderboard.mp;
			if(tempbp = player.num) tempbp,tempb = 0;
			leaderboard.t = player.points;
			leaderboard.tp = player.num;
			leaderboard.m = tempm;
			leaderboard.mp = tempmp;
			leaderboard.b = tempb;
			leaderboard.bp = tempbp;
		}
		else if(player.points > leaderboard.m && leaderboard.tp != player.num) {
			var tempb = leaderboard.m;
			var tempbp = leaderboard.mp;
			if(tempbp = player.num) tempbp,tempb = 0;
			leaderboard.m = player.points;
			leaderboard.mp = player.num;
			leaderboard.b = tempb;
			leaderboard.bp = tempbp;
		}
		else if(player.points > leaderboard.b && leaderboard.tp != player.num && leaderboard.mp != player.num) {
			leaderboard.b = player.points;
			leaderboard.bp = player.num
		}
	}
	io.sockets.emit('state', players,goal,leaderboard);
}, 1000/30);
