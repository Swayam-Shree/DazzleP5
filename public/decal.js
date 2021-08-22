class SphereDecal{
    constructor(x, y, z, size, dSize, col, elasticity){
        this.pos = createVector(x, y, z);
        this.size = size;
        this.halfSize = this.size/2;
        this.dSize = dSize;
        this.col = col;
        this.elasticity = elasticity;

        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);

        this.dead = false;
    }
}
SphereDecal.prototype.work = function(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.size += this.dSize;
    this.halfSize = this.size/2;

    this.dead = this.size <= 0;
}
SphereDecal.prototype.display = function(){
  	push();
	  	fill(this.col);
	  	noStroke();
	  	translate(this.pos.x, this.pos.y, this.pos.z);
	  	sphere(this.size);
  	pop();
}
SphereDecal.prototype.planeCollides = function(plane){
	if (distSq(this.pos.x, this.pos.y, this.pos.z, plane.pos.x, plane.pos.y, plane.pos.z) > 1000000) return;

  	let left = this.pos.x - this.halfSize;
  	let right = this.pos.x + this.halfSize;
  	let up = this.pos.y - this.halfSize;
  	let down = this.pos.y + this.halfSize;
  	let front = this.pos.z - this.halfSize;
  	let back = this.pos.z + this.halfSize;

  	if (plane.axis == 'x'){
	    if (((left > plane.left && left < plane.right) || (right > plane.left && right < plane.right)) &&
	        ((up > plane.up && up < plane.down) || (down > plane.up && down < plane.down))){
	        if (front < plane.pos.z && back > plane.pos.z){
	            if(plane.pos.z - front < back - plane.pos.z){
	              	this.pos.z = plane.pos.z + this.halfSize;
	              	this.vel.z *= -this.elasticity;
	            }
	            else{
	              	this.pos.z = plane.pos.z - this.halfSize;
	              	this.vel.z *= -this.elasticity;
	            }
	        }
	    }
  	}
	else if (plane.axis == 'y'){
		if (((left > plane.left && left < plane.right) || (right > plane.left && right < plane.right)) &&
			((front > plane.front && front < plane.back) || (back > plane.front && back < plane.back))){
			if (up < plane.pos.y && down > plane.pos.y){
				if(plane.pos.y - up < down - plane.pos.y){
					this.pos.y = plane.pos.y + this.halfSize;
					this.vel.y *= -this.elasticity;
				}
				else{
					this.pos.y = plane.pos.y - this.halfSize;
					this.vel.y *= -this.elasticity;
				}
			}
		}
	}
	else if (plane.axis == 'z'){
		if (((up > plane.up && up < plane.down) || (down > plane.up && down < plane.down)) &&
			((front > plane.front && front < plane.back) || (back > plane.front && back < plane.back))){
			if (left < plane.pos.x && right > plane.pos.x){
				if(plane.pos.x - left < right - plane.pos.x){
					this.pos.x = plane.pos.x + this.halfSize;
					this.vel.x *= -this.elasticity;
				}
				else{
					this.pos.x = plane.pos.x - this.halfSize;
					this.vel.x *= -this.elasticity;
				}
			}
		}
	}
}
SphereDecal.prototype.applyForce = function(force){
  this.acc.add(force);
}

let shatterDecals = [];
let maxShatterDecalCount = 150;
function shatter(pos, count, size, dSize, force, col){
	if (!enableShatterDecals) return;
	
  	for (let i = 0; i < count; i++){
		shatterDecals.push(new SphereDecal(pos.x, pos.y, pos.z, size, random(dSize/2, dSize), col, 0.5));
  	}
    let len = shatterDecals.length;
  	for (let i = shatterDecals.length - count; i < len; ++i){
	    let r = random(100);
	    let imp;
        force *= random(5); 
	    if (r < 10){
      		imp = p5.Vector.random3D().setMag(random(force, force * 2));
    	}
	    else{
	      	imp = p5.Vector.random3D().setMag(random(force));
	    }
    	shatterDecals[i].applyForce(imp);
  	}
    if (len > maxShatterDecalCount){
        shatterDecals.splice(0, len - maxShatterDecalCount);
    }
}

function shatterDraw(){
	if (!enableShatterDecals) return;

	let len = shatterDecals.length;
	for(let i = len - 1; i >= 0; --i){
		let decal = shatterDecals[i];
		decal.applyForce(gravity.copy().mult(0.5));
		decal.work();
		if (player.circleCulling(decal.pos)){
			decal.display();
		}
		if (decal.dead){
			shatterDecals.splice(i, 1);
		} 
	}
}