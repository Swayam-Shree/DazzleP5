let planeGraphicResolutionScale = 1;

class Plane{
  	constructor(x, y, z, wid, hei, axis, col = 0, intendedGravityAxis = "+y"){
        this.index = -1;
	    this.pos = createVector(x, y, z);
	    this.dimensions = createVector(wid, hei);
		this.halfDimensions = createVector(wid/2, hei/2);
	    this.axis = axis;
	    this.col = col;
		this.culled = false;
        this.used = false;
        this.graphic = createGraphics(wid * planeGraphicResolutionScale, hei * planeGraphicResolutionScale);
        this.graphic.background(this.col);
        this.graphic.textAlign(this.graphic.CENTER, this.graphic.CENTER);

	    if (this.axis == 'x'){
			this.normal = right.copy();
	      	this.left = this.pos.x - this.dimensions.x/2;
	      	this.right = this.pos.x + this.dimensions.x/2;
	      	this.up = this.pos.y - this.dimensions.y/2;
	      	this.down = this.pos.y + this.dimensions.y/2;
	      	this.upLeft = createVector(this.left, this.up, this.pos.z);
	      	this.upRight = createVector(this.right, this.up, this.pos.z);
	      	this.downLeft = createVector(this.left, this.up, this.pos.z);
	      	this.downRight = createVector(this.right, this.down, this.pos.z);
	    }
	    else if (this.axis == 'y'){
			this.normal = down.copy();
	      	this.left = this.pos.x - this.dimensions.x/2;
	      	this.right = this.pos.x + this.dimensions.x/2;
	      	this.front = this.pos.z - this.dimensions.y/2;
	      	this.back = this.pos.z + this.dimensions.y/2;
	      	// this.frontLeft = createVector(this.left, this.pos.y, this.front);
	      	// this.frontRight = createVector(this.right, this.pos.y, this.front);
	      	// this.backLeft = createVector(this.left, this.pos.y, this.back);
	      	// this.backRight = createVector(this.right, this.pos.y, this.back);
	    }
	    else if (this.axis == 'z'){
			this.normal = back.copy();
	      	this.front = this.pos.z - this.dimensions.x/2;
	      	this.back = this.pos.z + this.dimensions.x/2;
	      	this.up = this.pos.y - this.dimensions.y/2;
	      	this.down = this.pos.y + this.dimensions.y/2;
	      	this.upBack = createVector(this.pos.x, this.up, this.back);
	      	this.upFront = createVector(this.pos.x, this.up, this.front);
	      	this.downBack = createVector(this.pos.x, this.down, this.back);
	      	this.downFront = createVector(this.pos.x, this.down, this.front);
    	}

        this.intendedGravityAxis = intendedGravityAxis ? intendedGravityAxis : "+y";
  	}
}
Plane.prototype.display = function(){
    if (this.culled) return;
	push();
	translate(this.pos.x, this.pos.y, this.pos.z);
    if (this.axis === 'y'){rotateX(PI/2);}
    else if (this.axis === 'z'){rotateY(PI/2);}

    noStroke();

    if ( easter_egg_ricked ) { 
        if( easter_egg_var_image ) texture(easter_egg_var_image) ; 
    }
    else if (this.used){
        texture(this.graphic);
    }
    else fill(this.col);
    plane(this.dimensions.x, this.dimensions.y);
	pop();
}
Plane.prototype.paint = function(x, y, px, py, size, col){
    this.used = true;
    this.graphic.stroke(col);
    this.graphic.strokeWeight(size);
    this.graphic.line(px, py, x, y);
}
Plane.prototype.text = function(x, y, text, fillCol, strokeCol, orientation){
    this.used = true;
    this.graphic.push();
    this.graphic.fill(fillCol);
    this.graphic.stroke(strokeCol);
    this.graphic.translate(x, y)
    this.graphic.rotate(-orientation);
    this.graphic.text(text, 0, 0);
    this.graphic.pop();
}
Plane.prototype.image = function(x, y, image, orientation){
    this.used = true;
    this.graphic.push();
    this.graphic.translate(x, y)
    this.graphic.rotate(-orientation);
    this.graphic.image(image, -image.width/2, -image.height/2);
    this.graphic.pop();
}
Plane.prototype.convertWorldCoords = function(pt){
    let mX, mY;
	if (this.axis == "x"){
		mX = pt.x - this.left;
		mY = pt.y - this.up;
	}
	else if (this.axis == "y"){
		mX = (pt.x - this.left);
		mY = pt.z - this.front;
	}
	else if (this.axis == "z"){
		mX = this.dimensions.x - (pt.z - this.front);
		mY = pt.y - this.up;
	}
	if (this.texture){
		mX = map(mX, 0, this.dimensions.x, this.graphic.width, 0);
		mY = map(mY, 0, this.dimensions.y, 0, this.graphic.height);
	}
	return [mX, mY];
}

class Map{
    constructor(template, cols = ""){
        this.template = template;
        this.cols = cols.split(" ");
        this.planes = [];
        this.initialized = false;
        this.axis = "-y";
    }
}
Map.prototype.addPlane = function(x, y, z, wid, hei, axis){
    this.initCheck();
    this.planes.push(new Plane(x, y, z, wid, hei, axis))
}
Map.prototype.build = function(x, y, z){
    this.initCheck();
    for (let i = 0; i < this.template.length; ++i){
		let vals = this.template[i];
        this.planes.push(new Plane(x + vals[0], y + vals[1], z + vals[2], vals[3], vals[4], vals[5], 0, vals[6]));
	}
}
Map.prototype.init = function(){
    if (this.planes.length !== this.cols.length) console.error("not enough colors to paint map");
    for (let i = 0; i < this.planes.length; ++i){
        let plane = this.planes[i];
        plane.index = i;
        plane.col = color(this.cols[i]);
        plane.graphic.background(color(this.cols[i]));
    }
    this.initialized = true;
}
Map.prototype.initCheck = function(){
    if (this.initialized) console.error("Map being edited after initialization")
}
Map.prototype.draw = function(){
    let x = 0;
    for (let i = 0; i < this.planes.length; ++i){
        let plane = this.planes[i];
        player.planeCollides(plane);
        // plane.culled = !player.planeCulling(plane);
        plane.display();
        // if (plane.axis == 'x' || plane.axis == 'z' && !plane.culled) ++x;

        if (enableShatterDecals){
            for (let i = 0; i < shatterDecals.length; ++i){
                shatterDecals[i].planeCollides(plane);
            }
        }
	}
  	// planeDisplayCount = x;
}

function changeGravity(){
    if (enableGravityManipulation){
        let [plane, ipt] = player.lookingAt(currentMap.planes);
        switch (plane.axis){
            case "x":
                if (plane.pos.z > player.pos.z) seekGravity.set(0, 0, 0.1);
                else seekGravity.set(0, 0, -0.1);
                break;
            case "y":
                if (plane.pos.y > player.pos.y) seekGravity.set(0, 0.1, 0);
                else seekGravity.set(0, -0.1, 0);
                break;
            case "z":
                if (plane.pos.x > player.pos.x) seekGravity.set(0.1, 0, 0);
                else seekGravity.set(-0.1, 0, 0);
                break;
        }
        player.vel.mult(0);
        player.updateDimensions();
        socket.emit("playerGravityChange", seekGravity.x, seekGravity.y, seekGravity.z);
    }
}

let currentMap;
let mapClassic;
let mapInception;

let fireplace;
let showFireplace = false;

function mapSetup(){
    fireplace = new Fireplace(-150, 90, -1550 , 0);
    createMapClassic();
    createMapInception();

    currentMap = mapClassic;
}

function mapDraw(){
    currentMap.draw();
    if (showFireplace) fireplace.work();
}

function createMapClassic(){
    let template = [
        [0, 100, 0, 1000, 200, 'y'],

        [-200, 100, -300, 600, 400, 'y'],
        [-200, 100, 300, 600, 400, 'y'],

        // [315, 85, 0, 60, 30, 'z'],//boxes
        // [285, 85, 0, 60, 30, 'z'],
        // [300, 85, -30, 30, 30, 'x'],
        // [300, 85, 30, 30, 30, 'x'],
        // [300, 69.9, 0, 30, 60, 'y'],
        // [315, 55, 0, 30, 30, 'z'],
        // [285, 55, 0, 30, 30, 'z'],
        // [300, 55, -15, 30, 30, 'x'],
        // [300, 55, 15, 30, 30, 'x'],
        // [300, 39.9, 0, 30, 30, 'y'],

        [-400, 65, -250, 150, 70, 'z'],//building
        [-395, 65, -250, 150, 70, 'z'],
        [-397.5, 65, -325, 5, 70, 'x'],
        [-200, 30, -275, 200, 140, 'z'],
        [-275, 65, -325, 150, 70, 'x'],
        [-275, 65, -320, 150, 70, 'x'],
        [-350, 65, -322.5, 5, 70, 'z'],
        [-325, 65, -175, 150, 70, 'x'],
        [-325, 65, -180, 150, 70, 'x'],
        [-250, 65, -177.5, 5, 70, 'z'],
        [-200, 29.9, -250, 400, 150, 'y'],
        [-200, 34.9, -250, 400, 150, 'y'],
        [-225, 32.4, -175, 50, 5, 'x'],
        [-375, 32.4, -325, 50, 5, 'x'],
        [-25, 32.4, -325, 50, 5, 'x'],

        [-100, -40, -275, 200, 200, 'y'],
        [-100, -5, -375, 200, 70, 'x'],
        [-100, -5, -370, 200, 70, 'x'],
        [-37.5, 65, -375, 75, 70, 'x'],
        [-37.5, 65, -370, 75, 70, 'x'],
        [-75, 65, -372.5, 5, 70, 'z'],
        [-162.5, 65, -375, 75, 70, 'x'],
        [-162.5, 65, -370, 75, 70, 'x'],
        [-125, 65, -372.5, 5, 70, 'z'],
        [-125, 30, -350, 150, 50, 'y'],
        [-125, 35, -350, 150, 50, 'y'],
        [-50, 32.4, -350, 50, 5, 'z'],
        [-162.5, 65, -175, 75, 70, 'x'],
        [-162.5, 65, -180, 75, 70, 'x'],
        [-125, 65, -177.5, 5, 70, 'z'],
        [-37.5, 65, -175, 75, 70, 'x'],
        [-37.5, 65, -180, 75, 70, 'x'],
        [-75, 65, -177.5, 5, 70, 'z'],
        [-100, 17.5, -175, 200, 25, 'x'],
        [-100, 30, -170, 200, 25, 'y'],
        [-100, 35, -170, 200, 25, 'y'],
        [-100, 32.5, -157.5, 200, 5, 'x'],

        [0, 65, 250, 150, 70, 'z'],
        [-5, 65, 250, 150, 70, 'z'],
        [-2.5, 65, 325, 5, 70, 'x'],
        [-75, 65, 175, 150, 70, 'x'],
        [-75, 65, 180, 150, 70, 'x'],
        [-150, 65, 177.5, 5, 70, 'z'],
        [-125, 65, 325, 150, 70, 'x'],
        [-125, 65, 320, 150, 70, 'x'],
        [-50, 65, 322.5, 5, 70, 'z'],
        [-200, 29.9, 250, 400, 150, 'y'],
        [-200, 34.9, 250, 400, 150, 'y'],
        [-375, 32.5, 325, 50, 5, 'x' ],
        [-275, 30, 350, 150, 50, 'y'],
        [-275, 35, 350, 150, 50, 'y'],
        [-300, -40, 275, 200, 200, 'y'],
        [-350, 32.5, 350, 50, 5, 'z'],
        [-175, 32.5, 175, 50, 5, 'x'],
        [-25, 32.5, 325, 50, 5, 'x'],
        [-300, 17.5, 175, 200, 25, 'x'],
        [-300, 30, 170, 200, 25, 'y'],
        [-300, 35, 170, 200, 25, 'y'],
        [-300, 32.5, 157.5, 200, 5, 'x'],

        [-200, 30, 275, 200, 140, 'z'],
        [-400, 30, 275, 200, 140, 'z'],
        [-300, -5, 375, 200, 70, 'x'],
        [-300, -5, 370, 200, 70, 'x'],
        [-237.5, 65, 375, 75, 70, 'x'],
        [-237.5, 65, 370, 75, 70, 'x'],
        [-275, 65, 372.5, 5, 70, 'z'],
        [-362.5, 65, 375, 75, 70, 'x'],
        [-362.5, 65, 370, 75, 70, 'x'],
        [-325, 65, 372.5, 5, 70, 'z'],

        [-362.5, 65, 175, 75, 70, 'x'],
        [-362.5, 65, 180, 75, 70, 'x'],
        [-325, 65, 177.5, 5, 70, 'z'],
        [-237.5, 65, 175, 75, 70, 'x'],
        [-237.5, 65, 180, 75, 70, 'x'],
        [-275, 65, 177.5, 5, 70, 'z'],

        [-250, 75, 30, 200, 50, 'x'],
        [-250, 75, -30, 200, 50, 'x'],
        [-250, 50, 0, 200, 60, 'y'],
        [0, 30, -275, 200, 140, 'z'],
    ];
    let colStr = "rgba(50,50,50,1) rgba(35,35,35,1) rgba(44,44,44,1) rgba(36,36,36,1) rgba(23,23,23,1) rgba(33,33,33,1) rgba(37,37,37,1) rgba(51,51,51,1) rgba(26,26,26,1) rgba(16,16,16,1) rgba(50,50,50,1) rgba(31,31,31,1) rgba(45,45,45,1) rgba(29,29,29,1) rgba(28,28,28,1) rgba(59,59,59,1) rgba(20,20,20,1) rgba(44,44,44,1) rgba(55,55,55,1) rgba(48,48,48,1) rgba(21,21,21,1) rgba(48,48,48,1) rgba(46,46,46,1) rgba(57,57,57,1) rgba(28,28,28,1) rgba(57,57,57,1) rgba(30,30,30,1) rgba(27,27,27,1) rgba(47,47,47,1) rgba(38,38,38,1) rgba(36,36,36,1) rgba(15,15,15,1) rgba(29,29,29,1) rgba(57,57,57,1) rgba(46,46,46,1) rgba(34,34,34,1) rgba(60,60,60,1) rgba(20,20,20,1) rgba(15,15,15,1) rgba(23,23,23,1) rgba(25,25,25,1) rgba(27,27,27,1) rgba(59,59,59,1) rgba(39,39,39,1) rgba(24,24,24,1) rgba(36,36,36,1) rgba(53,53,53,1) rgba(41,41,41,1) rgba(44,44,44,1) rgba(31,31,31,1) rgba(45,45,45,1) rgba(39,39,39,1) rgba(22,22,22,1) rgba(33,33,33,1) rgba(33,33,33,1) rgba(46,46,46,1) rgba(32,32,32,1) rgba(26,26,26,1) rgba(13,13,13,1) rgba(11,11,11,1) rgba(49,49,49,1) rgba(13,13,13,1) rgba(20,20,20,1) rgba(51,51,51,1) rgba(37,37,37,1) rgba(24,24,24,1) rgba(52,52,52,1) rgba(56,56,56,1) rgba(48,48,48,1) rgba(59,59,59,1) rgba(42,42,42,1) rgba(50,50,50,1) rgba(26,26,26,1) rgba(36,36,36,1) rgba(19,19,19,1) rgba(24,24,24,1) rgba(26,26,26,1) rgba(15,15,15,1) rgba(28,28,28,1) rgba(51,51,51,1) rgba(56,56,56,1) rgba(30,30,30,1) rgba(24,24,24,1) rgba(49,49,49,1) rgba(30,30,30,1) rgba(34,34,34,1) rgba(47,47,47,1) rgba(34,34,34,1) rgba(36,36,36,1) rgba(34,34,34,1) rgba(19,19,19,1) rgba(13,13,13,1) rgba(48,48,48,1) rgba(51,51,51,1) rgba(16,16,16,1) rgba(10,10,10,1) rgba(47,47,47,1) rgba(52,52,52,1) rgba(53,53,53,1) rgba(56,56,56,1) rgba(48,48,48,1) rgba(46,46,46,1) rgba(32,32,32,1) rgba(14,14,14,1) rgba(28,28,28,1) rgba(45,45,45,1) rgba(51,51,51,1) rgba(21,21,21,1) rgba(43,43,43,1) rgba(17,17,17,1) rgba(12,12,12,1) rgba(54,54,54,1) rgba(49,49,49,1) rgba(14,14,14,1) rgba(41,41,41,1) rgba(55,55,55,1) rgba(42,42,42,1) rgba(59,59,59,1) rgba(51,51,51,1) rgba(11,11,11,1) rgba(27,27,27,1) rgba(57,57,57,1) rgba(50,50,50,1) rgba(50,50,50,1) rgba(32,32,32,1) rgba(29,29,29,1) rgba(21,21,21,1) rgba(19,19,19,1) rgba(60,60,60,1) rgba(33,33,33,1) rgba(26,26,26,1) rgba(51,51,51,1) rgba(25,25,25,1) rgba(25,25,25,1) rgba(48,48,48,1) rgba(52,52,52,1) rgba(48,48,48,1) rgba(29,29,29,1) rgba(10,10,10,1) rgba(33,33,33,1) rgba(46,46,46,1) rgba(32,32,32,1) rgba(35,35,35,1) rgba(49,49,49,1) rgba(13,13,13,1) rgba(42,42,42,1) rgba(33,33,33,1) rgba(21,21,21,1) rgba(13,13,13,1) rgba(53,53,53,1) rgba(48,48,48,1) rgba(49,49,49,1) rgba(58,58,58,1) rgba(36,36,36,1) rgba(46,46,46,1) rgba(44,44,44,1) rgba(35,35,35,1) rgba(53,53,53,1) rgba(37,37,37,1) rgba(16,16,16,1) rgba(60,60,60,1) rgba(30,30,30,1) rgba(41,41,41,1) rgba(47,47,47,1) rgba(37,37,37,1) rgba(47,47,47,1) rgba(53,53,53,1) rgba(41,41,41,1) rgba(47,47,47,1) rgba(41,41,41,1) rgba(36,36,36,1) rgba(53,53,53,1) rgba(46,46,46,1) rgba(37,37,37,1) rgba(57,57,57,1) rgba(46,46,46,1) rgba(52,52,52,1) rgba(50,50,50,1) rgba(38,38,38,1) rgba(41,41,41,1) rgba(21,21,21,1) rgba(14,14,14,1) rgba(25,25,25,1) rgba(40,40,40,1) rgba(40,40,40,1) rgba(56,56,56,1) rgba(12,12,12,1) rgba(28,28,28,1) rgba(12,12,12,1) rgba(24,24,24,1) rgba(14,14,14,1) rgba(37,37,37,1) rgba(40,40,40,1) rgba(31,31,31,1) rgba(55,55,55,1) rgba(36,36,36,1) rgba(15,15,15,1) rgba(54,54,54,1) rgba(33,33,33,1) rgba(22,22,22,1) rgba(16,16,16,1) rgba(29,29,29,1) rgba(51,51,51,1) rgba(41,41,41,1) rgba(38,38,38,1) rgba(24,24,24,1) rgba(56,56,56,1) rgba(29,29,29,1) rgba(18,18,18,1) rgba(54,54,54,1) rgba(26,26,26,1) rgba(54,54,54,1) rgba(21,21,21,1) rgba(22,22,22,1) rgba(29,29,29,1) rgba(57,57,57,1) rgba(18,18,18,1) rgba(22,22,22,1) rgba(13,13,13,1) rgba(19,19,19,1) rgba(43,43,43,1) rgba(41,41,41,1) rgba(23,23,23,1) rgba(40,40,40,1) rgba(44,44,44,1) rgba(34,34,34,1) rgba(51,51,51,1) rgba(32,32,32,1) rgba(31,31,31,1) rgba(24,24,24,1) rgba(41,41,41,1) rgba(24,24,24,1) rgba(29,29,29,1) rgba(58,58,58,1) rgba(21,21,21,1) rgba(23,23,23,1) rgba(17,17,17,1) rgba(37,37,37,1) rgba(14,14,14,1) rgba(29,29,29,1) rgba(25,25,25,1) rgba(51,51,51,1) rgba(30,30,30,1) rgba(16,16,16,1) rgba(53,53,53,1) rgba(24,24,24,1) rgba(32,32,32,1) rgba(41,41,41,1) rgba(30,30,30,1) rgba(33,33,33,1) rgba(21,21,21,1) rgba(36,36,36,1) rgba(31,31,31,1) rgba(46,46,46,1) rgba(26,26,26,1) rgba(24,24,24,1) rgba(16,16,16,1) rgba(23,23,23,1) rgba(25,25,25,1) rgba(12,12,12,1) rgba(13,13,13,1) rgba(25,25,25,1) rgba(34,34,34,1) rgba(49,49,49,1) rgba(36,36,36,1) rgba(38,38,38,1) rgba(59,59,59,1) rgba(34,34,34,1) rgba(39,39,39,1) rgba(20,20,20,1) rgba(12,12,12,1) rgba(44,44,44,1) rgba(50,50,50,1) rgba(42,42,42,1) rgba(52,52,52,1) rgba(19,19,19,1) rgba(19,19,19,1) rgba(14,14,14,1) rgba(22,22,22,1) rgba(48,48,48,1) rgba(55,55,55,1) rgba(10,10,10,1) rgba(46,46,46,1) rgba(31,31,31,1) rgba(14,14,14,1) rgba(25,25,25,1) rgba(40,40,40,1) rgba(28,28,28,1) rgba(46,46,46,1) rgba(27,27,27,1) rgba(54,54,54,1) rgba(12,12,12,1) rgba(35,35,35,1) rgba(25,25,25,1) rgba(38,38,38,1) rgba(49,49,49,1) rgba(19,19,19,1) rgba(59,59,59,1) rgba(12,12,12,1) rgba(51,51,51,1) rgba(58,58,58,1) rgba(15,15,15,1) rgba(27,27,27,1) rgba(21,21,21,1) rgba(43,43,43,1) rgba(26,26,26,1) rgba(51,51,51,1) rgba(28,28,28,1) rgba(48,48,48,1) rgba(36,36,36,1) rgba(55,55,55,1) rgba(43,43,43,1) rgba(44,44,44,1) rgba(16,16,16,1) rgba(17,17,17,1) rgba(38,38,38,1) rgba(27,27,27,1) rgba(16,16,16,1) rgba(12,12,12,1) rgba(57,57,57,1) rgba(26,26,26,1) rgba(52,52,52,1) rgba(17,17,17,1) rgba(49,49,49,1) rgba(54,54,54,1) rgba(22,22,22,1) rgba(15,15,15,1) rgba(42,42,42,1) rgba(20,20,20,1) rgba(16,16,16,1) rgba(17,17,17,1) rgba(29,29,29,1) rgba(18,18,18,1) rgba(33,33,33,1) rgba(33,33,33,1) rgba(15,15,15,1) rgba(45,45,45,1) rgba(32,32,32,1) rgba(54,54,54,1) rgba(20,20,20,1) rgba(39,39,39,1) rgba(50,50,50,1) rgba(22,22,22,1) rgba(26,26,26,1) rgba(23,23,23,1) rgba(11,11,11,1) rgba(58,58,58,1) rgba(47,47,47,1) rgba(24,24,24,1) rgba(31,31,31,1) rgba(15,15,15,1) rgba(35,35,35,1) rgba(40,40,40,1) rgba(57,57,57,1) rgba(20,20,20,1) rgba(42,42,42,1) rgba(20,20,20,1) rgba(50,50,50,1) rgba(20,20,20,1) rgba(14,14,14,1) rgba(13,13,13,1) rgba(32,32,32,1) rgba(31,31,31,1) rgba(45,45,45,1) rgba(42,42,42,1) rgba(25,25,25,1) rgba(53,53,53,1) rgba(52,52,52,1) rgba(22,22,22,1) rgba(59,59,59,1) rgba(17,17,17,1) rgba(45,45,45,1) rgba(16,16,16,1) rgba(24,24,24,1) rgba(27,27,27,1) rgba(13,13,13,1) rgba(20,20,20,1) rgba(52,52,52,1) rgba(22,22,22,1) rgba(26,26,26,1) rgba(10,10,10,1) rgba(48,48,48,1) rgba(43,43,43,1) rgba(49,49,49,1) rgba(13,13,13,1) rgba(55,55,55,1) rgba(23,23,23,1) rgba(36,36,36,1) rgba(28,28,28,1) rgba(28,28,28,1) rgba(37,37,37,1) rgba(23,23,23,1) rgba(40,40,40,1) rgba(28,28,28,1) rgba(34,34,34,1) rgba(33,33,33,1) rgba(36,36,36,1) rgba(47,47,47,1) rgba(53,53,53,1) rgba(36,36,36,1) rgba(52,52,52,1) rgba(52,52,52,1) rgba(38,38,38,1) rgba(14,14,14,1) rgba(42,42,42,1) rgba(24,24,24,1) rgba(24,24,24,1) rgba(45,45,45,1) rgba(47,47,47,1) rgba(42,42,42,1) rgba(23,23,23,1) rgba(26,26,26,1) rgba(16,16,16,1) rgba(39,39,39,1) rgba(57,57,57,1) rgba(28,28,28,1) rgba(33,33,33,1) rgba(12,12,12,1) rgba(20,20,20,1) rgba(23,23,23,1) rgba(18,18,18,1) rgba(16,16,16,1) rgba(31,31,31,1) rgba(41,41,41,1) rgba(49,49,49,1) rgba(40,40,40,1) rgba(17,17,17,1) rgba(59,59,59,1) rgba(39,39,39,1) rgba(42,42,42,1) rgba(58,58,58,1) rgba(33,33,33,1) rgba(17,17,17,1) rgba(29,29,29,1) rgba(11,11,11,1) rgba(34,34,34,1) rgba(18,18,18,1) rgba(45,45,45,1) rgba(10,10,10,1) rgba(50,50,50,1) rgba(44,44,44,1) rgba(60,60,60,1) rgba(48,48,48,1) rgba(20,20,20,1) rgba(37,37,37,1) rgba(60,60,60,1) rgba(16,16,16,1) rgba(27,27,27,1) rgba(25,25,25,1) rgba(57,57,57,1) rgba(44,44,44,1) rgba(35,35,35,1) rgba(32,32,32,1) rgba(59,59,59,1) rgba(59,59,59,1) rgba(44,44,44,1) rgba(54,54,54,1) rgba(30,30,30,1) rgba(17,17,17,1) rgba(51,51,51,1) rgba(45,45,45,1) rgba(32,32,32,1) rgba(17,17,17,1) rgba(35,35,35,1)";
    mapClassic = new Map(template, colStr);
    mapClassic.build(0, 0, 0);
    mapClassic.build(1000, 0, 0);
    mapClassic.build(0, 0, 1000);
    mapClassic.build(0, 0, -1000);
    mapClassic.build(-1000, 0, 0);
    mapClassic.addPlane(300, 100, -500, 400, 800, 'y');
    mapClassic.addPlane(300, 100, 500, 400, 800, 'y');
    mapClassic.addPlane(-700, 100, -500, 400, 800, 'y');
    mapClassic.addPlane(-700, 100, 500, 400, 800, 'y');
    mapClassic.init();
}
function createMapInception(){
    let template = [
        [0, -250, 0, 500, 500, 'y', "-y"],
        [0, 250, 0, 500, 500, 'y', "+y"],
        [-250, 0, 0, 500, 500, 'z', "-x"],
        [250, 0, 0, 500, 500, 'z', "+x"],
        [0, 0, -250, 500, 500, 'x', "-z"],
        [0, 0, 250, 500, 500, 'x', "+z"],
    ];
    let colStr = "rgba(50,50,50,1) rgba(35,35,35,1) rgba(44,44,44,1) rgba(36,36,36,1) rgba(23,23,23,1) rgba(33,33,33,1)";
    mapInception = new Map(template, colStr);
    mapInception.build(0, 0, 0);
    mapInception.init();
}