let room;
let disconnected = false; 
let tPaintData;

function networkSetup(){
	socket = io({
		"reconnection": true,
		"reconnectionDelay": 100,
		"reconnectionDelayMax" : 5000,
		"reconnectionAttempts": Number.MAX_VALUE
	});

	socket.on("disconnected", () => {
		console.log("disconnected");
		disconnected = true;
		makeDisconnect();
		hud_pointer.remove();
		remove();
	});
	socket.on("banned", () =>{
		makeDisconnect("get banned lmao");
		login_pointer.remove();	
	});
	socket.on("kicked", () =>{
		makeDisconnect("You have been kicked due to spamming or griefing. If continued you will be banned permanently.");
		login_pointer.remove();	
	});
	socket.on("roomExistsNot", () => {
		makeDisconnect("That room does not exist. Refresh to create a new room!");
		login_pointer.remove();
	});

	socket.on("preLoginInit", (online, roomList) => {
		login_pointer.online_counter = online;
		login_pointer.roomList = roomList;
	});
	socket.on("preLoginPlayerJoined", (roomName) => {
		if(loggedIn) return;
		++login_pointer.online_counter;
		if (roomName in login_pointer.roomList) ++login_pointer.roomList[roomName].userCount;
		else login_pointer.roomList[roomName] = {userCount : 1, historySize : 0};
	});
	socket.on("preLoginPlayerLeft", (roomName) => {
		if(loggedIn) return;
		--login_pointer.online_counter;
		--login_pointer.roomList[roomName].userCount;
		if (login_pointer.roomList[roomName].userCount < 1) delete login_pointer.roomList[roomName];
	});

	socket.on("loginFromLink", (id, userName, roomName, idList, userNameList, ytLink, djid_) => {
		room = roomName.replace(" ", "_");
		loggedIn = true;

		player = new Player(id, userName);
		makeHud();

		mapSetup();
		enemySetup();
		keybindSetup();

		youtube_player_playlink(ytLink);
		djid = djid_;
		
		login_pointer.remove();

		let len = idList.length;
		for (let i = 0; i < len; ++i){
			let enemy = new Enemy(idList[i], userNameList[i])
			enemies.push(enemy); 
			enemySocketMap[idList[i]] = enemy;
		}

		youtube_player.who_played = enemySocketMap[djid].name;

		setSocketEvents();
	});
}

function login(userName, roomName){
	if (!loggedIn){
		if (roomName === ""){
			let t = 5;
			let idealRoom, idealRoomSize;
			for (let rName in login_pointer.roomList){
				let historySize = login_pointer.roomList[rName].historySize;
				if (login_pointer.roomList[rName].userCount < t){
					if (idealRoomSize){
						if (historySize < idealRoomSize){
							idealRoom = rName;
							idealRoomSize = historySize;
						}
					}
					else {
						idealRoom = rName;
						idealRoomSize = historySize;
					}
				}
			}
			if (idealRoom) roomName = idealRoom;
			if (roomName === ""){
				for (let i = 1; i < 70; ++i){
					let rName = "Global Room " + i;
					if (rName in login_pointer.roomList && login_pointer.roomList[rName].userCount > t - 1) continue;
					roomName = rName;
					break;
				}
			}
		}
		if (userName == "") userName = "unnamed " + int(random(100))/10;
		else window.localStorage.setItem("userName", userName);
		if (userName.length > 16)userName = userName.substring(0, 16);
		if (roomName.length > 16)roomName = roomName.substring(0, 16);
		room = roomName;

		socket.emit("login", userName, roomName, (id, idList, userNameList, ytLink, djid_) => {
			loggedIn = true;

			player = new Player(id, userName);
			makeHud();
				
			mapSetup();
			enemySetup();
			keybindSetup();

			youtube_player_playlink(ytLink);
			djid = djid_;
				
			login_pointer.remove();

			for (let i = 0; i < idList.length; ++i){
				let enemy = new Enemy(idList[i], userNameList[i])
				enemies.push(enemy); 
				enemySocketMap[idList[i]] = enemy;
			}

			if (enemySocketMap[djid]) youtube_player.who_played = enemySocketMap[djid].name;
		});
	}
	setSocketEvents();
}

function setSocketEvents(){
	socket.on("playerJoined", (id, name) => {
		chatbox.add_notification(`${name} joined`);
		let enemy = new Enemy(id, name)
		enemies.push(enemy);
		enemySocketMap[id] = enemy;
		socket.emit("initPlayerProperties", id, player.id, player.col.toString(), player.pos.x, player.pos.y, player.pos.z,
					player.orientation, player.kills, player.deaths, player.health);
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
	socket.on("enemyGravityUpdate", (id, x, y, z) => {
		enemySocketMap[id].gravity.set(x, y, z);
	});

	socket.on("initEnemyProperties", (id, col, x, y, z, orientation, kills, deaths, health) => {
		let enemy = enemySocketMap[id];
		enemy.col = color(col);
		enemy.pos.set(x, y, z);
		enemy.orientation = orientation;
		enemy.kills = kills;
		enemy.deaths = deaths;
		enemy.health = health;
	});

	socket.on("userShot", (shooterId, victimId, dmg) => {
		if (victimId === player.id){
			let shooter = enemySocketMap[shooterId];
			damage_indicators.push(new DamageIndicator(hud_pointer, shooter.pos.copy(), red(shooter.col), green(shooter.col), blue(shooter.col)));
			if(damage_indicators.length > damage_indicators_max ) damage_indicators.splice(0,1) ;  
			player.lastShotBy = shooterId;
			player.health -= dmg;
			shatter(player.pos, 4, 2.5, -0.02, 2, player.col);
		}
		else{
			enemySocketMap[victimId].health -= dmg;
		}
	});
	socket.on("userKilled", (killerId, deceasedId) => {
		if (player.id === killerId){
			player.health = player.maxHealth;
			++player.kills;
			let enemy = enemySocketMap[deceasedId];
			++enemy.deaths;
			new_killfeed(player.name, enemy.name, enemy.col, player.col);
			enemy.health = player.maxHealth;
			enemy.pos.y = 10000;
		}
		else if (deceasedId === player.id){
			++player.deaths;
			let enemy = enemySocketMap[killerId];
			++enemy.kills;
			new_killfeed(enemy.name, player.name, player.col, enemy.col);
			side_notifications[side_notifications.length - 1].important = true;
		}
		else{
			let p1 = enemySocketMap[killerId], p2 = enemySocketMap[deceasedId];
			++p1.kills;
			++p2.deaths;
			new_killfeed(p1.name, p2.name, p2.col, p1.col);
			p2.health = player.maxHealth;
			enemy.pos.y = 10000;
			p1.health = player.maxHealth;
		}
	});

	socket.on("chatHistory", (data) => {
		let chats = data.split("\n");
		let len = chats.length;
		for (let i = 0; i < len; ++i){
			chatbox.addChat(chats[i]);
		}
		chatbox.addChat("<- You joined here.");
	});
	socket.on("enemyChat", (id, chat) => {
		enemySocketMap[id].putTextOnHover(chat.substring(chat.indexOf(" >: ") + 4), 5);
		chatbox.addChat(chat);
		if(!chatbox.on) ++chatbox.unread_counter;
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
					currentMap.planes[vals[1]].paint(vals[2] * planeGraphicResolutionScale, vals[3] * planeGraphicResolutionScale,
						vals[4] * planeGraphicResolutionScale, vals[5] * planeGraphicResolutionScale, vals[6], color(vals[7]));
					break;

				case "t":
					currentMap.planes[vals[1]].text(vals[2] * planeGraphicResolutionScale, vals[3] * planeGraphicResolutionScale, vals[4],
						color(vals[5]), color(vals[6]), vals[7]);
			}
		}
	});
	socket.on("enemyPaint", (id, index, x, y, px, py, size) => {
		x  *= planeGraphicResolutionScale;
		y  *= planeGraphicResolutionScale; 
		px *= planeGraphicResolutionScale;
		py *= planeGraphicResolutionScale;
		currentMap.planes[index].paint(x, y, px, py, size, enemySocketMap[id].col);
	});
	socket.on("enemyTextSpray", (id, index, x, y, text, strokeCol, orientation) => {
		x *= planeGraphicResolutionScale;
		y *= planeGraphicResolutionScale;
		currentMap.planes[index].text(x, y, text, enemySocketMap[id].col, color(strokeCol), orientation);
	});
	socket.on("enemyImageSpray", (index, x, y, orientation) => {
		if (easter_egg_var_image){
			x *= planeGraphicResolutionScale;
			y *= planeGraphicResolutionScale;
			currentMap.planes[index].image(x, y, easter_egg_var_image, orientation);
		} else {
			x *= planeGraphicResolutionScale;
			y *= planeGraphicResolutionScale;
			currentMap.planes[index].image(x, y, defaultSprayImage, orientation);
		}
	});

	socket.on("receiveVideo", (id, link) => {
		djid = id;
		youtube_player.who_played = enemySocketMap[id].name; 
		youtube_player_playlink(link);
	});
	socket.on("djtime", time => {
		if( Math.abs(youtube_player_api.getCurrentTime() - time) > 5 ) youtube_player_api.seekTo(time);
	});

	socket.on("enemyAfkStatus", (id, status)  => {
		enemySocketMap[id].afk = status;
	});

	socket.on("enemyBanned", id => {
		chatbox.add_notification(`${enemySocketMap[id].name} was BANNED`);
	});
	socket.on("enemyKicked", id => {
		chatbox.add_notification(`${enemySocketMap[id].name} was KICKED`);
	});
}

function kick(password, id){
	socket.emit("kick", password, id);
	chatbox.add_notification(`${enemySocketMap[id].name} was KICKED`);
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
	for (let i = 0; i < enemies.length; ++i){
		if (enemies[i].name === name) return enemies[i].id;
	}
}