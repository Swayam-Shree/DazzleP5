class SphereDecal {
	constructor(x, y, z, size, dSize, col, elasticity) {
		this.pos = createVector(x, y, z);
		this.size = size;
		this.halfSize = this.size / 2;
		this.dSize = dSize;
		this.col = col;
		this.elasticity = elasticity;

		this.vel = createVector(0, 0, 0);
		this.acc = createVector(0, 0, 0);

		this.dead = false;
	}
}
SphereDecal.prototype.work = function () {
	this.vel.add(this.acc);
	this.pos.add(this.vel);
	this.acc.mult(0);
	this.size += this.dSize;
	this.halfSize = this.size / 2;

	this.dead = this.size <= 0;
}
SphereDecal.prototype.display = function () {
	push();
	fill(this.col);
	noStroke();
	translate(this.pos.x, this.pos.y, this.pos.z);
	sphere(this.size);
	pop();
}
SphereDecal.prototype.planeCollides = function (plane) {
	if (distSq(this.pos.x, this.pos.y, this.pos.z, plane.pos.x, plane.pos.y, plane.pos.z) > 1000000) return;

	let left = this.pos.x - this.halfSize;
	let right = this.pos.x + this.halfSize;
	let up = this.pos.y - this.halfSize;
	let down = this.pos.y + this.halfSize;
	let front = this.pos.z - this.halfSize;
	let back = this.pos.z + this.halfSize;

	if (plane.axis == 'x') {
		if (((left > plane.left && left < plane.right) || (right > plane.left && right < plane.right)) &&
			((up > plane.up && up < plane.down) || (down > plane.up && down < plane.down))) {
			if (front < plane.pos.z && back > plane.pos.z) {
				if (plane.pos.z - front < back - plane.pos.z) {
					this.pos.z = plane.pos.z + this.halfSize;
					this.vel.z *= -this.elasticity;
				}
				else {
					this.pos.z = plane.pos.z - this.halfSize;
					this.vel.z *= -this.elasticity;
				}
			}
		}
	}
	else if (plane.axis == 'y') {
		if (((left > plane.left && left < plane.right) || (right > plane.left && right < plane.right)) &&
			((front > plane.front && front < plane.back) || (back > plane.front && back < plane.back))) {
			if (up < plane.pos.y && down > plane.pos.y) {
				if (plane.pos.y - up < down - plane.pos.y) {
					this.pos.y = plane.pos.y + this.halfSize;
					this.vel.y *= -this.elasticity;
				}
				else {
					this.pos.y = plane.pos.y - this.halfSize;
					this.vel.y *= -this.elasticity;
				}
			}
		}
	}
	else if (plane.axis == 'z') {
		if (((up > plane.up && up < plane.down) || (down > plane.up && down < plane.down)) &&
			((front > plane.front && front < plane.back) || (back > plane.front && back < plane.back))) {
			if (left < plane.pos.x && right > plane.pos.x) {
				if (plane.pos.x - left < right - plane.pos.x) {
					this.pos.x = plane.pos.x + this.halfSize;
					this.vel.x *= -this.elasticity;
				}
				else {
					this.pos.x = plane.pos.x - this.halfSize;
					this.vel.x *= -this.elasticity;
				}
			}
		}
	}
}
SphereDecal.prototype.applyForce = function (force) {
	this.acc.add(force);
}

let shatterDecals = [];
let maxShatterDecalCount = 150;
function shatter(pos, count, size, dSize, force, col) {
	if (!enableShatterDecals) return;

	for (let i = 0; i < count; i++) {
		shatterDecals.push(new SphereDecal(pos.x, pos.y, pos.z, size, random(dSize / 2, dSize), col, 0.5));
	}
	let len = shatterDecals.length;
	for (let i = shatterDecals.length - count; i < len; ++i) {
		let r = random(100);
		let imp;
		force *= random(5);
		if (r < 10) {
			imp = p5.Vector.random3D().setMag(random(force, force * 2));
		}
		else {
			imp = p5.Vector.random3D().setMag(random(force));
		}
		shatterDecals[i].applyForce(imp);
	}
	if (len > maxShatterDecalCount) {
		shatterDecals.splice(0, len - maxShatterDecalCount);
	}
}

function shatterDraw() {
	if (!enableShatterDecals) return;

	for (let i = shatterDecals.length - 1; i >= 0; --i) {
		let decal = shatterDecals[i];
		decal.applyForce(gravity.copy().mult(0.5));
		decal.work();
		if (player.pointCulling(decal.pos)) {
			decal.display();
		}
		if (decal.dead) {
			shatterDecals.splice(i, 1);
		}
	}
}

let dust_particles = [];
let dust_r = 200;
let dust_count = 0;
let dust_color;
let dust_delta 

function dustSetup(){
	for( let i = 0 ; i < dust_count ; ++i) dust_particles.push( new DustParticle() ) ; 
	dust_color = color(255) ;
}

function dustWork(){}
function dustdontwork(){
	push() ;
	noStroke() ; 
	// translate(player.pos);
	let dustnoise = createVector(noise(0, frameCount / 1000) * 2 - 1 , noise(1, frameCount / 1000) * 2 - 1, noise(2, frameCount / 1000) * 2 - 1 ) ;
	for( let i = dust_particles.length - 1 ; i > -1 ; --i ) { 
		dust_particles[i].pos.add(dustnoise) ; 
		dust_particles[i].pos.add(dust_delta) ; 
		dust_particles[i].work() ; 
	}
	pop() ;
}

class DustParticle {
	constructor() {
		this.pos = createVector(random(-dust_r, dust_r), random(-dust_r, dust_r), random(-dust_r, dust_r));
		this.s = random(0.1, 1);
	}
	display() {
		push();
		translate(this.pos);
		// if( this.pos.magSq() > ) 
		// else fill(255,0)
		// fill(255,10)
		fill(255,map(this.pos.magSq(), 0, dust_r * dust_r, 255, 0));
		sphere(this.s, 5, 5);
		pop();
	}
	work() {
		// this.x += player.prevPos.x - player.pos.x + noise(0, frameCount / 1000) * 2 - 1;
		// this.y += player.prevPos.y - player.pos.y + noise(1, frameCount / 1000) * 2 - 1;
		// this.z += player.prevPos.z - player.pos.z + noise(2, frameCount / 1000) * 2 - 1;
		// this.pos.add( player.prevPos.copy().sub(player.pos) ) ;
		if (this.pos.x > dust_r || this.pos.x < -dust_r) this.pos.x *= -1;
		if (this.pos.y > dust_r || this.pos.y < -dust_r) this.pos.y *= -1;
		if (this.pos.z > dust_r || this.pos.z < -dust_r) this.pos.z *= -1;
		// if (player.pointCulling(player.pos.x + this.pos.x, player.pos.y + this.pos.y, player.pos.z + this.pos.z)) this.display() ; 
		if (player.pointCulling(this.pos.x, this.pos.y, this.pos.z)) this.display() ; 
	}
} 