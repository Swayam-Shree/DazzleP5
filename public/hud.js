let planeDisplayCount = 0;
let playButtonClicked = false;
let color_picker;
let chatbox;

let hud_pointer;
let login_pointer;
let disconnect_pointer;

function makeHud(){
	let s = function(sketch){
		sketch.setup = function(){
			sketch.canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
			sketch.canvas.position(0, 0);
			sketch.canvas.style("z-index", "0");
			// sketch.textFont(noobFont);
			sketch.playerHealthbar = new sketch.Bar(player.maxHealth, 20, 50, sketch.radians(-4), player.name);
			sketch.pages = [] ;
			sketch.score_board = new Page(sketch, "Scoreboard");
			sketch.score_board.work_graphics = function () {
				this.graphics.clear();
				this.graphics.textAlign(this.graphics.LEFT, this.graphics.BASELINE);
				this.graphics.fill(255,0,69) ; 
				this.graphics.textSize(100) ; 
				this.graphics.text(player.kills, 0 , 100);
				let w = this.graphics.textWidth(player.kills) ; 
				this.graphics.textSize(40) ; 
				this.graphics.text("/ " + player.deaths, w , 90) ;
				this.graphics.push() ;
				this.graphics.translate(this.w-80,80);
				let h = hour();
				if(h>7&&h<19){
				this.graphics.circle( 0 , 0 , 69) ;
				for( let i = 0 ; i < 7 ; ++i) {
					this.graphics.push() ;
					this.graphics.rotate(frameCount/100 + i*TWO_PI/7) ;
					this.graphics.translate(60,0) ;  
					Triangle(this.graphics,10) ; 
					this.graphics.pop() ;
				} } else {
					this.graphics.rotate(-frameCount/300) ;
					this.graphics.fill(140,140,154) ; 
					Star(this.graphics,0, 0, 25, 60, 5);
				}
				this.graphics.pop() ;
				this.graphics.fill(255); 
				this.graphics.textAlign(this.graphics.RIGHT, this.graphics.TOP);
				this.graphics.textSize(20) ; 
				this.graphics.text(int(frameRate()) + '|' + averageFramerate, this.w , 0);
				this.graphics.textSize(14) ; 
				this.graphics.textAlign(this.graphics.RIGHT, this.graphics.BOTTOM);
				// this.graphics.text((1+h%13) + ":" + minute() + (h>11?" pm":" am") , this.w , 165);
				this.graphics.text(h === 0 ? 12 : h % 12 + ":" + minute() + (h > 11 ? " pm" : " am") , this.w , 165);
				this.graphics.textSize(10) ; 
				this.graphics.text("Server: North America" , this.w, this.h);
				
				this.graphics.textAlign(this.graphics.LEFT, this.graphics.BASELINE);
				this.graphics.textSize(20) ; 
				this.graphics.text( "Players :" , 10 , 170 ) ;
				this.graphics.text( "K" , 250 , 170 ) ;
				this.graphics.text( "D" , 300 , 170 ) ;
				this.graphics.stroke(255) ; 
				this.graphics.line( 10 , 175 , 320 , 175 ) ; 
				this.graphics.line( this.w , 165 , this.w - 70 , 165 ) ; 
				this.graphics.line( this.w , 169 , this.w - 50 , 169 ) ; 
				this.graphics.noStroke() ; 
				let e = [player,...enemies] ; 
				e.sort((a,b)=>(a.kills > b.kills)) ;
				for(let i = 0 ; i < e.length ; ++i) { 
					this.graphics.fill( e[i].col ) ; 
					this.graphics.text( e[i].name  , 10 , 220 + i*30) ; 
					this.graphics.text( e[i].kills , 250 , 220 + i*30) ; 
					this.graphics.text( e[i].deaths , 300 , 220 + i*30) ; 
				} 
			}
			// sketch.score_board.setsize(width/2 , height - 400); 
			sketch.score_board.scrollbar.work = ()=>{} ; 
			sketch.score_board.w = sketch.width/2.5 ; 
			sketch.score_board.graphics.resizeCanvas(sketch.score_board.w ,sketch.score_board.h) ;
			
			sketch.score_board.x = sketch.width/2 - sketch.score_board.w/2 ; 
			sketch.score_board.y = 100;  
			// sketch.stheta = 0; 
			page_setup(sketch) ;
			chatbox = new Chatbox(sketch, room, sketch.width - 510, sketch.height);
			youtube_player = new Thatbox(sketch, "youtube_api_iframe", 16 * 32, 9 * 32, "Youtube Player", 20, sketch.height - 10, -2.3);
			youtube_player.p.style("z-index","1");
			sketch.ui_buttons = [] ;
			sketch.ui_buttons.push(new Button(sketch, "Options", 30, () => { for( let i = 0 ; i < sketch.pages.length ; i++ ) sketch.pages[i].on = false ; sketch.pages[0].on = true ; }, false, sketch.width , 0, -6));
			sketch.ui_buttons.push(new Button(sketch, "Credits", 40, () => { for( let i = 0 ; i < sketch.pages.length ; i++ ) sketch.pages[i].on = false ; sketch.pages[2].on = true ; }, false, sketch.width , 0, -6));
			color_picker = new ColorPicker(sketch) ; 
			sketch.windowResized();
			sketch.textAlign(sketch.CENTER, sketch.CENTER);
		}
		sketch.windowResized = function(){
			color_picker.position( 20 , 70 , -4) ; 
			sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
			youtube_player.position(20, sketch.height - 10) ;
			youtube_player.work_between() ;
			chatbox.position(sketch.width - 510, sketch.height);
			chatbox.work_between();
			for (let i = 0; i < sketch.pages.length; i++) sketch.pages[i].setsize();
			sketch.ui_buttons[0].position( sketch.width - 320 , 0 ) ;
			sketch.ui_buttons[1].position( sketch.width - 180 , 0 ) ;
			sketch.score_board.w = sketch.width/2.5 ; 
			sketch.score_board.graphics.resizeCanvas(sketch.score_board.w ,sketch.score_board.h) ;
			
			sketch.score_board.x = sketch.width/2 - sketch.score_board.w/2 ; 
			sketch.score_board.y = 100;  

		}
		sketch.draw = function(){
			sketch.clear();
			display_killfeed() ;
			sketch.rectMode(sketch.CORNER) ; 
			sketch.fill(player.col);
			sketch.stroke(0);
			sketch.strokeWeight(1);
			sketch.circle(sketch.width/2, sketch.height/2, 6);
			sketch.noStroke();

			sketch.fill(255, 0 , 69);
			// sketch.textFont(legibleFont);
			// sketch.textSize(30);
			// sketch.textAlign(sketch.LEFT, sketch.CENTER);
			
			sketch.playerHealthbar.purevalue = player.health;
			sketch.playerHealthbar.work();
			
			
			// sketch.text('fCount : ' + frameCount, sketch.width - 300, 65);
			// sketch.text('planes : ' + planeDisplayCount, sketch.width, 95);
			// sketch.text(color_picker.size_slider.value, sketch.width, 125);
			// sketch.text('shatterDecals : ' + shatterDisplayCount, sketch.width - 300, 125);
			// sketch.text('envDecals : ' + envDecalDisplayCount, sketch.width - 300, 155);
			// sketch.text('roomName : ' + room, sketch.width, 185);
			// sketch.text(player.kills + ' | ' + player.deaths + ' ', sketch.width , 245);


			// if (displayHudHoverText){
			// 	sketch.textSize(hudHoverTextSize);
			// 	sketch.text(hudHoverText, hudHoverTextPos.x, hudHoverTextPos.y);
			// }
			
			for (let i = 0; i < sketch.pages.length; i++) if (sketch.pages[i].on) sketch.pages[i].work();
			if( sketch.score_board.on ) sketch.score_board.work() ; 
			// sketch.textFont(font);
			sketch.textFont('sans-serif') ;
			chatbox.work();
			color_picker.work() ; 
			
			youtube_player.work();
			easter_egg_general(this) ;
			for (let i = 0; i < sketch.ui_buttons.length; i++) {
				sketch.ui_buttons[i].setm( translatePoint(
					mouseX,
					mouseY,
					sketch.ui_buttons[i].x,
					sketch.ui_buttons[i].y,
					sketch.ui_buttons[i].theta
				)) ;
				sketch.ui_buttons[i].work();
			}
		}
		sketch.mousePressed = function() {
			color_picker.clicked() ; 
			youtube_player.clicked() ; 
			for (let i = 0; i < sketch.pages.length; i++) if (sketch.pages[i].on) sketch.pages[i].clicked();
			for (let i = 0; i < sketch.ui_buttons.length; i++) sketch.ui_buttons[i].clicked();
		}
		sketch.mouseWheel = function(event) {
			for (let i = 0; i < sketch.pages.length; i++) if (sketch.pages[i].on) sketch.pages[i].wheel(event.delta);
		}
		sketch.Bar = class Bar {
			constructor(maxvalue, x, y, theta = 0, s = ''){
				this.x = x;
				this.y = y;
				this.theta = theta;
				this.s = s;
				this.purevalue = this.value = this.maxvalue = maxvalue;
			}
		}
		sketch.Bar.prototype.display = function(){
			sketch.push();
				sketch.strokeWeight(1);
				sketch.translate(this.x, this.y);

				sketch.rotate(this.theta);

				let a = sketch.map(this.value, 0, this.maxvalue, 0, 255);
				sketch.noStroke();
				sketch.fill(255 - a, 0, a);
				sketch.rect(0, 0, this.value, 10);
				sketch.stroke(0);
				sketch.noFill();
				sketch.rect(0, 0, this.maxvalue, 10);

				sketch.noStroke();
				// sketch.textSize(40);
				// sketch.textAlign(sketch.LEFT, sketch.TOP);
				// sketch.fill(255 - a, 0, a, 200);
				//let ss = sketch.str(sketch.int(this.value)) // .replace(/0/gi, 'O');
				//sketch.text(ss, 0, 10);

				sketch.fill(255, 0, 69);
				sketch.textAlign(LEFT, BASELINE);
				sketch.textSize(60);
				sketch.text(this.s, 0, 0);
			sketch.pop();
		}
		sketch.Bar.prototype.work = function(){
			this.value = sketch.lerp(this.value, this.purevalue, 0.14);
			this.display();
		}
	}
	hud_pointer = new p5(s);
}

function makeLogIn(){
  	let s = function (sketch) {
	    sketch.setup = function(){
	        this.canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
	        this.canvas.position(0, 0);
			this.canvas.style("z-index", "0");
          	sketch.play_button = new Button( sketch,
			    "Play",
			    40,
			    () => {
					if(!playButtonClicked) {
						playButtonClicked = true;
						login(sketch.textbox.value(), sketch.roombox.value());
					}
				},
			    false,
			    sketch.width / 2,
			    sketch.height / 2,
			    -5
  			);
            sketch.play_button.w = 130 ;
          	sketch.particles = [] ;
			sketch.allow_custom_room = false ;
			sketch.room_button = new Button( sketch,
				"Create/Join room",
				20,
				() => {
				  sketch.allow_custom_room = true ;
				  sketch.room_button.s = "If the room exists you will join it, otherwise it will be created" ; 
				  sketch.windowResized() ; 
				},
				false,
				0,
				sketch.height * 0.95,
				0
			);
			sketch.room_button.displaylikelink = true;
          	for (let i = 0; i < 270; i++)
    			sketch.particles.push(new sketch.Particle(sketch.random(sketch.width), sketch.random(sketch.height)));
  			sketch.textbox = sketch.createInput();
		  	sketch.textbox.attribute("maxlength", "16");
		  	sketch.textbox.style("transform-origin", "0% 0%");
		  	sketch.textbox.style("border", "none");
		  	sketch.textbox.style("margin", "none");
		  	sketch.textbox.style("outline", "none");
		  	sketch.textbox.style("padding", "none");
		  	sketch.textbox.style("color", sketch.color(255, 0, 255));
		  	sketch.textbox.style("background-color", sketch.color(30));
		  	sketch.textbox.style("font-size", "36px");
		  	sketch.textbox.style("transform", "rotate(-2.5deg)");
		  	sketch.textbox.style("opacity", "0.4") ;
			sketch.textbox.xx = sketch.width / 2 - sketch.width / 6;
  			sketch.textbox.yy = sketch.height / 2 - 75;
			sketch.textbox.w = 0 ; 

			sketch.textbox.position(sketch.textbox.xx, sketch.textbox.yy);

			sketch.roombox = sketch.createInput();
			sketch.roombox.hide() ; 
			sketch.roombox.attribute("maxlength", "16");
			sketch.roombox.style("transform-origin", "0% 0%");
			sketch.roombox.style("border", "none");
			sketch.roombox.style("margin", "none");
			sketch.roombox.style("outline", "none");
			sketch.roombox.style("padding", "none");
			sketch.roombox.style("color", color(255, 0, 255));
			sketch.roombox.style("background-color", color(30));
			sketch.roombox.style("font-size", "36px");
			sketch.roombox.size(sketch.width / 5, 60);
			sketch.roombox.style("transform", "rotate(-2.5deg)");
			sketch.roombox.style("opacity", "0.4");
			sketch.roombox.xx = sketch.width*0.25;
			sketch.roombox.yy = sketch.height *2 ;
			sketch.roombox.w = 0 ; 
			sketch.roombox.position(sketch.roombox.xx, sketch.roombox.yy);

            sketch.online_counter = "";
            sketch.roomList = {};
            sketch.windowResized() ;
	    }
        sketch.windowResized = function(){
	        sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);	
	    }
  		sketch.draw = function(){
			if (disconnected){makeDisconnect(); sketch.remove(); return;}
            sketch.play_button.setm(translatePoint(mouseX,mouseY,sketch.play_button.x,sketch.play_button.y,sketch.play_button.theta));
            sketch.room_button.setm(translatePoint(mouseX,mouseY,sketch.room_button.x,sketch.room_button.y,sketch.room_button.theta));
        	sketch.background(10, 10, 14);
  			for (let i = 0; i < sketch.particles.length; i++){
    			sketch.particles[i].work();
    			if (sketch.particles[i].outside()) sketch.particles[i].setit();
			}
			sketch.noStroke();
			sketch.fill(255, 0 , 69);
			sketch.textSize(40);
			sketch.textAlign(sketch.CENTER , sketch.BOTTOM);
			sketch.push();
		  	sketch.translate(sketch.textbox.xx , sketch.textbox.yy + 8);
		  	sketch.rotate(sketch.radians(-2));
		  	sketch.text( "Player Name:" , 0 , 0 );
		  	sketch.pop();
			sketch.push();
			sketch.translate(sketch.roombox.xx, sketch.roombox.yy + 8 );
			sketch.rotate(radians(-2));
			sketch.text("Room:", 0, 0);
			sketch.pop();
		  	sketch.textSize(20);
		  	sketch.fill(255,0,69);
		  	sketch.textAlign(sketch.RIGHT, sketch.TOP);
		  	sketch.text("Online:" + sketch.online_counter, sketch.width,0 );
			sketch.textAlign(sketch.LEFT, sketch.TOP);
			// if(sketch.rooms.length) sketch.text("Rooms (" + sketch.rooms.length + ")", 0, 0);
			let len = Object.keys(sketch.roomList).length;
			if(len) sketch.text("Rooms (" + len + ")", 0, 0);
			else sketch.text("Rooms - ", 0, 0);
			sketch.textSize(12);
			// for (let i = 0; i < sketch.rooms.length; i++) {
			// 	sketch.text(
			// 		sketch.rooms[i] + " - " , // PUT IN THE ROOM'S USER COUNT IN HERE TOO
 			// 		0,
			// 		30 + (sketch.textAscent() + 5) * i
			// 	);
			// }
			let n = 0;
			for (let roomName in sketch.roomList){
				sketch.text(roomName + " - " + sketch.roomList[roomName], 0, 30 + (sketch.textAscent() + 5) * n);
				++n;
			}
		  	sketch.play_button.work();
		  	sketch.room_button.work();
			if (sketch.allow_custom_room) {
				sketch.textbox.xx = lerp(sketch.textbox.xx, sketch.width*0.25 , 0.1);
				sketch.textbox.yy = lerp(sketch.textbox.yy, sketch.height*0.38, 0.1);
				sketch.roombox.xx = lerp(sketch.roombox.xx, sketch.width*0.25 , 0.1);
				sketch.roombox.yy = lerp(sketch.roombox.yy, sketch.height*0.48, 0.1);
				sketch.play_button.x = lerp(sketch.play_button.x, sketch.width*2/3, 0.1);
				sketch.play_button.y = lerp(sketch.play_button.y, sketch.height *0.55 , 0.1);
				sketch.room_button.x = lerp(sketch.room_button.x, sketch.width/2 - sketch.room_button.w/2 , 0.1);
				sketch.room_button.y = lerp(sketch.room_button.y, sketch.height * 0.95, 0.1);
				sketch.room_button.w = lerp(sketch.room_button.w , sketch.width/3 , 0.01) ; 
				} else {
				sketch.play_button.x = lerp(sketch.play_button.x, sketch.width / 2, 0.1);
				sketch.play_button.y = lerp(sketch.play_button.y, sketch.height / 2, 0.1);
				sketch.room_button.x = lerp(sketch.room_button.x, 0 , 0.1);
				sketch.room_button.y = lerp(sketch.room_button.y, sketch.height * 0.95, 0.1);
				sketch.textbox.xx = lerp(sketch.textbox.xx, sketch.width / 2 - sketch.width / 6, 0.1);
				sketch.textbox.yy = lerp(sketch.textbox.yy, sketch.height / 2 - 75, 0.1);	
			}
			sketch.textbox.position(sketch.textbox.xx, sketch.textbox.yy);
			sketch.roombox.position(sketch.roombox.xx, sketch.roombox.yy);
			if( sketch.roombox.yy < sketch.height*0.9 ) sketch.roombox.show() ;
			let x = sketch.allow_custom_room? sketch.width/3 : sketch.width/5 ; 
			sketch.textbox.w = lerp(sketch.textbox.w, x, 0.1 ) ; 
			sketch.roombox.w = lerp(sketch.roombox.w, x*0.8, 0.1) ; 

			sketch.textbox.size(sketch.textbox.w, 60);
			sketch.roombox.size(sketch.roombox.w, 60);
		}
		sketch.mousePressed = function(){
			sketch.play_button.clicked() ;
			sketch.room_button.clicked();
		}
		sketch.keyPressed = function(){
			if (keyCode === 13 && sketch.textbox.value() !== "" && !playButtonClicked) {
				login(sketch.textbox.value(), sketch.roombox.value());
				playButtonClicked = true;
			}
		}
	    sketch.Particle = class {
	        constructor(x = 0,y=0) {
	          	this.setit();
              	this.x = x ;
              	this.y = y ;
	        }
	    }
	    sketch.Particle.prototype.setit = function(){
	        this.s = sketch.random(7.5);
	        this.x = sketch.random(sketch.width);
	        this.y = sketch.height + this.s / 2;
	        this.dx = sketch.random(-2, 2);
	        this.dy = sketch.random(-4, -2);
	        this.r = sketch.random(100, 255);
	        this.g = 0;
	        this.b = sketch.random(110, 255);
	        this.a = sketch.random(255);
	        this.da = 0; //-random(3, 8);
	        this.c = sketch.color(this.r, this.g, this.b, this.a);
	    }
	    sketch.Particle.prototype.display = function(){
	        sketch.noStroke();
	        sketch.fill(this.c);
	        sketch.circle(this.x, this.y, this.s);
	    }
	    sketch.Particle.prototype.work = function(){
	        this.display();
	      	this.x += this.dx;
	        this.y += this.dy;
	        this.a += this.da;
	        this.c = sketch.color(this.r, this.g, this.b, this.a);
	    }
	    sketch.Particle.prototype.outside = function(){
	        return (this.x > sketch.width + this.s || this.x < -this.s || this.y > sketch.height + this.s || this.y < this.s);
	    }
  	}
	login_pointer = new p5(s);
}

function makeDisconnect(reason = "Error Value : 404 ( Server Disconnect ) ") {
	let s = function (sketch){
	  	sketch.setup = function(){
			let canvasDC = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
			canvasDC.position(0, 0);
			sketch.particlesDC = [];
			for (let i = 0; i < sketch.width /4 ; i++) {
			  	sketch.particlesDC.push(new sketch.Particle());
			}
			sketch.reason = reason ; 
	  	};
	  	sketch.draw = function(){
			sketch.background(10,10,14);
			for (let i = 0; i < sketch.particlesDC.length; i++) {
			  	sketch.particlesDC[i].work();
			  	if (sketch.particlesDC[i].outside()){
				  	sketch.particlesDC[i].setit();
			  	}
			}
			sketch.textAlign(sketch.CENTER, sketch.CENTER);
			sketch.noStroke();
			sketch.fill(227, 0, 69);
			sketch.textSize(60);
			sketch.text("< Disconnected >", sketch.width / 2, sketch.height / 2);
			sketch.fill(255, 0, 120);
			sketch.textSize(30);
			sketch.text("Reload Site!", sketch.width / 2, sketch.height / 2 + 150);
			sketch.textSize(15);
			sketch.text(sketch.reason, sketch.width / 2, sketch.height / 2 + 195);
	  	};
	  	sketch.mousePressed = function(){
		 	window.location.reload();
	  	}
	  	sketch.windowResized = function(){
			sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
	  	};

	  	sketch.Particle = class {
			constructor(){
			  this.setit();
			}
	  	};
	  	sketch.Particle.prototype.setit = function(){
			this.s = sketch.random(7.5);
			this.x = sketch.random(sketch.width);
			this.y = sketch.height + this.s / 2;
			this.dx = sketch.random(-2, 2);
			this.dy = sketch.random(-4, -2);
			this.r = sketch.random(100, 255);
			this.g = 0;
			this.b = sketch.random(110, 255);
			this.a = sketch.random(255);
			this.da = 0; //-random(3, 8);
			this.c = sketch.color(this.r, this.g, this.b, this.a);
	  	};
	  	sketch.Particle.prototype.display = function(){
			sketch.noStroke();
			sketch.fill(this.c);
			sketch.circle(this.x, this.y, this.s);
	  	};
	  	sketch.Particle.prototype.work = function(){
			this.display();
		 	this.x += this.dx;
			this.y += this.dy;
			this.a += this.da;
			this.c = sketch.color(this.r, this.g, this.b, this.a);
	  	};
	  	sketch.Particle.prototype.outside = function(){
			return (this.x > sketch.width + this.s || this.x < -this.s || this.y > sketch.height + this.s || this.y < this.s);
	  	};
	};
	disconnect_pointer = new p5(s);
}