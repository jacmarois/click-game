//Jacinto Marois
//Project 2
//Game application

var socket = io();	//Set the socket
socket.emit('new player');

socket.on('points', function(player) {
	document.getElementById('pnum').innerHTML = 'Player ' + player.num;
	document.getElementById('points').innerHTML = 'Points:' + player.points;
});

var movement = {
	x: 0,
	y: 0
}

document.getElementById('game').addEventListener('mousemove', function(event) {
	movement.x = event.offsetX;
	movement.y = event.offsetY;
});

setInterval(function() {
	socket.emit('mousemove', movement);
}, 1000/30);

var game = document.getElementById('game');	//Set game to the game canvas in index.html for easy drawing
//Make sure the canvas is drawn properly
game.width = 800;
game.height = 600;
var context = game.getContext('2d');	//Set the context from the game canvas
context.textAlign = "center";	//Center all text

//When the client recieves a state event, we clear the canvas
socket.on('state', function(players,goal,leaderboard) {
	context.clearRect(0, 0, 800, 600);
	for(var id in players){
		var player = players[id];
		context.font = '20px Times';
		context.fillStyle = `rgba(${player.r},${player.g},${player.b},0.5)`;
		context.fillRect(player.x, player.y, 10, 10);
		context.fillText('Player ' + player.num, player.x + 5, player.y - 5);
	}

	context.fillStyle = `rgb(255,25,5)`;
	context.fillRect(goal.x, goal.y, 20, 20);

	var ul = document.getElementById('players');
	ul.innerHTML = `<li>${leaderboard.tp}: ${leaderboard.t}</li><li>${leaderboard.mp}: ${leaderboard.m}</li><li>${leaderboard.bp}: ${leaderboard.b}</li>`;
});