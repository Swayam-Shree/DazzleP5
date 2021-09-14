/// <reference path="../node_modules/@types/p5/global.d.ts" />
p5.disableFriendlyErrors = true;

let worldCanvas;

let fr = 0, averageFramerate = 0;

let gravity;
let origin, left, right, up, down, front, back;

let pointerLocked;
let enablePaint;

let player;

let loggedIn = false;
let tabFocused = true;

let font, openSans, noobFont;
let background_r, background_g, background_b, background_a;

function preload(){
  	font = loadFont('assets/font.ttf');
  	openSans = loadFont('assets/OpenSans.ttf');
	noobFont = loadFont("assets/noobFont.ttf");
}

function setup(){
	worldCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
	worldCanvas.style("z-index", "-1");
	
	frameRate(60);
	networkSetup();
	origin = createVector(0, 0, 0);left = createVector(-1, 0, 0);right = createVector(1, 0, 0);up = createVector(0, -1, 0);down = createVector(0, 1, 0);front = createVector(0, 0, -1);back = createVector(0, 0, 1);
  	gravity = down.copy().mult(0.1);

  	makeLogIn();
	document.addEventListener("dragenter", () => {youtube_player.textbox_hover = true;youtube_player.textbox_tempval = youtube_player.textbox.value();});
	document.addEventListener("dragend"  , () => {youtube_player.textbox_hover = true;youtube_player.textbox_tempval = youtube_player.textbox.value();});
	easter_egg_refresh();

	dustSetup();
}

function draw(){
	if (!loggedIn)return;
	if (disconnected){makeDisconnect(); hud_pointer.remove(); remove(); return;}

	pointerLocked = document.pointerLockElement === canvas || document.mozPointerLockElement === canvas;
	fr += frameRate();if (frameCount % 50 == 0){averageFramerate = floor(fr/50);fr = 0;}
	background(background_r, background_g, background_b, background_a); 

	player.update();

	if(abs(player.seekfov - player.fov) > 0.0001 ) {
		player.fov = lerp(player.fov, player.seekfov, 0.15 ) ; 
		player.camera.perspective(player.fov, width / height, 1, 10000);
		print("AAA") ; 
	}
	keybindDraw();
	mapDraw();
	shatterDraw();
	enemyDraw();

	enemyTransparentDraw();
	// dustWork();
}

function mousePressed(){
	if (!loggedIn)return;

	if(mousebindPress[mouseButton])mousebindPress[mouseButton]();
}
function mouseReleased(){
	if (!loggedIn)return;

	if(mousebindRelease[mouseButton])mousebindRelease[mouseButton]();
}
function keyPressed(){
	if (!loggedIn)return;

	if(keybindPress[keyCode] && pointerLocked) keybindPress[keyCode]();
}
function keyReleased(){
	if (!loggedIn)return;

	if (keybindRelease[keyCode] && pointerLocked) keybindRelease[keyCode]();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	if (!loggedIn)return;
    player.camera.perspective(player.fov, width/height, 1, 10000);
}

window.onbeforeunload = function(event){
	// event.preventDefault();
	// event.returnValue = "";
	// window.localStorage.setItem("ytParticles");
	// window.localStorage.setItem("ytMute");
	// window.localStorage.setItem("sensitivity");
	// window.localStorage.setItem("ytOpen");
	// window.localStorage.setItem("chatboxOpen");
}
window.onfocus = function(){
    tabFocused = true;
	if (!loggedIn) return;
	socket.emit("playerAfkStatus", false);
	
};
window.onblur = function(){
    tabFocused = false;
	if (!loggedIn) return;
	socket.emit("playerAfkStatus", true);
}