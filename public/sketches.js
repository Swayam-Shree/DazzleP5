class FlockingSketch{
	constructor(p){
		this.p = p;
		
	}
}

class Flock {
	constructor(){
  		this.boids = [];
	}
}
Flock.prototype.run = function() {
	let len = this.boids.length;
  	for (let i = 0; i < len; ++i) {
    	this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  	}
}
Flock.prototype.addBoid = function(b) {
  	this.boids.push(b);
}

class Boid {
	constructor(x, y, graphic){
		this.graphic = graphic;
	  	this.acceleration = createVector(0, 0);
	  	this.velocity = createVector(random(-1, 1), random(-1, 1));
	  	this.position = createVector(x, y);
	  	this.r = 3;
	  	this.maxspeed = 3;    // Maximum speed
	  	this.maxforce = 0.05; // Maximum steering force
	}
}
Boid.prototype.run = function(boids) {
  	this.flock(boids);
  	this.update();
  	this.borders();
  	this.render();
}
Boid.prototype.applyForce = function(force) {
	this.acceleration.add(force);
}
Boid.prototype.flock = function(boids) {
  	let sep = this.separate(boids);   // Separation
  	let ali = this.align(boids);      // Alignment
  	let coh = this.cohesion(boids);   // Cohesion

  	sep.mult(1.5);
  	ali.mult(1.0);
  	coh.mult(1.0);

  	this.applyForce(sep);
  	this.applyForce(ali);
  	this.applyForce(coh);
}
Boid.prototype.update = function() {
	this.velocity.add(this.acceleration);
  	this.velocity.limit(this.maxspeed);
  	this.position.add(this.velocity);
  	this.acceleration.mult(0);
}
Boid.prototype.seek = function(target) {
  	let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the location to the target
  	desired.setMag(this.maxspeed);
  	let steer = p5.Vector.sub(desired, this.velocity);
  	steer.limit(this.maxforce);  // Limit to maximum steering force
  	return steer;
}
Boid.prototype.render = function() {
	let theta = this.velocity.heading() + radians(90);
  	this.graphic.fill(110);
  	this.graphic.push();
	  	this.graphic.translate(this.position.x, this.position.y);
	  	this.graphic.rotate(theta);
		this.graphic.triangle(0, -this.r * 2,-this.r, this.r * 2,this.r, this.r * 2);
  	this.graphic.pop();
}
Boid.prototype.borders = function() {
  	if (this.position.x < -this.r)  this.position.x = this.graphic.width + this.r;
  	if (this.position.y < -this.r)  this.position.y = this.graphic.height + this.r;
  	if (this.position.x > this.graphic.width + this.r) this.position.x = -this.r;
  	if (this.position.y > this.graphic.height + this.r) this.position.y = -this.r;
}
Boid.prototype.separate = function(boids) {
  	let desiredseparation = 25.0;
  	let steer = createVector(0, 0);
  	let count = 0;
  	for (let i = 0; i < boids.length; i++) {
		let boid = boids[i];
    	let dSq = distSq(this.position.x, this.position.y, this.position.z, boid.position.x, boid.position.y, boid.position.z);
    	if ((dSq > 0) && (dSq < desiredseparation * desiredseparation)) {
	      	let diff = p5.Vector.sub(this.position, boid.position);
	      	diff.normalize();
	      	diff.div(dSq);        // Weight by distance
	      	steer.add(diff);
	      	++count;            // Keep track of how many
    	}
  	}
  	if (count > 0) {
    	steer.div(count);
  	}
  	if (steer.mag() > 0) {
	    steer.setMag(this.maxspeed);
	    steer.sub(this.velocity);
	    steer.limit(this.maxforce);
  	}
  	return steer;
}
Boid.prototype.align = function(boids) {
  	let neighbordist = 50;
  	let sum = createVector(0,0);
  	let count = 0;
  	for (let i = 0; i < boids.length; i++) {
		let boid = boids[i];
    	let dSq = distSq(this.position.x, this.position.y, this.position.z, boid.position.x, boid.position.y, boid.position.z);
    	if ((dSq > 0) && (dSq < neighbordist * neighbordist)) {
	      	sum.add(boid.velocity);
	      	count++;
    	}
  	}
  	if (count > 0) {
	    sum.setMag(this.maxspeed);
	    let steer = p5.Vector.sub(sum, this.velocity);
	    steer.limit(this.maxforce);
	    return steer;
  	}
	else {
    	return createVector(0, 0);
  	}
}
Boid.prototype.cohesion = function(boids) {
  	let neighbordist = 50;
  	let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  	let count = 0;
  	for (let i = 0; i < boids.length; i++) {
		let boid = boids[i];
    	let dSq = distSq(this.position.x, this.position.y, this.position.z, boid.position.x, boid.position.y, boid.position.z);
    	if ((dSq > 0) && (dSq < neighbordist * neighbordist)) {
	      	sum.add(boid.position); // Add location
	      	++count;
    	}
  	}
  	if (count > 0) {
    	sum.div(count);
    	return this.seek(sum);  // Steer towards the location
  	}
	else {
    	return createVector(0, 0);
  	}
}
function graphic_poweredbyp5(g) {
	g.noStroke();
	g.push();
	g.fill(50, 50, 100);
	let a = 20;
	let r = cos(frameCount / 100) * 100 + 50;
	let d = map(r, 50, 150, 0, 10);
	if (r < 50) {
		d = 0;
		//fill(255,0,69) ;
	}
	g.translate(g.width / 2,g.height / 2);
	g.rotate(frameCount / 100);
	for (let i = 0; i < a; i++) {
		g.rotate(TWO_PI / a);
		g.circle(r, 0, d);
	}
	g.pop();
	g.push();
	g.noStroke();
	g.fill(50, 50, 100);
	if (r < 50) {
		d = 0;
		g.fill(255, 0, 69);
	}
	d = map(r, 50, 150, 0, 10);
	r = 100;
	g.translate(g.width / 2, g.height / 2);
	g.rotate(-frameCount / 100);
	for (let i = 0; i < a; i++) {
		g.rotate(TWO_PI / a);
		g.circle(r, 0, d);
	}
	g.pop();
	g.textAlign(CENTER, CENTER);
	g.fill(255, 0, 69, noise(frameCount / 200) * 200 + 55);
	g.textSize(10);
	g.text("powered by", g.width / 2 - 50, g.height / 2 - 20);
	g.textSize(50);
	g.text("p5.js", g.width / 2,g.height / 2);
	g.push();
	g.noStroke();
	g.fill(50, 50, 100);
	g.translate(g.width / 2, g.height / 2);
	g.rotate(frameCount / 100);
	for (let i = 0; i < a; i++) {
		g.rotate(TWO_PI / a);
		// circle( r , 0 , d ) ;
		g.push();
		g.translate(r, 0);
		Triangle(g, d);
		g.pop();
	}
	g.pop();
}