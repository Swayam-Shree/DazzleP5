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
	  	this.pos = createVector(0, 150, 0);
	  	this.col = color(100);
		this.health = player.maxHealth;
		this.afk = false;
	  	this.nameTag = new Billboard(0, 0, 0, nameTagWidth, nameTagHeight, nameTagTexture);
	  	this.hoverChat = new Billboard(0, 0, 0, hoverChatWidth, hoverChatHeight, hoverChatTexture);

	  	this.hoverText = "";
	  	this.hoverTextTimeInit = 0;
	  	this.hoverTextDeltaTime = 0;

	  	this.orientation = 0;
	  	this.orientationVector = createVector(-sin(this.orientation), 0, -cos(this.orientation));

		this.kills = 0;
		this.deaths = 0;

		this.gravity = createVector(0, 1, 0);
	}
}
Enemy.prototype.work = function(){
  	this.orientationVector.set(-sin(this.orientation), 0, -cos(this.orientation));
  	this.display();
  	this.nameTag.pos.set(this.pos.x, this.pos.y - player.halfDimensions.y - this.nameTag.dimensions.y/2, this.pos.z);
  	this.hoverChat.pos.set(this.pos.x, this.pos.y - player.halfDimensions.y - this.nameTag.dimensions.y - this.hoverChat.dimensions.y/2, this.pos.z);

  	if (Date.now() - this.hoverTextTimeInit >= this.hoverTextDeltaTime * 1000) this.hoverText = "";
}
Enemy.prototype.display = function(){
	push();
		translate(this.pos.x, this.pos.y, this.pos.z);
		stroke(0);
	  	strokeWeight(2);
		fill(this.col);
	  	noStroke();
		if (this.gravity.x > 0){rotateZ(-PI/2);}
		else if (this.gravity.x < 0){rotateZ(PI/2);}
		else if (this.gravity.y > 0){}
		else if (this.gravity.y < 0){rotateX(PI);}
		else if (this.gravity.z > 0){rotateX(PI/2);}
		else if (this.gravity.z < 0){rotateX(-PI/2);}
	  	cylinder(player.halfDimensions.x, player.dimensions.y, 10);

	  	translate(this.orientationVector.x * 20, player.dimensions.y/3, this.orientationVector.z * 20);
	  	rotateY(this.orientation);
	  	rotateX(-PI/2);
	  	stroke(0);
	  	cone(2, 6, 9);
	pop();
}
Enemy.prototype.displayTransparentStuff = function(){
  	nameTagTexture.clear();
  	nameTagTexture.text(this.name + (this.afk ? " (afk)" : ""), nameTagTexture.width/2, nameTagTexture.height/2);
  	this.nameTag.work();

	hoverChatTexture.clear();
	hoverChatTexture.text(this.hoverText, hoverChatTexture.width/2, hoverChatTexture.height/2);
	this.hoverChat.work();
}
Enemy.prototype.putTextOnHover = function(text, t = 2){
  	this.hoverText = wordWrap(text, 25);
  	this.hoverTextTimeInit = Date.now();
  	this.hoverTextDeltaTime = t;
}