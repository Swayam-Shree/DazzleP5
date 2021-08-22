let room;
let disconnected = false;

function networkSetup(){
	socket = io();

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
	socket.emit("login", userName, roomName, (id, idList, userNameList) => {
		loggedIn = true;

		player = new Player(id, userName);
		makeHud();

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
		socket.emit("initPlayerProperties", id, player.id, player.col.toString(), player.pos.x, player.pos.y, player.pos.z, player.orientation);
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

	socket.on("initEnemyProperties", (id, col, x, y, z, orientation) => {
		print(id, enemySocketMap)
		let enemy = enemySocketMap[id];
		enemy.col = color(col);
		enemy.pos.set(x, y, z);
		enemy.orientation = orientation;
	});

	socket.on("playerShot", (shooterId, dmg) => {
		player.lastShotBy = shooterId;
		player.health -= dmg;
		shatter(player.pos, 4, 2.5, -0.02, 2, player.col);
	});
	socket.on("enemyKilled", (deceasedId) => {	// no use for id yet, perhaps use for notif stuff.
		++player.kills;
	});

	socket.on("enemyChat", (id, chat) => {
		enemySocketMap[id].putTextOnHover(chat, 5);
		chatbox.addChat(chat);
	});

	socket.on("enemyPaint", (id, index, x, y, px, py, size) => {
		mMap[index].paint(x, y, px, py, size, enemySocketMap[id].col);
	});

	socket.on("disconnected", () => {disconnected = true;});
}