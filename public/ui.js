class Button {
	constructor(g, s, size = 20, f = emptyfunction, toggleable = false, x = 0, y = 0, t = -10) {
		this.g = g;
		this.s = s;
		this.textSize = size;
		this.toggleable = toggleable;
		this.f = f;
		this.position(x, y);
		this.on = false;
		this.theta = radians(t);
		this.g.textSize(this.textSize);
		this.w = this.g.textWidth(this.s) + this.textSize;
		this.h = this.g.textAscent() + this.textSize / 2;
		this.c = this.c_text = this.c_stroke = this.c_lines = color(0, 0);
		this.c_inside = color(255, 0, 69);
		this.c_outside = color(40);
		this.mx = this.my = 0;
		this.lines_theta = radians(80);
		this.lines_d = this.h / tan(this.lines_theta);
		this.lines_dis = 20;
		this.lines_speed = 0.5;
		this.lines_weight = 2;
		this.displaylikelink = false;
	}
	position(x, y) {
		this.x = x;
		this.y = y;
	}
	inside() {
	 	return this.mx > 0 && this.mx < this.w && this.my > 0 && this.my < this.h;
	}
	display_lines() {
		this.g.stroke(this.c_lines);
		this.g.strokeWeight(this.lines_weight);
		let x1, y1, x2, y2;
		for (
			let i = ((frameCount * this.lines_speed) % this.lines_dis) - this.lines_d;
			i < this.w;
			i += this.lines_dis) {
				x1 = i;
				y1 = this.h;
				x2 = x1 + this.lines_d;
				y2 = 0;
				if (x2 > this.w) {
				y2 = this.g.map(x2 - this.w, 0, this.lines_d, 0, this.h);
				x2 = this.w;
				}
				if (x1 < 0) {
				y1 = this.g.map(x1, -this.lines_d, 0, 0, this.h);
				x1 = 0;
				}
				this.g.line(x1, y1, x2, y2);
	  	}
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.fill(this.c);
		this.g.rect(0, 0, this.w, this.h);
		//if( this.inside() )
		//this.display_lines() ;
		this.g.textSize(this.textSize);
		this.g.textAlign(this.g.CENTER, this.g.CENTER);
		this.g.fill(250);
		this.g.text(this.s, this.w / 2, this.h / 2);
		this.g.pop();
	}
  	display_aslink() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		// fill(this.c);
		// rect(0, 0, this.w, this.h);
		//if( this.inside() )
		//this.display_lines() ;
		this.g.textSize(this.textSize);
		this.g.textAlign(this.g.CENTER, this.g.CENTER);
		this.g.stroke(this.c);
		this.g.strokeWeight(2);
		this.g.line(this.w * 0.04, this.h * 0.9, this.w * 0.96, this.h * 0.9);
		this.g.noStroke();
		this.g.fill(this.c);
		this.g.text(this.s, this.w / 2, this.h / 2);
		this.g.pop();
  	}
	clicked() {
		if (!this.inside()) return;
		if (this.toggleable) this.on = !this.on;
		else this.f();
	}
  	setm(args) {
		this.mx = args[0] ;
		this.my = args[1] ;
  	}
	work() {
		// [this.mx, this.my] = translatePoint(
		//   	mouseX,
		//   	mouseY,
		//   	this.x,
		//   	this.y,
		//   	this.theta
		// );
		this.c = lerpColor(
			this.c,
			this.inside() ? this.c_inside : this.c_outside,
			0.1
		);
		// lerpColor(this.c, this.c_outside, 0.1);
		// this.c_lines = lerpColor(this.c_lines,this.inside()? this.c_outside:this.c_inside, 0.05) ;
		if (this.displaylikelink) this.display_aslink();
		else this.display();
		if (this.on) this.f();
	}
}


class Chatbox {
	constructor(g, s, x, y, w = 500, h = 250) {
		this.g = g ;
		this.position(x, y);
		this.s = s;
		this.w = w;
		this.hmax = this.h = h;
		this.hh = 45;
		this.hcolor = color(36, 41, 56) ; 
		this.textsizetop = this.hh * 0.8;
		this.theta = radians(-2.3);
		this.bx = this.w - (this.hh * 3) / 4;
		this.by = -this.hh / 2;
		this.br = this.hh / 2;
		this.bcolor = color(0, 0);
		this.bd = this.br * 2;
		this.mx = this.my = 0;
		this.on = true;
		this.melta = this.on ? 1 : 0;
		this.textbox = createInput();
		this.textbox.attribute("onkeypress", "chatbox_send();");
		this.textbox.style("transform-origin", "0% 0%");
		this.textbox.style("border", "none");
		this.textbox.style("margin", "none");
		this.textbox.style("outline", "none");
		this.textbox.style("padding", "none");
		this.textbox.style("color", color(10, 172, 197));
		this.textbox.style("background-color", color(30, 32, 46));
		this.textbox.style("font-size", "24px");
		this.textbox.style("font-family", "Lucida Console");
		this.textbox.size(this.w , this.hh );

		this.messagebox = createElement("textarea");
		this.messagebox.attribute("readonly", true);
		this.messagebox.style("transform-origin", "0% 0%");
		this.messagebox.style("resize", "none");
		this.messagebox.style("border", "none");
		this.messagebox.style("margin", "none");
		this.messagebox.style("outline", "none");
		this.messagebox.style("padding", "none");
		this.messagebox.style("color", color(122, 162, 247));
		this.messagebox.style("background-color", color(26, 27, 38));
		this.messagebox.style("font-size", "20px");
		this.messagebox.size(this.w , this.h - this.hh);
		// this.messagebox.hide();
		// this.textbox.hide();
		this.work_between();
		this.notification_y = 0;
		this.notification_messages = [];
		this.notification_life = 0;
		this.notification_goingup = false;
		this.notification_count = 0;
		this.unread_counter = 0 ; // for them
	}
	add_notification(s) {
		if (!this.notification_messages.length) {
			this.notification_life = 0;
			this.notification_goingup = true;
		}
    	this.notification_messages.push(s);
  	}
	findmx() {
		[this.mx, this.my] = translatePoint(
			mouseX,
			mouseY,
			this.x,
			this.y,
			this.theta
		);
	}
	position(x, y) {
		this.x = x;
		this.yy = this.y = y;
	}
	inside() {
		return this.mx > 0 && this.mx < this.w && this.my < 0 && this.my > -this.h;
	}
	inside_button() {
		if (
		this.mx > this.bx - this.br &&
		this.mx < this.bx + this.br &&
		this.my > this.by - this.br &&
		this.my < this.by + this.br
		)
		return dist(this.mx, this.my, this.bx, this.by) <= this.br;
		return false;
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);

		/// for background maybe
		//     if (this.inside()) fill(255, 0, 200);
		//     else
		this.g.noStroke();
		this.g.fill(25);
		this.g.rect(0, -this.h, this.w, this.h);
		this.g.rect(0, -this.h - this.hh - this.notification_y, this.w, this.hh);
		this.g.fill(255, 0, 69);
		this.g.textSize(15); 
		this.g.textAlign(this.g.LEFT, this.g.BASELINE);
		this.g.text(enemies.length + 1 + " online", 0,-this.h - this.hh - this.notification_y);
		this.g.textSize(20);
		this.g.textAlign(this.g.LEFT, this.g.CENTER);
		this.g.fill(200);
		if (this.notification_messages.length)
			this.g.text(this.notification_messages[0],10,-this.h - this.hh - this.notification_y + this.hh/2);
		//  flash effect??
		//     if( cos( frameCount/10 ) > 0 ) this.hcolor = lerpColor( this.hcolor , color(50, 0, 169) , 0.05 ) ;
		//     else this.hcolor = lerpColor( this.hcolor , color(50, 0, 269) , 0.05 ) ;
		this.g.fill(this.hcolor);
		this.g.rect(0, -this.h - this.hh, this.w, this.hh);
		this.g.textAlign(this.g.LEFT, this.g.BOTTOM);
		this.g.textSize(this.textsizetop);
		this.g.noStroke();
		// fill (250 , 100* ( 1 + cos(frameCount/40) )/2 + 100)
		this.g.fill(200);
		this.g.text(this.s, 5, -this.h);
		if( !this.on && this.unread_counter ) { 
			this.g.fill( 255 , 0 , 69 );	
			this.g.circle( this.w , -this.h-this.hh , this.hh/2) ;
			this.g.fill(220) ;	
			this.g.textSize(this.textsizetop*0.4) ; 
			this.g.textAlign(this.g.CENTER, this.g.CENTER) ; 
			this.g.text( this.unread_counter , this.w , -this.h-this.hh ) ; 
		}
		this.g.translate(this.bx, this.by);
		this.bcolor = lerpColor(
      	this.bcolor,
     	this.inside_button() ? color(171, 29, 81) : color(36, 58, 104), 0.2 );
		this.g.fill(this.bcolor);
		this.g.circle(0, 0, this.bd);

		this.g.strokeWeight(4);
		this.g.stroke(250); //stroke(this.inside_button() ?  0 : 250);
		let u = this.br / 6;
		let i = this.melta * 2 - 1; //map(this.h, 0, this.hmax, -1, 1);
		this.g.line(-u * 2, -i * u, 0, i * u);
		this.g.line(u * 2, -i * u, 0, i * u);
		this.g.pop();
	}
	work_dom() {
		this.textbox.position(
		this.x + (this.h - this.messagebox.height * this.melta) * sin(this.theta),
		this.y - (this.h - this.messagebox.height * this.melta) * cos(this.theta)
		);
		this.textbox.style(
		"transform",
		"rotate(" + this.theta + "rad) " + "scaleY(" + this.melta + ")"
		);
		this.messagebox.position(
		this.x + this.h * sin(this.theta),
		this.y - this.h * cos(this.theta)
		);
		this.messagebox.style(
		"transform",
		"rotate(" + this.theta + "rad) " + "scaleY(" + this.melta + ")"
		);
	}
	work_between() {
		this.work_dom();
		// this.y = this.yy - this.h + this.hmax; // cool fly away effect
		this.by = -this.h - this.hh / 2; //this.hmax ; // maybe make it like the X button?
	}
	work() {
		this.notification_life++;
		if (this.notification_life > 360) this.notification_goingup = false;
		if (this.notification_goingup) {
		this.notification_y = lerp(this.notification_y, this.hh * 1.3, 0.1);
		// if(this.notification_y < this.hh*1.3 )  this.notification_y += 2 ;
		} else {
		if (this.notification_y < 1) {
			this.notification_messages.splice(0, 1);
			if (this.notification_messages.length) {
			this.notification_goingup = true;
			this.notification_life = 0;
			}
		}
		this.notification_y = lerp(this.notification_y, 0, 0.1);
		}

		this.h = this.on ? lerp(this.h, this.hmax, 0.06) : lerp(this.h, 0, 0.08);
		this.findmx();
		this.melta = this.h / this.hmax;
		if (this.melta > 0.0001 && this.melta < 0.9999) this.work_between();
		this.display();
	}
	clicked() {
		if (this.inside_button()) {
			this.on = !this.on;
			if(this.on) this.unread_counter = 0 ; 
		}
	}
	addChat(chat){
		this.messagebox.value(this.messagebox.value() + chat + "\n");
		this.messagebox.elt.scrollTop = this.messagebox.elt.scrollHeight;
  	}
}
function chatbox_send() {
	if (keyCode === 13 && chatbox.textbox.value() !== "") {
		let s = "< " + player.name + " >: " + chatbox.textbox.value();
		chatbox.addChat(s);
		socket.emit("playerChat", s);
		chatbox.textbox.value("");
	}
}

function LoadingThing(g,x, y, theta) {
g.push() ;
let r = 20;
let d = r * 2;
g.noFill();
g.stroke(255, 0, 69);
g.strokeWeight(5);
g.circle(x, y, d);

let arcstart = radians(frameCount * 4);
let arcend = radians(frameCount * 4 + 30);
g.stroke(70, 0, 255);
g.arc(x, y, d, d, arcstart, arcend, OPEN);
if (theta !== "undefined") {
  theta = radians(theta);
  g.textSize(r*1.5)
  g.translate(x, y);
  g.rotate(theta);
  g.fill(255, 0, 69);
  g.noStroke() ;

  g.text("Loading", r * 1.2, 0);
  g.pop() ;
}
}

class ColorPicker {
	constructor(g) {
		let initColors = [color(255,0,0), color(255,0,69), color(0,255,0), color(69,0,255), color(255,255,0), "orangered"];
		// "crimson","greenyellow","orangered","indigo", "red", "cyan", "blue", "darkpurple", "deeppink", "Chartreuse", "Fuchsia", "white"];]	boardGraphicCounter = 0;
		this.g = g ; 
		this.picker = createColorPicker(initColors[int(random(initColors.length))]);
		this.color = color(0, 0);

		this.w = 100;
		this.h = 35;
		this.picker.size(this.w, this.h);
		this.picker.style("opacity", "0");
		this.picker.style("transform-origin", "0% 0%");
		// this.picker.style( "background-color" , "red" ) ;
		this.mx = this.my = 0;
		this.a = 0;
		this.alpha_slider = new Slider(g, 0, 255, 255,this.h);
		this.alpha_slider.r = 5;
		this.alpha_slider.d = 10;
		this.size_slider = new Slider(g, 1, 10,5,this.w);
		this.size_slider.r = 5;
		this.size_slider.d = 10;
		this.position(100, 100, -10);
	}
	position(x, y, t) {
		this.x = x;
		this.y = y;
		this.theta = radians(t);
		this.picker.position(x, y);
		this.picker.style("transform", "rotate(" + this.theta + "rad)");
		this.size_slider.x = this.x - (3 + this.h) * sin(this.theta);
		this.size_slider.y = this.y + (3 + this.h) * cos(this.theta);
		this.size_slider.theta = this.theta;

		this.alpha_slider.x = this.x - (3 + this.h) * sin(this.theta) - 3;
		this.alpha_slider.y = this.y + (3 + this.h) * cos(this.theta);
		this.alpha_slider.theta = this.theta - PI / 2;
	}
	inside() {
		return this.mx > 0 && this.mx < this.w && this.my > 0 && this.my < this.h;
	}
	setm(args) {
		this.mx = args[0];
		this.my = args[1];
	}
	clicked() {
		this.size_slider.clicked();
		this.alpha_slider.clicked();
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.noStroke() ; 
		this.g.fill(200) ; 
		this.g.textSize(10) ; 
		this.g.textAlign(this.g.LEFT, this.g.BOTTOM ) ; 
		this.g.text("Color:",0,1) ; 
		this.g.text("Size",0,this.h+15);
		this.g.stroke(255, this.a);
		this.g.strokeWeight(2);

		this.g.fill(this.color);
		this.g.rect(0, 0, this.w, this.h);
		this.g.pop();
		this.size_slider.work();
		this.alpha_slider.work();
	}
	work() {
		this.a = lerp(this.a, this.inside() ? 255 : 10, 0.08);
		this.setm(translatePoint(mouseX, mouseY, this.x, this.y, this.theta));
		this.color = lerpColor(this.color, this.picker.color(), 0.08);
		this.color.setAlpha(this.alpha_slider.value);
		this.size_slider.color_line = this.color;
		this.size_slider.color_button = lerpColor(
			color(255, 0, 69),
			this.color,
			0.6
		);
		this.alpha_slider.color_line = this.color;
		this.alpha_slider.color_button = lerpColor(
			color(255, 0, 69),
			this.color,
			0.6
		);
		this.display();
	}
}

class Slider {
	constructor(
	g,
	min_val = 0,
	max_val = 100,
	default_val = null,
	w = 150,
	x = 0,
	y = 0,
	theta = 0,
	show_value = 2
	) {
		this.g = g;

		this.position(x, y);
		this.w = w;
		this.r = 10;
		this.d = 2 * this.r;
		this.on = false;
		this.color_button = color(0, 0);
		this.color_line = color(255, 0, 69);
		this.color_text = color(255, 0, 69);
		this.bx = this.xoff = this.yoff = this.mx = this.my = 0;
		this.theta = theta;
		this.show_value = show_value;
		this.minval = min_val;
		this.maxval = max_val;
		this.value = default_val || this.minval;
		this.bx = ((this.value - this.minval) * this.w) / (this.maxval - this.minval);
	}
	position(x, y) {
		this.x = x;
		this.y = y;
	}
	setm(args) {
		this.mx = args[0];
		this.my = args[1];
	}
	inside(x, y) {
		if (
			x > this.bx - this.r &&
			x < this.bx + this.r &&
			y > -this.r &&
			y < this.r
		)
			return dist(x, y, this.bx, 0) < this.r;
		return false;
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.stroke(80);
		this.g.strokeWeight(3);
		this.g.line(0, 0, this.w, 0);
		this.g.stroke(this.color_line);
		this.g.line(0, 0, this.bx, 0);
		this.g.noStroke();
		this.g.fill(this.color_button);
		this.g.circle(this.bx, 0, this.d);
		this.g.fill(this.color_text);
		if (this.show_value) {
			/// maybe even control it when on? too many things possible
			if (this.show_value === 1 || this.on || this.inside(this.mx, this.my)) {
				this.g.textSize(this.r * 2.5);
				this.g.textAlign(LEFT, BOTTOM);
				this.g.text(int(this.value), this.w, 0);
			}
		}
		this.g.pop();
	}
	clicked() {
		if (this.inside(this.mx, this.my)) {
			this.xoff = this.bx - this.mx;
			this.yoff = this.y - this.my;
			this.on = true;
		}
	}
	work() {
		this.display();
		this.setm(translatePoint(mouseX, mouseY, this.x, this.y, this.theta));
		if (this.on) {
			this.bx = constrain(this.xoff + this.mx, 0, this.w);
			this.value =
			this.minval + (this.maxval - this.minval) * (this.bx / this.w);
			if (!mouseIsPressed) this.on = false;
		}
		if (this.inside(this.mx, this.my) || this.on)
			this.color_button = lerpColor(this.color_button, color(0, 0, 0), 0.1);
		else this.color_button = lerpColor(this.color_button, color(255, 0, 69), 0.1);
	}
}

function new_killfeed(s1,s2,c1=color(255,0,0),c2=color(0,0,255)) { 
	if (side_notifications.length)
    	side_notifications.push(new Notification(hud_pointer,
			50 + side_notifications[side_notifications.length - 1].yseek,s1,s2,c1,c2));
	else
    	side_notifications.push(new Notification(hud_pointer,
			150, s1,s2,c1,c2));
}

let side_notifications = [];

function display_killfeed() { 
	for (let i = side_notifications.length - 1; i > -1; i--) {
		let s = side_notifications[i];
		s.work();
		if (s.haslife && s.life >= s.lifetime) {
		  s.haslife = false;
		  for (let j = side_notifications.length - 1; j > -1; j--)
			side_notifications[j].yseek -= 50;
		}
		if (!s.haslife && s.y + s.h < 5) side_notifications.splice(i, 1);
	  }
}
class Notification {
	constructor(g,y = 50,s1="",s2="", c1 = color(255, 0, 0), c2 = color(0, 0, 250)) {
	  this.g = g ;
	  this.h = 40;
	  this.x = (width * 5) / 6;
	  this.y = -this.h;
	  this.yseek = y;
	  this.textsize = this.h * 0.7;
	  this.life = 0;
	  
	  this.lifetime = 240;
	  this.haslife = true;
	  this.important = false;
	  this.s1 = s1;
	  this.s2 = s2;
	  // this.s2 = "Jolyne"; // Limit it to 10? //12 seems good
	  
	  this.c1 = c1;
	  this.c2 = c2;
	  this.c = this.c1;
	  this.cw = 0;
	  this.g.textSize(this.textsize);
	  let a1 = this.g.textWidth(this.s1);
	  let a2 = this.g.textWidth(this.s2);
	  this.w = a1 > a2 ? a1 : a2;
	  this.w += 55; // further distance form the center
	  this.w *= 2;
	}
	display() {
	  this.g.rectMode(this.g.CENTER);
	  if (this.important) {
		this.g.stroke(255,0,69,150);
		this.g.strokeWeight(2) ; 
	  } else this.g.noStroke() ; 
	  this.g.fill(30);
	  this.g.rect(this.x, this.y, this.w, this.h);
	  if (this.life > 30) {
		this.cw = this.g.lerp(this.cw, this.w, 0.023);
		this.g.noStroke();
		this.g.rectMode(this.g.CORNERS);
		this.g.fill(this.c);
		this.g.rect(
		  this.g.constrain(this.x - this.w / 2 + this.cw * 2, 0, this.x + this.w / 2),
		  this.y - this.h / 2,
		  this.g.constrain(this.x - this.w / 2 + this.cw, 0, this.x + this.w / 2),
		  this.y + this.h / 2
		);
		this.g.rect(
		  this.g.constrain(
			this.x + this.w / 2 - this.cw * 2,
			this.x - this.w / 2,
			this.x + this.w / 2
		  ),
		  this.y - this.h / 2,
		  this.g.constrain(
			this.x + this.w / 2 - this.cw,
			this.x - this.w / 2,
			this.x + this.w / 2
		  ),
		  this.y + this.h / 2
		);
	  }
  
	  this.g.noStroke();
	  this.g.fill(200);
	  this.g.textSize(this.textsize);
	  this.g.textAlign(this.g.LEFT, this.g.CENTER);
	  this.g.text(this.s1, this.x - this.w / 2 + this.textsize / 5, this.y);
	  this.g.textAlign(this.g.RIGHT, this.g.CENTER);
  
	  this.g.text(this.s2, this.x + this.w / 2 - this.textsize / 5, this.y);
	  this.g.circle(this.x, this.y, 10);
	}
	work() {
	  this.life++;
	  if (this.haslife) this.y = this.g.lerp(this.y, this.yseek, 0.05);
	  else this.y = this.g.lerp(this.y, -this.h, 0.05);
	  this.c = this.g.lerpColor(this.c, this.c2, 0.008);
	  this.c.setAlpha(150);
	  this.display();
	}
  }