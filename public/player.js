class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.camera = createCamera();
		setCamera(this.camera);
		this.seekFov = this.fov = PI/3;
		this.camera.perspective(this.fov, width / height, 1, 10000);

		this.prevPos = createVector(0, 0, 0);
		this.pos = createVector(0, 0, 0);
		this.vel = createVector(0, 0, 0);
		this.acc = createVector(0, 0, 0);

		this.facing = createVector(0, 0, 0); // vector from origin to vision
		this.looking = createVector(0, 0, -1); // vector from self position to vision

		this.sensitivity = 0.002;
		this.dimensions = createVector(10, 19.9, 10);
		this.halfDimensions = createVector(this.dimensions.x / 2, this.dimensions.y / 2, this.dimensions.z / 2);

		this.maxHealth = 500;
		this.health = this.maxHealth;
		this.lastShotBy = undefined;

		this.kills = 0;
		this.deaths = 0;
		this.bulletDamage = 25;

		this.prevOrientation = 0;
		this.orientation = 0; // 0 towards -ve z axis

		this.jumpVec = createVector(0, -3, 0);
		this.jumpCount = 3;
		this.jumpsDone = 0;

		this.grounded = false;
		this.sprinting = false;

		this.walkSpeed = 3;
		this.sprintSpeed = 9;

		this.prevCol = color(0);
		this.col = color(0);

		this.pLookingPlane = null;
		this.pLookingPt = null;
		// this.ppLookingPt = createVector();

		this.respawn();
	}
}
Player.prototype.update = function () {
	if (pointerLocked) {
		this.camera.tilt(movedY * this.sensitivity);
		this.camera.pan(-movedX * this.sensitivity);
		this.orientation = front.angleBetween(createVector(this.looking.x, 0, this.looking.z));
		if (this.looking.x > 0) {
			this.orientation = 2 * PI - this.orientation;
		}
	}

	if (this.pos.y > 600) { this.vel.mult(0); this.respawn(); }

	this.applyForce(gravity);

	this.vel.add(this.acc);
	this.pos.add(this.vel);
	this.acc.mult(0);

	this.camera.setPosition(this.pos.x, this.pos.y, this.pos.z);

	this.facing.set(this.camera.centerX, this.camera.centerY, this.camera.centerZ);
	this.looking = makeVector(this.pos, this.facing).normalize();

	// dust_delta = this.pos.copy(); 
	// dust_delta.sub( this.prevPos ) ; 
	this.col = color_picker.picker.color();
	this.col.setAlpha(color_picker.alpha_slider.value);

	let col = this.col.toString();
	if (col !== this.prevCol.toString()) {
		socket.emit("playerColorChange", col);
		this.prevCol = color(col);
	}
	if (!this.prevPos.equals(this.pos)) {
		socket.emit("playerPositionChange", this.pos.x, this.pos.y, this.pos.z);
		this.prevPos.set(this.pos);
	}
	if (this.orientation !== this.prevOrientation) {
		socket.emit("playerOrientationChange", this.orientation);
		this.prevOrientation = this.orientation;
	}
}
Player.prototype.moveForward = function () {
	player.pos.add(createVector(player.looking.x, 0, player.looking.z).setMag(this.sprinting ? player.sprintSpeed : player.walkSpeed));
	this.camera.setPosition(this.pos.x, this.pos.y, this.pos.z);
}
Player.prototype.moveBackward = function () {
	player.pos.add(createVector(player.looking.x, 0, player.looking.z).setMag(this.sprinting ? -player.sprintSpeed : -player.walkSpeed));
	this.camera.setPosition(this.pos.x, this.pos.y, this.pos.z);
}
Player.prototype.moveLeft = function () {
	player.pos.add(player.looking.cross(up).setMag(this.sprinting ? player.sprintSpeed : player.walkSpeed));
	this.camera.setPosition(this.pos.x, this.pos.y, this.pos.z);
}
Player.prototype.moveRight = function () {
	player.pos.add(player.looking.cross(up).setMag(this.sprinting ? -player.sprintSpeed : -player.walkSpeed));
	this.camera.setPosition(this.pos.x, this.pos.y, this.pos.z);
}
Player.prototype.respawn = function () {
	socket.emit("playerKilled", this.lastShotBy);
	this.pos.set(random(-500, 500), -500, random(-500, 500));
	this.health = this.maxHealth;
	// if (hud_pointer) hud_pointer.windowResized(); 
	// windowResized() ; 
}
Player.prototype.jump = function () {
	if (this.jumpsDone < this.jumpCount) {
		this.grounded = false;
		this.applyForce(this.jumpVec);
		++this.jumpsDone;
	}
}
Player.prototype.applyForce = function (force) {
	this.acc.add(force);
}
Player.prototype.planeCulling = function (plane) {
	let rangeUp = 1;
	let rangeDown = cos(this.fov);
	if (plane.axis == 'x') {
		let dotUpLeft = this.looking.dot(makeVector(this.pos, plane.upLeft).normalize());
		let dotUpRight = this.looking.dot(makeVector(this.pos, plane.upRight).normalize());
		let dotDownLeft = this.looking.dot(makeVector(this.pos, plane.downLeft).normalize());
		let dotDownRight = this.looking.dot(makeVector(this.pos, plane.downRight).normalize());
		let dotCenter = this.looking.dot(makeVector(this.pos, plane.pos).normalize());
		return distSq(this.pos.x, this.pos.y, this.pos.z, plane.pos.x, plane.pos.y, plane.pos.z) < 10000 || (dotUpLeft > rangeDown && dotUpLeft < rangeUp) ||
			(dotUpRight > rangeDown && dotUpRight < rangeUp) || (dotDownLeft > rangeDown && dotDownLeft < rangeUp) ||
			(dotDownRight > rangeDown && dotDownRight < rangeUp) || (dotCenter > rangeDown && dotCenter < rangeUp);
	}
	else if (plane.axis == 'y') {
		return true;
	}
	else if (plane.axis == 'z') {
		let dotUpBack = this.looking.dot(makeVector(this.pos, plane.upBack).normalize());
		let dotUpFront = this.looking.dot(makeVector(this.pos, plane.upFront).normalize());
		let dotDownBack = this.looking.dot(makeVector(this.pos, plane.downBack).normalize());
		let dotDownFront = this.looking.dot(makeVector(this.pos, plane.downFront).normalize());
		let dotCenter = this.looking.dot(makeVector(this.pos, plane.pos).normalize());
		return distSq(this.pos.x, this.pos.y, this.pos.z, plane.pos.x, plane.pos.y, plane.pos.z) < 10000 || (dotUpBack > rangeDown && dotUpBack < rangeUp) ||
			(dotUpFront > rangeDown && dotUpFront < rangeUp) || (dotDownBack > rangeDown && dotDownBack < rangeUp) ||
			(dotDownFront > rangeDown && dotDownFront < rangeUp) || (dotCenter > rangeDown && dotCenter < rangeUp);
	}
}
Player.prototype.pointCulling = function (x, y, z) {
	let rangeDown = cos(this.fov);
	let decalPos;
	if (y) {
		decalPos = createVector(x, y, z);
	}
	else {
		decalPos = x;
	}
	let dotCenter = this.looking.dot(makeVector(this.pos, decalPos).normalize());
	return (dotCenter > rangeDown || distSq(this.pos.x, this.pos.y, this.pos.z, decalPos.x, decalPos.y, decalPos.z) < 100);
}
Player.prototype.lookingAt = function (m) {
	let bulletInitial = createVector(this.pos.x, this.pos.y, this.pos.z);
	let range = 1500;
	let bulletDir = this.looking.copy().setMag(range);

	let minX, maxX, minY, maxY, minZ, maxZ;
	let min, max; // min is max(of all mins), max is min(of all maxs) compared to each axis

	let boundMin = createVector(), boundMax = createVector();

	let collidedPlanes = [];

	let len = m.length;
	for (let i = 0; i < len; ++i) {
		let plane = m[i];
		if (plane.culled) { continue; }
		if (plane.axis == "x") {
			boundMin.set(plane.left, plane.up, plane.pos.z);
			boundMax.set(plane.right, plane.down, plane.pos.z + 0.1);
		}
		else if (plane.axis == "y") {
			boundMin.set(plane.left, plane.pos.y, plane.front);
			boundMax.set(plane.right, plane.pos.y + 0.1, plane.back);
		}
		else if (plane.axis == "z") {
			boundMin.set(plane.pos.x, plane.up, plane.front);
			boundMax.set(plane.pos.x + 0.1, plane.down, plane.back);
		}

		minX = (boundMin.x - bulletInitial.x) / bulletDir.x;
		maxX = (boundMax.x - bulletInitial.x) / bulletDir.x;
		if (minX > maxX) {
			let t = minX;
			minX = maxX;
			maxX = t;
		}

		minY = (boundMin.y - bulletInitial.y) / bulletDir.y;
		maxY = (boundMax.y - bulletInitial.y) / bulletDir.y;
		if (minY > maxY) {
			let t = minY;
			minY = maxY;
			maxY = t;
		}

		if (minX > maxY || minY > maxX) { // true when no overlap btw intervals
			continue;
		}

		min = minX > minY ? minX : minY;
		max = maxX < maxY ? maxX : maxY;

		minZ = (boundMin.z - bulletInitial.z) / bulletDir.z;
		maxZ = (boundMax.z - bulletInitial.z) / bulletDir.z;
		if (minZ > maxZ) {
			let t = minZ;
			minZ = maxZ;
			maxZ = t;
		}

		if (minZ > max || min > maxZ) {
			continue;
		}

		min = minZ > min ? minZ : min;
		max = maxZ < max ? maxZ : max;

		let iPt = bulletInitial.copy().add(bulletDir.copy().mult(min));
		if (min > 0) {
			collidedPlanes.push([plane, iPt]);
		}
	}

	let maxDistSq = range * range;
	let finalIpt = null;
	let finalPlane = null;
	for (let planeStuff of collidedPlanes) {
		let plane = planeStuff[0];
		let iPt = planeStuff[1];

		let dSq = distSq(bulletInitial.x, bulletInitial.y, bulletInitial.z, iPt.x, iPt.y, iPt.z);
		if (dSq < maxDistSq) {
			maxDistSq = dSq;
			finalIpt = iPt;
			finalPlane = plane;
		}
	}

	return [finalPlane, finalIpt];
}

let old_x , old_y , old_px , old_py , old_size , old_color_r,old_color_g,old_color_b ; 

Player.prototype.paint = function () {
	let [lookingPlane, lookingPt] = this.lookingAt(currentMap.planes);
	if (!this.pLookingPlane || !this.pLookingPt || this.pLookingPlane !== lookingPlane) {
		this.pLookingPlane = lookingPlane;
		// this.ppLookingPt = this.ppLookingPt;
		this.pLookingPt = lookingPt;
	}

	if (lookingPlane && lookingPt) {
		let [x, y] = lookingPlane.convertWorldCoords(lookingPt);
		let [px, py] = lookingPlane.convertWorldCoords(this.pLookingPt);
		// let [ppx, ppy] = lookingPlane.convertWorldCoords(this.ppLookingPt);
		if(old_x === x && old_y === y && old_px === px && old_py === py 
		&& old_size === color_picker.size_slider.value && old_color_r === this.col.levels[0] 
		&& old_color_g === this.col.levels[1] && old_color_b === this.col.levels[2]) return; 
		// x = x | 0; y = y | 0; px = px | 0; py = py | 0; // converts float to int would only work for 32 bit sint
		socket.emit("playerPaint", lookingPlane.index, x, y, px, py, color_picker.size_slider.value, this.col.toString());
		lookingPlane.paint(x*planeGraphicResolutionScale, y*planeGraphicResolutionScale, px*planeGraphicResolutionScale, py*planeGraphicResolutionScale, color_picker.size_slider.value, this.col);
		
		this.pLookingPt.set(lookingPt);
		
		[ old_x, old_y , old_px , old_py , old_size ] = [ x , y , px, py , color_picker.size_slider.value ] ; 
		[ old_color_r , old_color_g , old_color_b ] = this.col.levels ; 
	}
}
Player.prototype.textSpray = function (text) {
	let [lookingPlane, lookingPt] = this.lookingAt(currentMap.planes);
	if (lookingPlane) {
		let [x, y] = lookingPlane.convertWorldCoords(lookingPt);
		let strokeCol = color(0, 0);
		if (lookingPlane.axis === "y") {
			socket.emit("playerTextSpray", lookingPlane.index, x, y, text, this.col.toString(), strokeCol.toString(),
				this.orientation);
			lookingPlane.text(x, y, text, this.col, strokeCol, this.orientation);
		}
		else {
			socket.emit("playerTextSpray", lookingPlane.index, x, y, text, this.col.toString(), strokeCol.toString(), 0);
			lookingPlane.text(x, y, text, this.col, strokeCol, 0);
		}
	}
}
Player.prototype.imageSpray = function (image) {
	let [lookingPlane, lookingPt] = this.lookingAt(currentMap.planes);
	if (lookingPlane) {
		let [x, y] = lookingPlane.convertWorldCoords(lookingPt);
		if (lookingPlane.axis === "y") {
			socket.emit("playerImageSpray", lookingPlane.index, x, y, this.orientation);
			lookingPlane.image(x, y, image, this.orientation);
		}
		else {
			socket.emit("playerImageSpray", lookingPlane.index, x, y, 0);
			lookingPlane.image(x, y, image, 0);
		}
	}
}
Player.prototype.shoot = function () {
	let bulletInitial = this.pos.copy();
	let range = 1500;
	let bulletDir = this.looking.copy().setMag(range);
	//let bulletFinal = bulletInitial.copy().add(bulletDir);

	let enemyIndex = -1;
	let minX, maxX, minY, maxY, minZ, maxZ;
	let min, max; // min is max(of all mins), max is min(of all maxs) compared to each axis

	let boundMin = createVector(), boundMax = createVector();

	for (let i = 0; i < enemies.length; ++i) {
		let enemyPos = enemies[i].pos;
		boundMin.set(enemyPos.x - this.halfDimensions.x, enemyPos.y - this.halfDimensions.y, enemyPos.z - this.halfDimensions.z);
		boundMax.set(enemyPos.x + this.halfDimensions.x, enemyPos.y + this.halfDimensions.y, enemyPos.z + this.halfDimensions.z);

		minX = (boundMin.x - bulletInitial.x) / bulletDir.x;
		maxX = (boundMax.x - bulletInitial.x) / bulletDir.x;
		if (minX > maxX) {
			let t = minX;
			minX = maxX;
			maxX = t;
		}

		minY = (boundMin.y - bulletInitial.y) / bulletDir.y;
		maxY = (boundMax.y - bulletInitial.y) / bulletDir.y;
		if (minY > maxY) {
			let t = minY;
			minY = maxY;
			maxY = t;
		}

		if (minX > maxY || minY > maxX) { // true when no overlap btw intervals
			continue;
		}

		min = minX > minY ? minX : minY;
		max = maxX < maxY ? maxX : maxY;

		minZ = (boundMin.z - bulletInitial.z) / bulletDir.z;
		maxZ = (boundMax.z - bulletInitial.z) / bulletDir.z;
		if (minZ > maxZ) {
			let t = minZ;
			minZ = maxZ;
			maxZ = t;
		}

		if (minZ > max || min > maxZ) {
			continue;
		}

		min = minZ > min ? minZ : min;
		max = maxZ < max ? maxZ : max;

		if (min > 0) {
			enemyIndex = i;
			break;
		}
	}

	if (enemyIndex >= 0) {
		let enemy = enemies[enemyIndex];
		if(enemy.health > 0) {
			enemy.health -= this.bulletDamage;
			socket.emit("enemyShot", enemy.id, this.bulletDamage);	
			easter_egg_var_dmcv += random(10, 50);
		}
		shatter(enemy.pos, 4, 2.5, -0.02, 2, enemy.col);
	}
}
Player.prototype.planeCollides = function (plane) {
	if (distSq(this.pos.x, this.pos.y, this.pos.z, plane.pos.x, plane.pos.y, plane.pos.z) > 1000000) return;
	if (Math.max(plane.dimensions.x, plane.dimensions.y) < Math.min(this.dimensions.x, this.dimensions.y, this.dimensions.z)) { this.sPlaneCollides(plane); }
	else if (Math.max(this.dimensions.x, this.dimensions.y, this.dimensions.z) < Math.min(plane.dimensions.x, plane.dimensions.y)) { this.bPlaneCollides(plane); }
}
Player.prototype.bPlaneCollides = function (plane) {
	let left = this.pos.x - this.halfDimensions.x;
	let right = this.pos.x + this.halfDimensions.x;
	let up = this.pos.y - this.halfDimensions.y;
	let down = this.pos.y + this.halfDimensions.y;
	let front = this.pos.z - this.halfDimensions.z;
	let back = this.pos.z + this.halfDimensions.z;

	if (plane.axis == 'x') {
		if (((left > plane.left && left < plane.right) || (right > plane.left && right < plane.right)) &&
			((up > plane.up && up < plane.down) || (down > plane.up && down < plane.down))) {
			if (front < plane.pos.z && back > plane.pos.z) {
				if (plane.pos.z - front < back - plane.pos.z) {
					this.pos.z = plane.pos.z + this.halfDimensions.z;
					this.vel.z = 0;
				}
				else {
					this.pos.z = plane.pos.z - this.halfDimensions.z;
					this.vel.z = 0;
				}
			}
		}
	}
	else if (plane.axis == 'y') {
		if (((left > plane.left && left < plane.right) || (right > plane.left && right < plane.right)) &&
			((front > plane.front && front < plane.back) || (back > plane.front && back < plane.back))) {
			if (up < plane.pos.y && down > plane.pos.y) {
				if (plane.pos.y - up < down - plane.pos.y) {
					this.pos.y = plane.pos.y + this.halfDimensions.y;
					this.vel.y = 0;
				}
				else {
					this.pos.y = plane.pos.y - this.halfDimensions.y;
					this.grounded = true;
					this.vel.y = 0;
					this.jumpsDone = 0;
				}
			}
		}
	}
	else if (plane.axis == 'z') {
		if (((up > plane.up && up < plane.down) || (down > plane.up && down < plane.down)) &&
			((front > plane.front && front < plane.back) || (back > plane.front && back < plane.back))) {
			if (left < plane.pos.x && right > plane.pos.x) {
				if (plane.pos.x - left < right - plane.pos.x) {
					this.pos.x = plane.pos.x + this.halfDimensions.x;
					this.vel.x = 0;
				}
				else {
					this.pos.x = plane.pos.x - this.halfDimensions.x;
					this.vel.x = 0;
				}
			}
		}
	}
}
Player.prototype.sPlaneCollides = function (plane) {
	let left = this.pos.x - this.halfDimensions.x;
	let right = this.pos.x + this.halfDimensions.x;
	let up = this.pos.y - this.halfDimensions.y;
	let down = this.pos.y + this.halfDimensions.y;
	let front = this.pos.z - this.halfDimensions.z;
	let back = this.pos.z + this.halfDimensions.z;

	if (plane.axis == 'x') {
		if (((plane.left > left && plane.left < right) || (plane.right > left && plane.right < right)) &&
			((plane.up > up && plane.up < down) || (plane.down > up && plane.down < down))) {
			if (front < plane.pos.z && back > plane.pos.z) {
				if (plane.pos.z - front < back - plane.pos.z) {
					this.pos.z = plane.pos.z + this.halfDimensions.z;
					this.vel.z = 0;
				}
				else {
					this.pos.z = plane.pos.z - this.halfDimensions.z;
					this.vel.z = 0;
				}
			}
		}
	}
	else if (plane.axis == 'y') {
		if (((plane.left > left && plane.left < right) || (plane.right > left && plane.right < right)) &&
			((plane.front > front && plane.front < back) || (plane.back > front && plane.back < back))) {
			if (up < plane.pos.y && down > plane.pos.y) {
				if (plane.pos.y - up < down - plane.pos.y) {
					this.pos.y = plane.pos.y + this.halfDimensions.y;
					this.vel.y = 0;
				}
				else {
					this.pos.y = plane.pos.y - this.halfDimensions.y;
					this.grounded = true;
					this.vel.y = 0;
					this.jumpsDone = 0;
				}
			}
		}
	}
	else if (plane.axis == 'z') {
		if (((plane.up > up && plane.up < down) || (plane.down > up && plane.down < down)) &&
			((plane.front > front && plane.front < back) || (plane.back > front && plane.back < back))) {
			if (left < plane.pos.x && right > plane.pos.x) {
				if (plane.pos.x - left < right - plane.pos.x) {
					this.pos.x = plane.pos.x + this.halfDimensions.x;
					this.vel.x = 0;
				}
				else {
					this.pos.x = plane.pos.x - this.halfDimensions.x;
					this.vel.x = 0;
				}
			}
		}
	}
}