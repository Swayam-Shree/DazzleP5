class Billboard{
  	constructor(x, y, z, wid, hei, tex){
	    this.pos = createVector(x, y, z);
	    this.dimensions = createVector(wid, hei);
	    this.tex = tex;

	    this.anglesToRotate = 0;
  	}
}
Billboard.prototype.work = function(){
  	let toPlayer = makeVector(this.pos, createVector(player.pos.x, player.pos.y, player.pos.z));
  	this.anglesToRotate = anglesOf(toPlayer);
  	if (player.pos.x < this.pos.x){
    	this.anglesToRotate.phi *= -1;
  	}
  	this.display();
}
Billboard.prototype.display = function(){
  	push();
	  	translate(this.pos.x, this.pos.y, this.pos.z);
	  	rotateY(this.anglesToRotate.phi);
	  	if (player.pos.y > this.pos.y){rotateX(-this.anglesToRotate.theta + 5 * PI/2);}
	  	else{rotateX(-this.anglesToRotate.theta + PI/2);}
	  	texture(this.tex);
	  	noStroke();
	  	plane(this.dimensions.x, this.dimensions.y);
  	pop();
}

class Fireplace {
  	constructor(x = 0 , y = 0 , z = 0,theta= 0){
	    this.x = x;
	    this.y = y;
	    this.z = z;
      	this.theta = theta;
	    this.sx = 50;
	    this.sy = 10;
	    this.sz = 35;
	    this.p = [];
	    this.constants();
  	}
  	constants(){
	    this.inclination = radians(45);
	    this.j = this.sy / cos(this.inclination);
	    this.jj = this.j * sin(this.inclination);

	    this.texture_a = createGraphics(200, 50);
	    this.texture_a.clear();
	    this.texture_a.fill(255, 0, 69);
	    this.texture_a.textSize(40);
	    this.texture_a.textAlign(CENTER, CENTER);
	    this.texture_a.text(
	      	"Dazzle",
	      	this.texture_a.width / 2,
	      	this.texture_a.height / 2
	    );

	    this.texture_b = createGraphics(4*this.sz, 4*this.j);
  	}

  	addp(){
	    this.p.push(
	      	new Particle(
		        this.x - this.sx / 2 + random(this.sx),
		        this.y - this.sy / 2,
		        this.z - this.sz / 2 + random(this.sz)
	      	)
	    );
  	}
  	texture_work(){
	    this.texture_b.push()
	    this.texture_b.clear()
	    this.texture_b.background(255, 0, 69, 100);
	    this.texture_b.fill(0, 255, 69);
	    this.texture_b.noStroke();
	    this.texture_b.circle(this.texture_b.width / 2, this.texture_b.height / 2, 3);

	    this.texture_b.stroke(0, 255, 69);
	    let i, r, x, y;
	    i = radians(45);
	    r = this.texture_b.height / 4;
	    x = this.texture_b.width * cos(frameCount / 190);
	    y = this.texture_b.height / 2;
	    this.texture_b.line(x, y, x + r * cos(i), y + r * sin(i));
	    this.texture_b.line(x, y, x + r * cos(i), y - r * sin(i));
	    x = this.texture_b.width - x;
	    this.texture_b.line(x, y, x - r * cos(i), y + r * sin(i));
	    this.texture_b.line(x, y, x - r * cos(i), y - r * sin(i));
	    if (x < this.texture_b.width / 2) {
	      	r = map(x, this.texture_b.width / 2, 0, 0, r);
	      	this.texture_b.line(x, y - r, x, y + r);
	      	this.texture_b.line(this.texture_b.width - x, y - r, this.texture_b.width - x, y + r);
	    }
	    i = radians(-45);
	    r = this.texture_b.height / 5;
	    x = (this.texture_b.width * sin(frameCount / 190)) / 2;
	    y = this.texture_b.height / 2;
	    this.texture_b.line(x, y, x + r * cos(i), y + r * sin(i));
	    this.texture_b.line(x, y, x + r * cos(i), y - r * sin(i));
	    x = this.texture_b.width - x;
	    this.texture_b.line(x, y, x - r * cos(i), y + r * sin(i));
	    this.texture_b.line(x, y, x - r * cos(i), y - r * sin(i));

	    x = (this.texture_b.width * cos(frameCount / 60)) / 4;
	    r = 2;
	    this.texture_b.rectMode(CENTER);
	    this.texture_b.translate(x, y);
	    this.texture_b.rotate(PI / 4);
	    this.texture_b.rect(0, 0, r, r);
	    this.texture_b.rotate(-PI / 4);
	    this.texture_b.translate(this.texture_b.width - 2 * x, 0);
	    this.texture_b.rotate(PI / 4);
	    this.texture_b.rect(0, 0, r, r);
	    this.texture_b.pop() ;
  	}

  	display(){
      	push();
		    translate(this.x, this.y, this.z);
        	rotateY(this.theta)
		    noFill();
		    stroke(50);
		    box(this.sx, this.sy, this.sz);

		    translate(0, this.sy / 2, 0);
		    noStroke();
		    fill(69, 0, 255, 140);
		    rotateX(PI / 2);
		    plane(this.sx + this.jj * 2, this.sz);
		    let i = (this.sz + this.jj) / 2;
		    translate(0, i, 0);
		    plane(this.sx + this.jj, this.jj);
		    translate(0, -2 * i, 0);
		    plane(this.sx, this.jj);
		    translate(0, i, 0);
		    rotateX(-PI / 2);
		    translate(0, -this.sy / 2, 0);

		    translate(0, 0, this.sz / 2 + this.jj / 2);
		    rotateX(this.inclination);
		    noStroke();
		    texture(this.texture_a);
		    plane(this.sx, this.j);
		    rotateX(-this.inclination);

		    fill(255, 0, 69, 170);
		    translate(0, 0, -this.sz - this.jj);
		    rotateX(-this.inclination);
		    plane(this.sx, this.j);
		    rotateX(this.inclination);

		    translate(this.sx / 2, 0, (this.sz + this.jj) / 2);

		    rotateY(PI / 2);
		    rotateX(this.inclination);
		    fill(69, 0, 255, 200);

		    plane(this.sz, this.j);
		    rotateX(-this.inclination);
		    rotateY(-PI / 2);

		    translate(this.jj / 2, 0, 0);
		    rotateY(PI / 2);
		    rotateX(this.inclination);
		    texture(this.texture_b);

		    plane(this.sz, this.j);
		    rotateX(-this.inclination);
		    rotateY(-PI / 2);

		    translate(-this.sx - this.jj, 0, 0);
		    rotateY(PI / 2);
		    rotateX(-this.inclination);
		    plane(this.sz, this.j);
		    rotateX(this.inclination);
		    rotateY(-PI / 2);

		    translate(this.jj / 2, 0, 0);
		    rotateY(PI / 2);
		    rotateX(-this.inclination);
		    fill(69, 0, 255, 200);
		    plane(this.sz, this.j);
        pop();
  	}
  	work(){
		if (player.circleCulling(this.x, this.y, this.z)){
		    this.texture_work()
		    this.display();
		}
	    let j = random(4);
	    // if( random(1) < 0.1) j = random(5,10)
	  	for (let i = 0; i < j; i++) this.addp();
		for (let i = 0; i < this.p.length; i++) {
			let p = this.p[i];
		  	p.work();
		}
		for (let i = this.p.length - 1; i >= 0; --i) {
			let p = this.p[i];
		  	if (p.d <= 0 || p.a < 1) {
		       	this.p.splice(i, 1);
		    }
	    }
  	}
}
class Particle {
  	constructor(x = 0, y = 0, z = 0){
    	this.setit(x, y, z);
  	}
  	setit(x, y, z){
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    this.dx = random(-1, 1);
	    this.dy = -random(1, 3);
	    this.dz = random(-1, 1);
	    if (random(1) < 0.93) [this.r, this.g, this.b, this.a] = [255, 0, 69, 255];
	    else [this.r, this.g, this.b, this.a] = [69, 0, 255, 255];
	    this.da = random(1, 3);
	    this.d = random(3);
	    this.dd = random(this.d / 30);

	    if (random(1) < 0.6) {
	      	this.dx /= 10;
	      	this.dz /= 10;
	    }
  	}
}
Particle.prototype.move = function(){
  	this.x += this.dx;
  	this.y += this.dy;
  	this.z += this.dz;
};
Particle.prototype.display = function(){
  	push();
	  	translate(this.x, this.y, this.z);
	  	noStroke();
		fill(this.r, this.g, this.b, this.a);
	  	sphere(this.d);
  	pop();
};
Particle.prototype.work = function(){
  	this.a -= this.da;
  	this.d -= this.dd;
  	this.move();
  	if (player.circleCulling(this.x, this.y, this.z)){
  		this.display();
	}
};