let nameTagWidth = 30, nameTagHeight = 15, nameTagTextSize = 15;
let hoverChatWidth = 50, hoverChatHeight = 30, hoverChatTextSize = 15;

let nameTagTexture, hoverChatTexture;

let enemies = [];
let enemySocketMap = {};

function enemySetup() {
	nameTagTexture = createGraphics(nameTagWidth * 5, nameTagHeight * 5);
  	nameTagTexture.textSize(nameTagTextSize);
  	nameTagTexture.textAlign(CENTER, CENTER);
	nameTagTexture.fill(255);
	hoverChatTexture = createGraphics(hoverChatWidth * 5, hoverChatHeight * 5);
	hoverChatTexture.textSize(hoverChatTextSize);
	hoverChatTexture.textAlign(CENTER, CENTER);
	hoverChatTexture.fill(255);
}

function enemyDraw(){
	let len = enemies.length;
	for (let i = 0; i < len; ++i){
		enemies[i].work();
		enemies[i].display();
	}
}

function enemyTransparentDraw(){
	let len = enemies.length;
	for (let i = 0; i < len; ++i){
		enemies[i].displayTransparentStuff();
	}
}

class Enemy{
	constructor(id, name){
	 	this.id = id;
	  	this.name = name;
	  	this.pos = createVector(0, 0, 0);
	  	this.col = color(0);
	  	this.nameTag = new Billboard(0, 0, 0, nameTagWidth, nameTagHeight, nameTagTexture);
	  	this.hoverChat = new Billboard(0, 0, 0, hoverChatWidth, hoverChatHeight, hoverChatTexture);

	  	this.hoverText = "";
	  	this.hoverTextTimeInit = 0;
	  	this.hoverTextDeltaTime = 0;

	  	this.orientation = 0;
	  	this.orientationVector = createVector(-sin(this.orientation), 0, -cos(this.orientation));
	}
}
Enemy.prototype.work = function(){
  	this.orientationVector.set(-sin(this.orientation), 0, -cos(this.orientation));
  	this.display();
  	this.nameTag.pos.set(this.pos.x, this.pos.y - player.halfDimensions.y - this.nameTag.dimensions.y/2, this.pos.z);
  	this.hoverChat.pos.set(this.pos.x, this.pos.y - player.halfDimensions.y - this.nameTag.dimensions.y - this.hoverChat.dimensions.y/2, this.pos.z);

  	if (millis() - this.hoverTextTimeInit >= this.hoverTextDeltaTime * 1000){
	  	this.hoverText = "";
  	}
}
Enemy.prototype.display = function(){
	push();
		translate(this.pos.x, this.pos.y, this.pos.z);
		stroke(0);
	  	strokeWeight(2);
		fill(this.col);
	  	//rotateY(this.orientation);
	  	noStroke();
	  	cylinder(player.halfDimensions.x, player.dimensions.y, 10);
	  	//box(player.dimensions.x, player.dimensions.y, player.dimensions.z);
	  	//rotateY(-this.orientation);
	  	translate(this.orientationVector.x * 20, player.dimensions.y/3, this.orientationVector.z * 20);
	  	rotateY(this.orientation);
	  	rotateX(-PI/2);
	  	stroke(0);
	  	cone(2, 6, 9);
	pop();
}
Enemy.prototype.displayTransparentStuff = function(){
  	nameTagTexture.clear();
  	nameTagTexture.text(this.name, nameTagTexture.width/2, nameTagTexture.height/2);
  	this.nameTag.work();

  	if (this.hoverText){
	  	hoverChatTexture.clear();
	  	hoverChatTexture.text(this.hoverText, hoverChatTexture.width/2, hoverChatTexture.height/2);
	  	this.hoverChat.work();
  	}
}
Enemy.prototype.putTextOnHover = function(text, t){
  	this.hoverText = wordWrap(text, 25);
  	this.hoverTextTimeInit = millis();
  	this.hoverTextDeltaTime = t;
}