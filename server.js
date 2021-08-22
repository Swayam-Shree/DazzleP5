let port = process.env.PORT || 127;
let host = "0.0.0.0"; 
let express = require("express");
let socketio = require("socket.io");
let fs = require("fs");
  
let app = express();
let server = app.listen(port, host);
let io = socketio(server);
console.log("server started");
 
// app.use(express.static("public"));
app.use(express.static('public', {
	setHeaders : function(res, path){
		res.set({
			"Content-Security-Policy" : "frame-ancestors 'self' https://www.youtube.com/",
			"X-Frame-Options" : "ALLOW-FROM https://www.youtube.com/"
		});
	}
})); 

let roomSocketMap = {}; // maps socket id to room object
let roomNameMap = {}; // maps room's name to room object
let roomList = {} // map room's name to players in it

io.on("connection", (socket) => {
  	console.log(socket.id);

	io.to(socket.id).emit("preLoginInit", Object.keys(roomSocketMap).length, roomList);

  	socket.on("login", (userName, roomName, callback) => {
		socket.broadcast.emit("preLoginPlayerJoined", roomName);

		if (userName.length > 16)userName = userName.substring(0, 16);
		if (roomName.length > 16)roomName = roomName.substring(0, 16);
  		let room;
  		if (roomName in roomNameMap){
  			room = roomNameMap[roomName];
  		}
  		else {
  			room = new Room(roomName);
  		}	
  		callback(socket.id, room.socketIds, room.users);
  		room.addClient(socket, userName);
  	});

  	socket.on("initPlayerProperties", (tosend, id, col, x, y, z, orientation) => {
  		io.to(tosend).emit("initEnemyProperties", id, col, x, y, z, orientation);
  	});

  	socket.on("playerColorChange", (col) => {
		let room = roomOf(socket);
		if (room) socket.to(room.name).emit("enemyColorUpdate", socket.id, col);
  	});
  	socket.on("playerPositionChange", (x, y, z) => {
		let room = roomOf(socket);
		if (room) socket.to(room.name).emit("enemyPositionUpdate", socket.id, x, y, z);
  	});
  	socket.on("playerOrientationChange", (orientation) => {
		let room = roomOf(socket);
		if (room) socket.to(room.name).emit("enemyOrientationUpdate", socket.id, orientation);
  	});

	socket.on("enemyShot", (id, dmg) => {
		io.to(id).emit("playerShot", socket.id, dmg);
	});
	socket.on("playerKilled", (killerId) => {
		io.to(killerId).emit("enemyKilled", socket.id);
	});

	socket.on("playerChat", (chat) => {
		let room = roomOf(socket);
		if (room) socket.to(room.name).emit("enemyChat", socket.id, chat);
	});

	socket.on("playerPaint", (index, x, y, px, py, size) => {
		let room = roomOf(socket);
		if (room) socket.to(room.name).emit("enemyPaint", socket.id, index, x, y, px, py, size);
	});

	socket.on("disconnecting", () => {
		io.to(socket.id).emit("disconnected");
	});

  	socket.on("disconnect", () => {
		if (socket.id in roomSocketMap){
			let room = roomSocketMap[socket.id];
			socket.broadcast.emit("preLoginPlayerLeft", room.name);

			socket.to(room.name).emit("playerLeft", socket.id);
			room.removeClient(socket.id);
			delete roomSocketMap[socket.id];
		}
  	});
});

function roomOf(socket){
	if (socket.id in roomSocketMap) return roomSocketMap[socket.id];
	else socket.emit("disconnected");
}

class Room{
	constructor(name){
		roomNameMap[name] = this;
		roomList[name] = 0;
		this.name = name;
		this.sockets = [];
		this.socketIds = [];
		this.users = [];
	}

	addClient(socket, userName){
		++roomList[this.name];
		roomSocketMap[socket.id] = this;
		socket.join(this.name);
		socket.to(this.name).emit("playerJoined", socket.id, userName);
		this.sockets.push(socket);
		this.socketIds.push(socket.id);
		this.users.push(userName);
	}

	removeClient(id){
		--roomList[this.name];
		let len = this.socketIds.length;
		for (let i = 0; i < len; ++i){
			if (this.socketIds[i] == id){
				this.socketIds.splice(i, 1);
				this.sockets.splice(i, 1);
				this.users.splice(i, 1);
				break;
			}
		}
	}
}