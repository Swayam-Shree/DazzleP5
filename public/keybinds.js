let keybindPress, keybindHold, keybindRelease;
let mouseLeft, mouseRight, mousebindPress, mousebindHold, mousebindRelease;

let defaultSprayImage;

function keybindSetup(){
	defaultSprayImage = loadImage("assets/kawaii.png");

	keybindPress = {
		32 : () => {player.jump();}, 					     	  			  // space
		16 : () => {player.sprinting = true;}, 				  			  // shift
		86 : () => {
			chatbox.on = !chatbox.on;
			if (chatbox.on) chatbox.unread_counter = 0;
		},                              // v
		67 : () => {youtube_player.on = !youtube_player.on;},  			  // c
		88 : () => {youtube_player_api.getPlayerState()===1?                 // x
					 youtube_player_api.pauseVideo():
					 youtube_player_api.playVideo();
					},													      
		90 : () => {youtube_player_api.isMuted()?                            // z
					 youtube_player_api.unMute():
					 youtube_player_api.mute();
					},                                                       
		84 : () => {player.textSpray(textspray_picker.value() || "hello");},  // t
		71 : () => { // g
			if (easter_egg_var_image) {
				player.imageSpray(easter_egg_var_image);
			}
			else {
				player.imageSpray(defaultSprayImage);
			}
		},					 
		192 : () => {hud_pointer.score_board.on = true;},         			  // `
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
		16  : () => {player.sprinting = false;}, 			// shift
		192 : () => {hud_pointer.score_board.on = false;}   // `
	}
	mousebindPress = {
		"left" : () => {
			mouseLeft = true;
			if (mouseX > 0 && mouseX < width && mouseY > height * 0.2 && mouseY < height * 0.65) {
				if( hud_pointer.pages[0].on ) return ; 
				requestPointerLock();
				youtube_player.textbox_hover = false ; 
			}
			chatbox.clicked();
			enablePaint = pointerLocked;
		},
		"right" : () => {
			mouseRight = true;
			player.seekfov = PI/1.2;
		},
		"center" : () => {
		}
	}
	mousebindHold = {
		"left" : () => {
			if (pointerLocked){
				player.shoot();
			}
			if (enablePaint){
				player.paint();
			}
		},
		"right" : () => {
		},
		// "middle" : () => {
		// }
	}
	mousebindRelease = {
		"left" : () => {
			if (pointerLocked) enablePaint = true;
			mouseLeft = false;
			player.pLookingPlane = player.pLookingPt = null;
		},
		"right" : () => {
			mouseRight = false;
			player.seekfov = PI/3;
		},
		"center" : () => {
			changeGravity();
		}
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
	if (mouseRight)mousebindHold["right"]();
}