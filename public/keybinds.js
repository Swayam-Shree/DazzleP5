let keybindPress, keybindHold, keybindRelease;
let mouseLeft, mouseRight, mousebindPress, mousebindHold, mousebindRelease;

function keybindSetup(){
	keybindPress = {
		32 : () => {player.jump();}, 						// space
		16 : () => {player.sprinting = true;}, 				// shift
		67 : () => {chatbox.on = !chatbox.on;}				// c
	}
	keybindHold = {
		38 : () => {player.moveForward();}, 				// up arrow
		40 : () => {player.moveBackward();}, 				// down arrow
		37 : () => {player.moveLeft();}, 					// left arrow
		39 : () => {player.moveRight();}, 					// right arrow
		87 : () => {player.moveForward();},					// w
		83 : () => {player.moveBackward();},				// s
		65 : () => {player.moveLeft();},					// a
		68 : () => {player.moveRight();},					// d
	}
	keybindRelease = {
		16 : () => {player.sprinting = false;}, 			// shift
	}
	mousebindPress = {
		"left" : () => {
			mouseLeft = true;
			if (mouseX > width * 0.35 && mouseX < width * 0.65 && mouseY > height * 0.35 && mouseY < height * 0.65) requestPointerLock();
			chatbox.clicked();
		},
		"right" : () => {
			mouseRight = true;
			player.clearPaint();
		},
	}
	mousebindHold = {
		"left" : () => {
			player.shoot();
			player.paint();
		}
	}
	mousebindRelease = {
		"left" : () => {
			mouseLeft = false;
			player.pLookingPlane = player.pLookingPt = null;
		},
		"right" : () => {mouseRight = true;},
	}
}

function keybindDraw(){
	if (!pointerLocked) return;
	for (key in keybindHold){
		if (keyIsDown(key)){
			keybindHold[key]();
		}
	}
	if (mouseLeft)mousebindHold["left"]();
	//if (mouseRight)mousebindHold["right"]();
}