let room;
let disconnected = false; 
let tPaintData;

function networkSetup(){
	socket = io();

	socket.on("disconnected", () => {
		disconnected = true;
	});
	socket.on("banned",() =>{
		makeDisconnect("get banned lmao");
		login_pointer.remove();	
	});

	socket.on("preLoginInit", (online, roomList) => {
		login_pointer.online_counter = online;
		login_pointer.roomList = roomList;
	});
	socket.on("preLoginPlayerJoined", (roomName) => {
		if(loggedIn) return;
		++login_pointer.online_counter;
		if (roomName in login_pointer.roomList) ++login_pointer.roomList[roomName];
		else login_pointer.roomList[roomName] = 1;
	});
	socket.on("preLoginPlayerLeft", (roomName) => {
		if(loggedIn) return;
		--login_pointer.online_counter;
		--login_pointer.roomList[roomName];
		if (login_pointer.roomList[roomName] < 1) delete login_pointer.roomList[roomName];
	});
}

function login(userName, roomName){
	if (roomName == "") roomName = "Global Room";
	if (userName == "") userName = "unnamed " + int(random(100))/10;
	if (userName.length > 16)userName = userName.substring(0, 16);
	if (roomName.length > 16)roomName = roomName.substring(0, 16);
	room = roomName;
	socket.emit("login", userName, roomName, (id, idList, userNameList, ytLink, djid_) => {
		loggedIn = true;

		player = new Player(id, userName);
		makeHud();
		youtube_player_playlink(ytLink);
		djid = djid_;

		mapSetup();
		enemySetup();
		keybindSetup();
	    
		login_pointer.remove();

		let len = idList.length;
		for (let i = 0; i < len; ++i){
			let enemy = new Enemy(idList[i], userNameList[i])
			enemies.push(enemy); 
			enemySocketMap[idList[i]] = enemy;
		}
	});

	socket.on("playerJoined", (id, name) => {
		chatbox.add_notification(`${name} joined`);
		let enemy = new Enemy(id, name)
		enemies.push(enemy);
		enemySocketMap[id] = enemy;
		socket.emit("initPlayerProperties", id, player.id, player.col.toString(), player.pos.x, player.pos.y, player.pos.z,
					player.orientation, player.kills, player.deaths);
	});
	socket.on("playerLeft", (id) => {
		chatbox.add_notification(`${enemySocketMap[id].name} left`);
		let len = enemies.length;
		for (let i = 0; i < len; ++i){
			if (enemies[i].id == id){
				enemies.splice(i, 1);
				break;
			}
		}
		delete enemySocketMap[id];
	});

	socket.on("enemyColorUpdate", (id, col) => {
		enemySocketMap[id].col = color(col);
	});
	socket.on("enemyPositionUpdate", (id, x, y, z) => {
		enemySocketMap[id].pos.set(x, y, z);
	});
	socket.on("enemyOrientationUpdate", (id, orientation) => {
		enemySocketMap[id].orientation = orientation;
	});

	socket.on("initEnemyProperties", (id, col, x, y, z, orientation, kills, deaths) => {
		let enemy = enemySocketMap[id];
		enemy.col = color(col);
		enemy.pos.set(x, y, z);
		enemy.orientation = orientation;
		enemy.kills = kills;
		enemy.deaths = deaths; 
	});

	socket.on("playerShot", (shooterId, dmg) => {
		player.lastShotBy = shooterId;
		player.health -= dmg;
		shatter(player.pos, 4, 2.5, -0.02, 2, player.col);
	});
	socket.on("userKilled", (killerId, deceasedId) => {
		if (player.id === killerId){
			++player.kills;
			let enemy = enemySocketMap[deceasedId];
			++enemy.deaths;
			new_killfeed(player.name, enemy.name, enemy.col, player.col);
		}	
		else{
			let p1 = enemySocketMap[killerId], p2 = enemySocketMap[deceasedId];
			++p1.kills;
			++p2.deaths;
			new_killfeed(p1.name, p2.name, p2.col, p1.col);
		}
	});

	socket.on("chatHistory", (data) => {
		let chats = data.split("\n");
		let len = chats.length;
		for (let i = 0; i < len; ++i){
			chatbox.addChat(chats[i]);
		}
	});
	socket.on("enemyChat", (id, chat) => {
		enemySocketMap[id].putTextOnHover(chat.substring(chat.indexOf(" >: ") + 4));
		chatbox.addChat(chat);
		if(!chatbox.on) ++chatbox.unread_counter ;
	});

	socket.on("paintHistory", (data) => {
		let points = data.split("\n");
		let len = points.length;
		if (tPaintData){
			points[0] = tPaintData + points[0];
		}
		tPaintData = points[len - 1];

		for (let i = 0; i < len - 1; ++i){
			let vals = points[i].split(" ");
			switch (vals[0]){
				case "p":
					mMap[vals[1]].paint(vals[2] * planeGraphicResolutionScale, vals[3] * planeGraphicResolutionScale,
						vals[4] * planeGraphicResolutionScale, vals[5] * planeGraphicResolutionScale, vals[6], color(vals[7]));
					break;

				case "t":
					mMap[vals[1]].text(vals[2] * planeGraphicResolutionScale, vals[3] * planeGraphicResolutionScale, vals[4],
						color(vals[5]), color(vals[6]), vals[7]);
			}
		}
	});
	socket.on("enemyPaint", (id, index, x, y, px, py, size) => {
		x  *= planeGraphicResolutionScale;
		y  *= planeGraphicResolutionScale; 
		px *= planeGraphicResolutionScale;
		py *= planeGraphicResolutionScale;
		mMap[index].paint(x, y, px, py, size, enemySocketMap[id].col);
	});
	socket.on("enemyTextSpray", (id, index, x, y, text, strokeCol, orientation) => {
		x *= planeGraphicResolutionScale;
		y *= planeGraphicResolutionScale;
		mMap[index].text(x, y, text, enemySocketMap[id].col, color(strokeCol), orientation);
	});

	socket.on("receiveVideo", (id, link) => {
		djid = id;
		youtube_player.who_played = enemySocketMap[id].name; 
		youtube_player_playlink(link);
	});
	socket.on("djtime", (time) => {
		if( Math.abs(youtube_player_api.getCurrentTime() - time) > 5 ) youtube_player_api.seekTo(time);
	});
}

function ban(password, id){
	socket.emit("ipBan", password, id);
	chatbox.add_notification(`${enemySocketMap[id].name} was BANNED`);
}
function roomban(password, id, roomName = room){
	socket.emit("roomBan", password, id, roomName);
	chatbox.add_notification(`${enemySocketMap[id].name} was BANNED`);
}

function getEnemyId(name){
	let len = enemies.length;
	for (let i = 0; i < len; ++i){
		let enemy = enemies[i];
		if (enemy.name === name){
			return enemy.id;
		}
	}
}