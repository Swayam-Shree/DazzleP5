function page_setup(g) {
	let page_options, page_credits, page_controls, page_share ;
	page_options = new Page(g, "Options");
	page_options.contents.push(
		new ToggleButton(
			page_options.graphics,
			() => {
				showFireplace = !showFireplace;
			},
			false,
			20,
			page_options.w - 120,
			page_options.h * 2 - 100
		)
	);
	page_options.contents.push(
		new ToggleButton(
			page_options.graphics,
			() => {
				youtube_player.display_particles = !youtube_player.display_particles;
			},
			true,
			20,
			300,
			190 
		)
	);
	page_options.contents.push(
		new ToggleButton(
			page_options.graphics,
			() => {
			},
			false,
			20,
			300,
			240 
		)
	);
	let x, t;
	x = new Option_picker(page_options.graphics, 350, 350);
	x.add_item("Low");
	x.add_item("Medium");
	x.add_item("High");
	x.add_item("Ultra");
	page_options.contents.push(x);

	x = new Option_picker(page_options.graphics, 350, 500);
	t = ["ADD", "DARKEST", "LIGHTEST", "DIFFERENCE", "EXCLUSION", "MULTIPLY", "SCREEN", "REPLACE", "REMOVE", "SUBTRACT"];
	for (let i = 0; i < t.length; ++i) {
		x.add_item(t[i]);
	}

	t = [ADD, DARKEST, LIGHTEST, DIFFERENCE, EXCLUSION, MULTIPLY, SCREEN, REPLACE, REMOVE, SUBTRACT];
	for (let i = 0; i < x.functions.length; ++i) {
		x.functions[i] = () => {
			blendMode(t[i]);
		}
	}
	page_options.contents.push(x);

	page_options.contents.push(new Slider(page_options.graphics , 0.5 , 4 , 2 , 150, 280, 310 , -PI/20,2,4,()=>{
		player.sensitivity = hud_pointer.pages[0].contents[5].value/1000 ;
	}));

	page_options.graphics_static = createGraphics(1000, 200);
	page_options.graphics_static.noStroke();

	page_options.work_graphics = function () {
		// if(frameCount%5 === 0 )
		draw_static(this.graphics_static);
		this.graphics.clear();
		this.graphics.push();
		this.graphics.translate(0, -this.scrollbar.by);
		this.graphics.push();
		this.graphics.translate(0, 900);
		this.graphics.rotate(-atan(600 / this.w));
		this.graphics.image(this.graphics_static, 0, -215, this.graphics.width / 2, 200);
		this.graphics.image(this.graphics_static, this.graphics.width / 2, -215, this.graphics.width / 2, 200);
		this.graphics.image(this.graphics_static, this.graphics.width, -215, this.graphics.width / 2, 200);
		this.graphics.rotate(1.5 * atan(600 / this.w));
		this.graphics.image(this.graphics_static, 0, 0, this.graphics.width * 0.3, 110);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.3, 0, this.graphics.width * 0.3, 110);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.6, 0, this.graphics.width * 0.3, 110);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.9, 0, this.graphics.width * 0.3, 110);
		this.graphics.pop();
		this.graphics.push();
		this.graphics.translate(this.graphics.width, 800);
		this.graphics.rotate(PI - atan(600 / this.w))
		this.graphics.image(this.graphics_static, 0, -215, this.graphics.width * 0.3, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.15, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.3, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.45, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.6, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.75, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 0.9, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 1.05, -215, this.graphics.width * 0.15, 55);
		this.graphics.image(this.graphics_static, this.graphics.width * 1.2, -215, this.graphics.width * 0.15, 55);

		this.graphics.pop();
		for (let i = 0; i < this.contents.length; i++) {
			this.contents[i].setm(
				translatePoint(
					this.mx,
					this.my,
					this.contents[i].x,
					this.contents[i].y - this.scrollbar.by,
					this.contents[i].theta
				)
			);
			this.contents[i].work();
		}

		//this.graphic.translate(0, 2 * this.scrollbar.by);
		this.graphics.textAlign(this.graphics.LEFT, this.graphics.CENTER);
		this.graphics.fill(200);
		this.graphics.text("Youtube Player Particles :", 50, 200);
		this.graphics.text("RTX :", 50, 250);
		this.graphics.text("Mouse Sensitivity :", 50, 300);
		this.graphics.text("Render distance :", 50, 350);
		this.graphics.text("Blend mode :", 50, 500);
		this.graphics.fill(255,0,69) ; 
		this.graphics.text("< Experimental >", 30, 460);
		this.graphics.pop();
	};
	page_controls = new Page(g, "Controls");
	page_controls.work_graphics = function () {
		this.graphics.clear();
		this.graphics.push();
		this.graphics.translate(0, -this.scrollbar.by + 130);
		this.graphics.fill(200);
		this.graphics.noStroke();
		this.graphics.textSize(40);
		this.graphics.text("Click around the center of the screen to lock the pointer,", 20, 100);
		this.graphics.text("press ESC or ALT to unlock!", 20, 140);
		this.graphics.textSize(25);
		let a = ["Move Forward" ,"Move Left","Move Back","Move Right","Paint/Shoot","Scoreboard","Sprint","Jump",
		"Spray Text","Spray Image","Toggle Chatbox","Toggle Youtube Player","Youtube Pause/Play","Youtube Mute/Unmute"];
		let b = [ "W or ⬆","A or ⬅", "S or ⬇ ","D or ➡","Left Click","`", "Shift","Space",
		"T                  <   \"Hello\" by default, change it in the T button below the color picker",
		"G                  <   Removed the Image URL support due to spam, only works when certain youtube video is played.","V","C","X","Z"];
		let i ;
		for(i = 0 ; i < a.length ; ++i){ 
			this.graphics.text(a[i], 20, 300 + 40*i); 
			this.graphics.text("-  " + b[i] , 300, 300 + 40*i);
		}
this.graphics.text("Make the HUD - Youtube player, Chatbox, etc - Bigger or smaller with      -     Control + Mouse Scroll Up / Down", 20, i*40 + 320); 
this.graphics.text("Go Fullscreen  :  F11", 20, i*40 + 360); 
this.graphics.text("You can have a look at the source code with  :  F12", 20, i*40 + 400); 
		this.graphics.pop();
	}
	page_controls.close_clicked = () => {
		youtube_player.on = true ; 
		chatbox.on = true ; 
		page_controls.close_clicked = () =>{} ;
	}
	page_credits = new Page(g, "Credits");
	page_credits.contents.push(
		new Button(
			page_credits.graphics,
			"Patreon",
			30,
			() => {
				open("https://www.patreon.com/user?u=57089629");
			},
			false,
			20,
			400,
			-12
		)
	);
	page_credits.contents.push(
		new Button(
			page_credits.graphics,
			"Twitter",
			30,
			() => {
				open("https://twitter.com/Johnny_____John");
			},
			false,
			180,
			370,
			-12
		)
	);
	page_credits.contents.push(
		new Button(
			page_credits.graphics,
			"OnlyFans <3",
			30,
			() => {
				open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley");
			},
			false,
			320,
			340,
			-12
		)
	);
	page_credits.contents.push(
		new Button(
			page_credits.graphics,
			"Discord",
			30,
			() => {
				open("https://discord.gg/WHFcthgV4b");
			},
			false,
			400,
			400,
			0
		)
	);
	page_credits.contents.push(
		new Button(
			page_credits.graphics,
			"Kevin.Games",
			25,
			() => {
				open("https://kevin.games/");
			},
			false,
			10,
			630,
			0
		)
	);
	page_credits.work_graphics = function () {
		this.graphics.clear();
		this.graphics.push();
		this.graphics.translate(0, -this.scrollbar.by);
		for (let i = 0; i < this.contents.length; i++) {
			if (this.contents[i].setm) this.contents[i].setm(
				translatePoint(
					this.mx,
					this.my,
					this.contents[i].x,
					this.contents[i].y - this.scrollbar.by,
					this.contents[i].theta
				)
			);
			this.contents[i].work();
		}
		this.graphics.fill(255);
		this.graphics.textSize(75);
		this.graphics.text("Game By: Johnny John John", 0, 250);
		this.graphics.textSize(15);
		this.graphics.text("More to come soon!", 0, 280);
		this.graphics.text("Please consider supporting if you had a good time!", 0, 300);
		this.graphics.text("For news, updoots and spicy stuff! :", 0, 320);
		this.graphics.text("Drop by our Discord to share Art! Have a idea or maybe a suggestion? Let us know! Maybe drop in and give a few kind words :)", 0, 470);
		this.graphics.text("Email: johnnyjohnjohnjingjong@gmail.com", 0, 490);

		// this.graphics.text("none lmao", 0, 640);
		this.graphics.fill(240, 100, 80);
		this.graphics.text("Make sure to check out Kevin Games!", 0, 620);

		this.graphics.text("---- SUPPORTERS ----", 0, 740);
		this.graphics.fill(255, 0, 69);
		this.graphics.textSize(18);
		// this.graphics.text("Please show the love!", 0, 600);
		this.graphics.fill(255, 0, 255);
		this.graphics.textSize(40);	
		// this.graphics.text("Lilack - helping out with bug fixes!" , 10 , 680) ; 
		this.graphics.fill(255, 0, 69);
		this.graphics.textSize(20);	
		// this.graphics.text("Ontropy - suggestions for video easter eggs :v" , 10 , 720) ; 
		this.graphics.fill(150, 0, 255);
		this.graphics.textSize(30);	
		this.graphics.translate(50,800) ; 
		this.graphics.rotate(-0.1) ;
		this.graphics.text("Nekkoh - <3" , 0 , 0 ) ; 
		this.graphics.pop();
	}
	g.pages = [page_options, page_credits, page_controls]
	// g.pages[0].on = true ;
	// g.pages[1].on = false ;
	// g.pages[2].on = false ;
}

class Page {
	setsize() {
		this.x = width / 20;
		this.y = height / 8;
		this.w = width - 2 * this.x;
		this.h = height - 1.5 * this.y;
		this.theta = radians(-1);
		this.button_x = this.w;
		this.button_y = 0;
		this.button_r = 22;
		this.button_d = 2 * this.button_r;
		this.graphics.resizeCanvas(this.w, this.h);
	}
	constructor(g, s) {
		this.g = g;
		this.graphics = createGraphics(200,200)  ; 
		this.setsize();
		this.show_closebutton = true;
		this.s = s;
		this.on = false;
		this.mx = this.my = 0;
		this.scrollbar = new Scrollbar(
			g,
			this.h,
			this.x - 25 * cos(this.theta),
			this.y - 25 * sin(this.theta),
			this.theta
		);

		this.contents = [];
	}
	inside() {
		return this.mx > 0 && this.mx < this.w && this.my > 0 && this.my < this.h;
	}
	button_inside() {
		if (
			this.mx > this.button_x - this.button_r &&
			this.mx < this.button_x + this.button_r &&
			this.my > this.button_y - this.button_r &&
			this.my < this.button_y + this.button_r
		)
			return (
				dist(this.mx, this.my, this.button_x, this.button_y) < this.button_r
			);
		return false;
	}
	close_clicked() {} 
	clicked() {
		if (this.button_inside()) {
			this.on = false;
			this.close_clicked() ; 
		}
		this.scrollbar.clicked();
		if (!this.inside()) return;
		for (let i = 0; i < this.contents.length; i++) {
			if (this.contents[i].inside()) this.contents[i].clicked();
		}
	}
	wheel(d) {
		this.scrollbar.by_target += d / 2.5;
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.noStroke();
		this.g.fill(20);
		this.g.rect(0, 0, this.w, this.h);
		this.g.image(this.graphics, 0, 0, this.w, this.h);
		this.g.fill(205);
		this.g.textAlign(LEFT, BASELINE);
		this.g.textSize(55);
		this.g.text(this.s, 0, 0);
		if (this.show_closebutton) {
			if (this.button_inside()) {
				this.g.fill(255, 0, 69);
			} else {
				this.g.fill(70);
			}
			this.g.circle(this.button_x, this.button_y, this.button_d);
			let i = this.button_r / 3.5;
			this.g.stroke(255);
			this.g.strokeWeight(this.button_r / 5);
			this.g.line(
				this.button_x - i,
				this.button_y - i,
				this.button_x + i,
				this.button_y + i
			);
			this.g.line(
				this.button_x + i,
				this.button_y - i,
				this.button_x - i,
				this.button_y + i
			);
		}
		this.g.pop();
	}
	work() {
		[this.mx, this.my] = translatePoint(
			mouseX,
			mouseY,
			this.x,
			this.y,
			this.theta
		);
		this.mx *= this.graphics.width / this.w;
		this.my *= this.graphics.height / this.h;
		this.display();
		this.work_graphics();
		this.scrollbar.work();
	}
	work_graphics() { }
}
class Scrollbar {
	constructor(g, h = 300, x = 0, y = 50, theta = 0) {
		this.g = g;
		this.w = 20;
		this.h = h;
		this.position(x, y);
		this.theta = theta;
		this.mx = this.my = 0;
		this.bh = this.h / 10;
		this.on = false;
		this.yoff = 0;
		this.c = color(0, 0);
		this.cup = color(0, 0);
		this.cdown = color(0, 0);
	}
	position(x, y) {
		this.x = this.bx = x;
		this.y = this.by = this.by_target = y;
	}
	inside() {
		return (
			this.mx > 0 &&
			this.mx < this.w &&
			this.my > this.by - this.y &&
			this.my < this.by - this.y + this.bh
		);
	}
	setm(args) {
		this.mx = args[0];
		this.my = args[1];
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.noStroke();
		let i = 5;
		this.g.fill(this.cup);
		this.g.triangle(0, -i, this.w, -i, this.w / 2, -i - this.w);
		this.g.fill(this.cdown);
		this.g.triangle(
			0,
			this.h + i,
			this.w,
			this.h + i,
			this.w / 2,
			this.h + i + this.w
		);

		this.g.fill(15);
		this.g.rect(0, 0, this.w, this.h);
		if (this.on || this.inside()) {
			this.c = lerpColor(this.c, color(255, 0, 100), 0.2);
		} else {
			this.c = lerpColor(this.c, color(200, 0, 69), 0.2);
		}
		this.g.fill(this.c);
		this.g.rect(0, this.by - this.y, this.w, this.bh);
		this.g.pop();
	}

	clicked() {
		if (this.inside()) {
			this.on = true;
			this.yoff = this.my - this.by;
		}
	}
	work() {
		/////////////////////////////////////
		if (this.by > this.y + 5) this.cup = lerpColor(this.cup, this.c, 0.08);
		else this.cup = lerpColor(this.cup, color(0, 0), 0.05);

		if (this.by + this.bh < this.y + this.h - 5)
			this.cdown = lerpColor(this.cdown, this.c, 0.08);
		else this.cdown = lerpColor(this.cdown, color(0, 0), 0.05);
		/////////////////////////////////////

		this.setm(translatePoint(mouseX, mouseY, this.x, this.y, this.theta));

		this.display();
		// this.b.work();
		this.by = lerp(this.by, this.by_target, 0.14);
		this.by_target = constrain(
			this.by_target,
			this.y,
			this.y + this.h - this.bh
		);
		if (this.on) {
			this.by = this.by_target = this.my - this.yoff;
			if (!mouseIsPressed) this.on = false;
		}
	}
}
class ToggleButton {
	constructor(g, f = () => { }, on = false, size = 20, x = 0, y = 0, t = -10) {
		this.g = g;
		this.f = f;
		this.textSize = size;
		this.position(x, y);
		this.setit();
		this.sx = 0;
		this.on = on;
		this.theta = radians(t);
		this.coloron = color(255, 0, 100, 150);
		this.coloroff = color(85, 27, 194, 150);
		this.color = color(50, 0);
		this.mx = this.my = 0;
	}
	position(x, y) {
		this.x = x;
		this.y = y;
	}
	setit() {
		this.g.textSize(this.textSize);
		this.w = (this.g.textWidth("ON") + this.textSize) * 1;
		this.ww = this.g.textWidth("OFF") + this.w;
		this.h = this.g.textAscent() + this.textSize / 2;
	}
	setm(args) {
		this.mx = args[0];
		this.my = args[1];
	}
	inside() {
		return this.mx > 0 && this.mx < this.ww && this.my > 0 && this.my < this.h;
	}
	display() {
		this.g.push();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.textSize(this.textSize);
		this.g.textAlign(LEFT, CENTER);
		if (this.inside()) {
			this.infocus();
		} else {
			this.outfocus();
		}
		this.g.pop();
	}
	infocus() {
		this.g.fill(60 - map(this.sx, 0, this.w, 0, 20));
		this.g.noStroke();
		this.g.rect(0, 0, this.ww, this.h);
		this.g.fill(this.color);
		this.g.rect(this.sx, 0, this.w, this.h);
		if (this.on) {
			this.g.fill(0);
			this.g.text("ON", 0, this.h / 2);
			this.g.fill(200, 50);
			this.g.text("OFF", this.w, this.h / 2);
		} else {
			this.g.fill(205);
			this.g.text("OFF", this.w, this.h / 2);
			this.g.fill(200, 50);
			this.g.text("ON", 0, this.h / 2);
		}
	}
	outfocus() {
		this.g.fill(60 - map(this.sx, 0, this.w, 0, 20));
		this.g.noStroke();
		this.g.rect(0, 0, this.ww, this.h);
		this.g.fill(this.color);
		this.g.rect(this.sx, 0, this.w, this.h);
		if (this.on) {
			this.g.fill(0);
			this.g.text("ON", 0, this.h / 2);
		} else {
			this.g.fill(205);
			this.g.text("OFF", this.w, this.h / 2);
		}
	}

	clicked() {
		this.on = !this.on;
		this.f();
	}
	work() {
		this.display();
		if (this.on) {
			this.sx = lerp(this.sx, 0, 0.14);
			this.color = lerpColor(this.color, this.coloron, 0.3);
		} else {
			this.sx = lerp(this.sx, this.w, 0.14);
			this.color = lerpColor(this.color, this.coloroff, 0.05);
		}
	}
}
function draw_static(g) {
	g.fill(10, 10, 14, 50);
	// g.noStroke() ;
	g.rect(0, 0, g.width, g.height);
	for (let i = 0; i < g.width / 2; i++) {
		g.push();
		g.translate(random(g.width), random(g.height));
		g.rotate(random(TWO_PI));
		g.fill(random(255), random(255));
		if (random(1) < 0.1) fill(random(255), 0, random(255), random(150));
		if (random(100) < 0.01) fill(255, 0, 69);
		Triangle(g, random(6));
		if (random(100) < 1) {
			g.fill(10, 10, 14, 50);
			Triangle(g, random(random(60)));
		}
		g.pop();
	}
	g.fill(255, 0, 69, random(50));

	// text("Nothing here", width / 2, height / 2);
}

class Option_picker {
	constructor(g, x, y, theta = 0) {
		this.g = g;
		this.x = x;
		this.y = y;
		this.w = 100;
		this.h = 40;
		this.theta = radians(theta);
		this.size = 20;
		this.button_h = 12; //half
		this.button_w = 0.866 * 2 * this.button_h;
		this.button_x = 50;
		this.items = [];
		this.current_index = 0;
		this.functions = [];
		this.draw_x = 0;
	}
	add_item(s, f = () => { }) {
		this.items.push(s);
		this.functions.push(f);
		this.g.textSize(this.size);
		let w = this.g.textWidth(s) / 2 + this.button_w * 2;
		if (this.button_x < w) this.button_x = w;
	}
	inside() { return true; }
	inside_left() {
		return (
			this.mx > -this.button_x &&
			this.mx < -this.button_x + this.button_w &&
			this.my < this.button_h &&
			this.my > -this.button_h
		);
	}
	inside_right() {
		return (
			this.mx > this.button_x - this.button_w &&
			this.mx < this.button_x &&
			this.my < this.button_h &&
			this.my > -this.button_h
		);
	}
	clicked() {
		if (this.current_index !== 0 && this.inside_left()) {
			this.current_index--;
			this.draw_x = -this.button_x;
			this.functions[this.current_index]();
		}
		if (this.current_index !== this.items.length - 1 && this.inside_right()) {
			this.current_index++;
			this.draw_x = this.button_x;
			this.functions[this.current_index]();
		}
		this.current_index = constrain(
			this.current_index,
			0,
			this.items.length - 1
		);

	}
	display() {
		this.g.push();
		this.g.noStroke();
		this.g.translate(this.x, this.y);
		this.g.rotate(this.theta);
		this.g.fill(255, map(abs(this.draw_x), 0, this.button_x, 255, 0));
		this.g.textSize(this.size);
		this.g.textAlign(this.g.CENTER, this.g.CENTER);
		this.g.text(this.items[this.current_index], this.draw_x, 0);
		this.g.fill(255, map(this.draw_x + this.button_x, 0, this.button_x, 255, 0));
		this.g.text(
			this.items[(this.current_index + 1) % this.items.length],
			this.draw_x + this.button_x,
			0
		);
		this.g.fill(255, map(this.draw_x - this.button_x, -this.button_x, 0, 0, 255));
		this.g.text(
			this.items[
			this.current_index - 1 < 0
				? this.items.length - 1
				: this.current_index - 1
			],
			this.draw_x - this.button_x,
			0
		);
		if (this.current_index === this.items.length - 1) this.g.fill(42);
		else if (this.inside_right()) this.g.fill(200, 0, 69);
		else this.g.fill(125);
		this.g.push();
		this.g.translate(this.button_x - this.button_w / 2, 0);
		this.g.rotate(PI / 2);
		Triangle(this.g, this.button_h);
		this.g.pop();

		if (this.current_index === 0) this.g.fill(42);
		else if (this.inside_left()) this.g.fill(200, 0, 69);
		else this.g.fill(125);
		// rect(-this.button_x, -this.button_h, this.button_w, this.button_h * 2);
		this.g.push();
		this.g.translate(-this.button_x + this.button_w / 2, 0);
		this.g.rotate(-PI / 2);
		Triangle(this.g, this.button_h);
		this.g.pop();

		this.g.pop();
	}

	work() {
		this.draw_x = lerp(this.draw_x, 0, 0.1);
		this.display();
	}
	setm(args) {
		this.mx = args[0];
		this.my = args[1];
	}
}