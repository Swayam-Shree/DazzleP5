let port = process.env.PORT || 127;
let host = "0.0.0.0"; 
let express = require("express");
let socketio = require("socket.io");
let fs = require("fs");

let app = express();
let server = app.listen(port, host);
let io = socketio(server);
console.log("server started");
 
app.use(express.static('public', {
	setHeaders : function(res, path){
		res.set({
			"Content-Security-Policy" : "frame-ancestors 'self' https://www.youtube.com/",
			"X-Frame-Options" : "ALLOW-FROM https://www.youtube.com/"
		});
	}
}));

let joinFromLinkMap = new Map();

app.get("/joinroom/:roomName", (req, res) => {
	let roomName = req.params.roomName;
	let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	joinFromLinkMap.set(ip, roomName);
	if (process.env.port){
		res.redirect("https://workingbuild.herokuapp.com");
	}
	else{
		res.redirect("http://127.0.0.1:127");
	}
});

if (!fs.existsSync("history")){
    fs.mkdirSync("history");
}

let roomNameMap = {}; // maps room's name to room object
let roomList = {} // map room's name to players in it
let bannedIps = [];
let fingerprintTimeMap = {};

function checkForLinkJoin(socket){
	let ip = getIp(socket);
	if (bannedIps.includes(ip)) {
		io.to(socket.id).emit("banned"); 
		socket.disconnect();
		return;
	}

	let roomName = joinFromLinkMap.get(ip); 
	if (!roomName) return;
	
	if (roomName in roomNameMap){
		socket.room = roomNameMap[roomName];
		if (socket.room.bannedIps.includes(ip)){
			io.to(socket.id).emit("banned");;
			socket.disconnect();
			return;
		}

		let userName = "unnamed " + randInt(0, 100);

		socket.broadcast.emit("preLoginPlayerJoined", roomName);

		socket.emit("loginFromLink", socket.id, userName, roomName, socket.room.socketIds, socket.room.users,
					socket.room.ytLink, socket.room.djid);

		socket.room.addClient(socket, userName);
		fs.readFile(`history/${socket.room.name}chathistory.txt`, {encoding : "utf8"}, (err, data) => {
			socket.emit("chatHistory", data);
		});
	}
	else {
		io.to(socket.id).emit("roomExistsNot");
	}
	joinFromLinkMap.delete(ip);
}

io.on("connection", (socket) => {
  	console.log(socket.id);

	checkForLinkJoin(socket);

	let c = 0; for (let key in roomList) c += roomList[key];
	io.to(socket.id).emit("preLoginInit", c, roomList);

  	socket.on("login", (userName, roomName, callback) => {
		let ip = getIp(socket);
		if (bannedIps.includes(ip)) {
			io.to(socket.id).emit("banned"); 
			socket.disconnect();
			return;
		}

		socket.broadcast.emit("preLoginPlayerJoined", roomName);

		if (userName.length > 16)userName = userName.substring(0, 16);
		if (roomName.length > 16)roomName = roomName.substring(0, 16);
		roomName.replace(" ", "_");
  		
  		if (roomName in roomNameMap){
			
			socket.room = roomNameMap[roomName];
			if (socket.room.bannedIps.includes(ip)){
				io.to(socket.id).emit("banned");;
				socket.disconnect();
				return;
			}
  		}
  		else {
			socket.room = new Room(roomName);
  		}	
  		callback(socket.id, socket.room.socketIds, socket.room.users, socket.room.ytLink, socket.room.djid);
		socket.userName = userName;
  		socket.room.addClient(socket, userName);
		fs.readFile(`history/${socket.room.name}chathistory.txt`, {encoding : "utf8"}, (err, data) => {
			socket.emit("chatHistory", data);
		});
  	});

  	socket.on("initPlayerProperties", (tosend, id, col, x, y, z, orientation, kills, deaths, health) => {
		if (checkSocket(socket)) return;
  		io.to(tosend).emit("initEnemyProperties", id, col, x, y, z, orientation, kills, deaths, health);
  	});

  	socket.on("playerColorChange", col => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("enemyColorUpdate", socket.id, col);
  	});
  	socket.on("playerPositionChange", (x, y, z) => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("enemyPositionUpdate", socket.id, x, y, z);
  	});
  	socket.on("playerOrientationChange", orientation => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("enemyOrientationUpdate", socket.id, orientation);
  	});
	socket.on("playerHealthChange", (shooterId, health) => {
		if (checkSocket(socket)) return;
		if (socket.id !== shooterId) socket.to(socket.room.name).emit("enemyHealthUpdate", socket.id, health);
	});

	socket.on("enemyShot", (id, dmg) => {
		if (checkSocket(socket)) return;
		io.to(id).emit("playerShot", socket.id, dmg);
	});
	socket.on("playerKilled", (killerId) => {
		if (checkSocket(socket)) return;
		io.to(socket.room.name).emit("userKilled", killerId, socket.id);
	});

	socket.on("playerChat", chat => {
		if (checkSocket(socket)) return;
		chat = chat.substring(0, 100);
		socket.to(socket.room.name).emit("enemyChat", socket.id, chat);
		fs.write(socket.room.chatHistoryFd, chat + "\n", (err, bytes) => {});
	});

	socket.on("playerAfkStatus", (status) => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("enemyAfkStatus", socket.id, status);
	});

	socket.on("playerPaint", (index, x, y, px, py, size, col) => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("enemyPaint", socket.id, index, x, y, px, py, size);
		let command = `p ${index} ${x} ${y} ${px} ${py} ${size} ${col}` + "\n";
		if (socket.room.prevPaintCommand !== command){
			fs.write(socket.room.paintHistoryFd, command, (err, bytes) => {});
			socket.room.prevPaintCommand = command;
		}
	});
	socket.on("playerTextSpray", (index, x, y, text, fillCol, strokeCol, orientation) => {
		if (checkSocket(socket)) return;
		text = text.substring(0, 100);
		socket.to(socket.room.name).emit("enemyTextSpray", socket.id, index, x, y, text, strokeCol, orientation);
		let command = `t ${index} ${x} ${y} ${text} ${fillCol} ${strokeCol} ${orientation}` + "\n";
		if (socket.room.prevTextSprayCommand !== command){
			fs.write(socket.room.paintHistoryFd, command, (err, bytes) => {});
			socket.room.prevTextSprayCommand = command;
		}
	});
	socket.on("playerImageSpray", (index, x, y, orientation) => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("enemyImageSpray", index, x, y, orientation);
	});

	socket.on("sendVideo", (link) => { 	
		if (checkSocket(socket)) return;
		socket.room.ytLink = link;
		socket.room.djid = socket.id;
		socket.to(socket.room.name).emit("receiveVideo", socket.id, link);
	});
	socket.on("djtime", (time) => {
		if (checkSocket(socket)) return;
		socket.to(socket.room.name).emit("djtime", time);
	});

	socket.on("disconnecting", () => {
		if (checkSocket(socket)) return;
		io.to(socket.id).emit("disconnected");
	});

  	socket.on("disconnect", (err) => {
		console.log(err);
		if (checkSocket(socket)) return;
		socket.broadcast.emit("preLoginPlayerLeft", socket.room.name);
		socket.to(socket.room.name).emit("playerLeft", socket.id);
		socket.room.removeClient(socket.id);
  	});

	socket.on("ipBan", (password, id) => {
		if (checkSocket(socket)) return;
		if (password !== "bigtitsareshit") return;
		let s = io.sockets.sockets.get(id);
		bannedIps.push(getIp(s));
		io.to(id).emit("banned");
		s.disconnect();
	});
	socket.on("roomBan", (password, id, roomName) => {
		if (checkSocket(socket)) return;
		if (password !== "bigtitsareshit") return;
		let s = io.sockets.sockets.get(id);
		roomNameMap[roomName].bannedIps.push(getIp(s));
		io.to(id).emit("banned");
		s.disconnect();
	});
});

function checkSocket(socket){
	if (!socket.room) io.to(socket.id).emit("disconnected");
	return !socket.room;
}
function getIp(socket){
	return socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress
}
function randInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

class Room{
	constructor(name){
		roomNameMap[name] = this;
		roomList[name] = 0;
		this.bannedIps = [];
		this.name = name;
		this.sockets = [];
		this.socketIds = [];
		this.users = [];
		this.ytLink = "3G4cwFIh_Ns";
		this.djid = "";

		fs.open(`history/${name}chathistory.txt`, "a+", (err, fd) => {
			this.chatHistoryFd = fd;
		});
		this.paintHistoryFd = fs.openSync(`history/${name}painthistory.txt`, "a+");
	}
}
Room.prototype.addClient = function(socket, userName){
	++roomList[this.name];
	socket.join(this.name);
	socket.to(this.name).emit("playerJoined", socket.id, userName);
	this.sockets.push(socket);
	this.socketIds.push(socket.id);
	this.users.push(userName);
	fs.createReadStream(`history/${this.name}painthistory.txt`, {encoding : "utf8", highWaterMark : 64 * 1024}).on("data", (data) => {
		io.to(socket.id).emit("paintHistory", data);
	});
}
Room.prototype.removeClient = function(id){
	--roomList[this.name];
	let len = this.socketIds.length;
	if (len === 1){
		delete roomNameMap[this.name];
		delete roomList[this.name];
		fs.close(this.chatHistoryFd, (err) => {});
		fs.close(this.paintHistoryFd, (err) => {});
		return;
	}
	for (let i = 0; i < len; ++i){
		if (this.socketIds[i] == id){
			this.socketIds.splice(i, 1);
			this.sockets.splice(i, 1);
			this.users.splice(i, 1);
			break;
		}
	}
}

function random(min,max) { return Math.random() * (max - min) + min; }