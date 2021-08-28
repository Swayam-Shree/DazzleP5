let planeGraphicResolutionScale = 1;

class Plane{
  	constructor(x, y, z, wid, hei, axis, col){
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
  	}
}
Plane.prototype.display = function(){
	push();
	translate(this.pos.x, this.pos.y, this.pos.z);
    if (this.axis == 'y'){rotateX(PI/2);}
    else if (this.axis == 'z'){rotateY(PI/2);}

    noStroke();
    fill(this.col);

    if (this.used){
        texture(this.graphic);
    }
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

let mTemplate;
let mMap = [];
let fireplace;
let showFireplace = false;

function mapSetup(){
  	mTemplate = [
        new Plane(0, 100, 0, 1000, 200, 'y', color(100)),

        new Plane(-200, 100, -300, 600, 400, 'y', color(0, 100, 0)),
        new Plane(-200, 100, 300, 600, 400, 'y', color(0, 100, 0)),

        new Plane(315, 85, 0, 60, 30, 'z', color(100, 70, 30)),//boxes
        new Plane(285, 85, 0, 60, 30, 'z', color(100, 70, 30)),
        new Plane(300, 85, -30, 30, 30, 'x', color(100, 70, 30)),
        new Plane(300, 85, 30, 30, 30, 'x', color(100, 70, 30)),
        new Plane(300, 69.9, 0, 30, 60, 'y', color(100, 70, 30)),
        new Plane(315, 55, 0, 30, 30, 'z', color(100, 70, 30)),
        new Plane(285, 55, 0, 30, 30, 'z', color(100, 70, 30)),
        new Plane(300, 55, -15, 30, 30, 'x', color(100, 70, 30)),
        new Plane(300, 55, 15, 30, 30, 'x', color(100, 70, 30)),
        new Plane(300, 39.9, 0, 30, 30, 'y', color(100, 70, 30)),

        new Plane(-400, 65, -250, 150, 70, 'z', color(180, 150, 240)),//building
        new Plane(-395, 65, -250, 150, 70, 'z', color(18, 150, 240)),
        new Plane(-397.5, 65, -325, 5, 70, 'x', color(180, 150, 24)),
        new Plane(-200, 30, -275, 200, 140, 'z', color(180, 15, 240)),
        new Plane(-275, 65, -325, 150, 70, 'x', color(180, 150, 24)),
        new Plane(-275, 65, -320, 150, 70, 'x', color(180, 150, 240)),
        new Plane(-350, 65, -322.5, 5, 70, 'z', color(180, 50, 240)),
        new Plane(-325, 65, -175, 150, 70, 'x', color(180, 150, 240)),
        new Plane(-325, 65, -180, 150, 70, 'x', color(10, 150, 240)),
        new Plane(-250, 65, -177.5, 5, 70, 'z', color(180, 150, 240)),
        new Plane(-200, 29.9, -250, 400, 150, 'y', color(180, 150, 20)),
        new Plane(-200, 34.9, -250, 400, 150, 'y', color(180, 150, 240)),
        new Plane(-225, 32.4, -175, 50, 5, 'x', color(18, 150, 240)),
        new Plane(-375, 32.4, -325, 50, 5, 'x', color(18, 150, 240)),
        new Plane(-25, 32.4, -325, 50, 5, 'x', color(18, 150, 240)),

        new Plane(-100, -40, -275, 200, 200, 'y', color(180, 150, 240)),
        new Plane(-100, -5, -375, 200, 70, 'x', color(18, 15, 240)),
        new Plane(-100, -5, -370, 200, 70, 'x', color(18, 150, 240)),
        new Plane(-37.5, 65, -375, 75, 70, 'x', color(80, 150, 240)),
        new Plane(-37.5, 65, -370, 75, 70, 'x', color(180, 150, 240)),
        new Plane(-75, 65, -372.5, 5, 70, 'z', color(180, 150, 240)),
        new Plane(-162.5, 65, -375, 75, 70, 'x', color(180, 10, 240)),
        new Plane(-162.5, 65, -370, 75, 70, 'x', color(180, 150, 240)),
        new Plane(-125, 65, -372.5, 5, 70, 'z', color(180, 150, 20)),
        new Plane(-125, 30, -350, 150, 50, 'y', color(10, 150, 240)),
        new Plane(-125, 35, -350, 150, 50, 'y', color(180, 150, 240)),
        new Plane(-50, 32.4, -350, 50, 5, 'z', color(18, 150, 240)),
        new Plane(-162.5, 65, -175, 75, 70, 'x', color(180, 150, 24)),
        new Plane(-162.5, 65, -180, 75, 70, 'x', color(180, 150, 24)),
        new Plane(-125, 65, -177.5, 5, 70, 'z', color(18, 10, 24)),
        new Plane(-37.5, 65, -175, 75, 70, 'x', color(180, 150, 24)),
        new Plane(-37.5, 65, -180, 75, 70, 'x', color(10, 150, 24)),
        new Plane(-75, 65, -177.5, 5, 70, 'z', color(18, 150, 24)),
        new Plane(-100, 17.5, -175, 200, 25, 'x', color(180, 15, 24)),
        new Plane(-100, 30, -170, 200, 25, 'y', color(18, 150, 24)),
        new Plane(-100, 35, -170, 200, 25, 'y', color(18, 150, 240)),
        new Plane(-100, 32.5, -157.5, 200, 5, 'x', color(18, 150, 240)),

        new Plane(0, 65, 250, 150, 70, 'z', color(180, 150, 240)),
        new Plane(-5, 65, 250, 150, 70, 'z', color(180, 150, 24)),
        new Plane(-2.5, 65, 325, 5, 70, 'x', color(180, 150, 240)),
        new Plane(-75, 65, 175, 150, 70, 'x', color(10, 150, 240)),
        new Plane(-75, 65, 180, 150, 70, 'x', color(180, 10, 240)),
        new Plane(-150, 65, 177.5, 5, 70, 'z', color(180, 150, 24)),
        new Plane(-125, 65, 325, 150, 70, 'x', color(10, 150, 240)),
        new Plane(-125, 65, 320, 150, 70, 'x', color(180, 150, 240)),
        new Plane(-50, 65, 322.5, 5, 70, 'z', color(180, 150, 24)),
        new Plane(-200, 29.9, 250, 400, 150, 'y', color(180, 150, 240)),
        new Plane(-200, 34.9, 250, 400, 150, 'y', color(180, 150, 240)),
        new Plane(-375, 32.5, 325, 50, 5, 'x', color(18, 150, 240)),
        new Plane(-275, 30, 350, 150, 50, 'y', color(180, 10, 240)),
        new Plane(-275, 35, 350, 150, 50, 'y', color(180, 150, 20)),
        new Plane(-300, -40, 275, 200, 200, 'y', color(180, 150, 240)),
        new Plane(-350, 32.5, 350, 50, 5, 'z', color(18, 10, 240)),
        new Plane(-175, 32.5, 175, 50, 5, 'x', color(18, 10, 240)),
        new Plane(-25, 32.5, 325, 50, 5, 'x', color(18, 150, 240)),
        new Plane(-300, 17.5, 175, 200, 25, 'x', color(180, 15, 24)),
        new Plane(-300, 30, 170, 200, 25, 'y', color(18, 150, 240)),
        new Plane(-300, 35, 170, 200, 25, 'y', color(18, 150, 240)),
        new Plane(-300, 32.5, 157.5, 200, 5, 'x', color(18, 150, 240)),

        new Plane(-200, 30, 275, 200, 140, 'z', color(180, 15, 240)),
        new Plane(-400, 30, 275, 200, 140, 'z', color(180, 15, 240)),
        new Plane(-300, -5, 375, 200, 70, 'x', color(18, 10, 240)),
        new Plane(-300, -5, 370, 200, 70, 'x', color(18, 150, 24)),
        new Plane(-237.5, 65, 375, 75, 70, 'x', color(180, 150, 240)),
        new Plane(-237.5, 65, 370, 75, 70, 'x', color(10, 150, 20)),
        new Plane(-275, 65, 372.5, 5, 70, 'z', color(180, 150, 240)),
        new Plane(-362.5, 65, 375, 75, 70, 'x', color(180, 150, 240)),
        new Plane(-362.5, 65, 370, 75, 70, 'x', color(10, 150, 240)),
        new Plane(-325, 65, 372.5, 5, 70, 'z', color(180, 150, 240)),

        new Plane(-362.5, 65, 175, 75, 70, 'x', color(180, 10, 24)),
        new Plane(-362.5, 65, 180, 75, 70, 'x', color(10, 150, 24)),
        new Plane(-325, 65, 177.5, 5, 70, 'z', color(18, 150, 24)),
        new Plane(-237.5, 65, 175, 75, 70, 'x', color(180, 150, 24)),
        new Plane(-237.5, 65, 180, 75, 70, 'x', color(180, 10, 24)),
        new Plane(-275, 65, 177.5, 5, 70, 'z', color(18, 150, 24)),

        new Plane(-250, 75, 30, 200, 50, 'x', color(255, 0, 0)),
        new Plane(-250, 75, -30, 200, 50, 'x', color(255, 0, 0)),
        new Plane(-250, 50, 0, 200, 60, 'y', color(255, 0, 0)),
        new Plane(0, 30, -275, 200, 140, 'z', color(180, 15, 240)),
    ];

	makeMap(0, 0, 0);
	makeMap(1000, 0, 0);
	makeMap(0, 0, 1000);
	makeMap(0, 0, -1000);
	makeMap(-1000, 0, 0);

    mMap.push(new Plane(300, 100, -500, 400, 800, 'y', color(random(10,60))));
    mMap.push(new Plane(300, 100, 500, 400, 800, 'y', color(random(10,60))));
    mMap.push(new Plane(-700, 100, -500, 400, 800, 'y', color(random(10,60))));
    mMap.push(new Plane(-700, 100, 500, 400, 800, 'y', color(random(10,60))));

    let len = mMap.length;
    for (let i = 0; i < len; ++i){
        mMap[i].index = i;
    }

    fireplace = new Fireplace(-150, 90, -1550 , 0);
}

function mapDraw(){
  	let x = 0;
	let len = mMap.length;
    for (let i = 0; i < len; i++){
		let plane = mMap[i];
		player.planeCollides(plane);
		plane.culled = !player.planeCulling(plane);
        if (!plane.culled){
            plane.display();
            if (plane.axis == 'x' || plane.axis == 'z'){
                x++;
            }
        }
        if (enableShatterDecals){
            for (let decal of shatterDecals){
                decal.planeCollides(plane);
            }
        }
	}
  	planeDisplayCount = x;

    if (showFireplace) fireplace.work();
}

function makeMap(x, y, z){
	let len = mTemplate.length;
	for (let i = 0; i < len; i++){
		let plane = mTemplate[i];
		mMap.push(new Plane(x + plane.pos.x, y + plane.pos.y, z + plane.pos.z, plane.dimensions.x, plane.dimensions.y, plane.axis,
				color(random(10,60))));
	}
}