let djid = "";

function youtube_player_send() {
    if (keyCode === 13 && youtube_player.textbox.value() !== "") {
        socket.emit("sendVideo", youtube_player.textbox.value());
        youtube_player_playlink(youtube_player.textbox.value());
        youtube_player.textbox.value("");
        youtube_player.who_played = player.name;
        djid = player.id;
    }
}
function youtube_player_playlink(i) {
    if (i.indexOf("v=") > -1)
        i = i.substring(i.indexOf("v=") + 2, i.indexOf("v=") + 13);
    if (i.indexOf("https://youtu.be/") > -1)
        i = i.substring(i.indexOf("https://youtu.be/") + 17, i.indexOf("https://youtu.be/") + 28);
    youtube_player.new_video = true;
    youtube_player.id = i;
    youtube_player_api.loadVideoById(i);
}
// window.onload = ()=> {
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let youtube_player, youtube_player_api;
function onYouTubeIframeAPIReady() {
    console.log("Setting up api");
    youtube_player_api = new YT.Player('youtube_api_iframe', {
        height: '0',
        width: '0',
        videoId: "3G4cwFIh_Ns",
        // playerVars: {
        //   	'playsinline': 1
        // },
        events: {
            'onReady': youtube_player_api_ready,
            'onStateChange': youtube_player_api_change
        }
    });
}
function youtube_player_api_ready(event) {
    console.log("api readu");
    // event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// let done = false;
function youtube_player_api_change(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    // 	setTimeout(stopVideo, 6000);
    // 	done = true;
    // }
}

// let tag;
// tag = document.createElement("script");
// tag.src = "https://www.youtube.com/iframe_api";
// document.body.appendChild(tag);

// tag = document.createElement("div");
// tag.id = "youtube_player_api";
// tag.style.display = "none"; // hidden = true ;
// document.body.appendChild(tag);

// youtube_player = new Thatbox(
// hud_pointer,
// "youtube_player_api",
// 16 * 30,
// 9 * 30,
// "Youtube",
// 50,
// hud_pointer.height - 50,
// -2.3
// );

// }
class Thatbox {
    constructor(g, p, w, h, s, x, y, theta) {
        this.g = g;
        this.s = s;
        this.w = w;
        this.hmax = this.h = h;
        this.hh = 42;
        this.default_colors();

        this.hgraphics = createGraphics(w, this.hh);
        this.hoffsetnew = false;
        this.textsizetop = this.hh * 0.8;
        this.textsizetopwidth = this.hoffset = 0;
        this.hgraphics.textAlign(LEFT, BOTTOM);
        this.hgraphics.textSize(this.textsizetop);
        this.newline = -400;
        this.theta = radians(theta);
        this.bx = this.w - (this.hh * 3) / 3.5;
        this.by = -this.hh / 2;
        this.br = this.hh / 2;
        this.bcolor = color(0, 0);
        this.bd = this.br * 2;
        this.new_video = true;
        this.who_played = "";

        this.p = new p5.Element(document.getElementById(p));
        this.p.style("transform-origin", "0% 0%");
        youtube_player_api.setSize(w, h);
        this.p.show();
        this.id = "";
        this.on = true;
        this.melta = this.on ? 1 : 0;
        this.textbox = createInput();
        this.textbox_height = 24;
        this.textbox_tempval = "defaulted";
        this.textbox_hover = false;
        this.textbox.style("background-color", color(20, 20, 25));
        this.textbox.style("color", color(255));
        this.textbox.style("border", "none");
        this.textbox.style("outline", "none");
        this.textbox.style("transform-origin", "0% 0%");
        this.textbox.attribute("onkeypress", "youtube_player_send();");
        this.textbox.attribute("placeholder", "🔍type or drop a youtube link here!");
        this.textbox.style("border-radius", "10px");
        this.textbox.style("padding", "0px");
        this.textbox.style("text-align", "center");
        this.textbox.size((w * 4) / 5, 24);
        this.mx = this.my = 0;
        this.particles = [];
        this.dt = 0;
        this.position(x, y);
    }
    default_colors() {
        this.hcolor = color(20,20,25);
        this.scolor = color(220);
        // this.bcolor1 = color(171, 29, 81);
        this.bcolor1 = color(163, 5, 68);
        this.bcolor2 = color(35,35,40);
        this.newlinecolor = color(255, 0, 100);
        this.playedbycolor = color(25, 20, 20);
    }
    add_particle() {
        this.particles.push(
            new ytParticle(
                this.g,
                random(this.w / 10, (this.w * 9) / 10),
                -this.hh / 2,
                random(this.hh / 4, this.hh / 2)
            )
        );
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
        this.work_between();
    } //translatepoint button pints good job boi
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
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].work(-this.h);
            if (this.particles[i].a <= 0) this.particles.splice(i, 1);
        }
        if (this.work_more) this.work_more();
        this.g.noStroke();
        this.g.fill(25);
        this.g.rect(0, -this.h, this.w, this.h);

        this.hgraphics.background(this.hcolor);

        if (this.hoffsetnew) {
            if (abs(this.hoffset - 1) > 0.1) this.hoffset = lerp(this.hoffset, 1, 0.1);
            else this.hoffsetnew = false;
        }
        else if (this.textsizetopwidth > this.w * 0.9) {
            if (this.hoffset > 1 && this.hoffset < 40) this.hoffset -= this.hoffset / 40;
            else if (this.hoffset > 0 && this.hoffset <= 1) this.hoffset -= 0.006;
            else this.hoffset--;
        }
        if (this.hoffset < -this.textsizetopwidth) this.hoffset = this.w;
        if (this.newline < this.w) {
            this.newline += 5;
            if (this.newline < this.w / 3)
                this.playedbycolor = lerpColor(
                    this.playedbycolor,
                    this.newlinecolor,
                    0.1
                );
            else
                this.playedbycolor = lerpColor(this.playedbycolor, color(200), 0.04);
            this.hgraphics.stroke(this.newlinecolor);
            this.hgraphics.strokeWeight(5);
            this.hgraphics.line(this.newline, 0, this.newline - 10, this.hh);
            this.hgraphics.line(this.newline - 20, 0, this.newline - 30, this.hh);
            this.hgraphics.line(this.newline - 10, 0, this.newline - 20, this.hh);
        }
        this.hgraphics.noStroke();
        this.hgraphics.fill(this.scolor);
        this.hgraphics.text(this.s, this.hoffset, this.hh);

        this.hgraphics.noStroke();
        for (let i = 0; i < this.hgraphics.width; i += 4) {
            this.hgraphics.fill(
                this.hcolor.levels[0],
                this.hcolor.levels[1],
                this.hcolor.levels[2],
                i / 4
            );
            // rect(x + i * s, y, - i * s,y+ h);
            this.hgraphics.rect(this.w / 2 + i, 0, this.hgraphics.width - i, this.hh);
        }
        this.g.image(this.hgraphics, 0, -this.h - this.hh);
        //this.g.fill(this.hcolor);
        //this.g.rect(0, -this.h - this.hh, this.w, this.hh);
        //this.g.fill(190,192,236);
        //this.g.textAlign(LEFT, BOTTOM);
        //this.g.textSize(this.textsizetop);
        //this.g.text(this.s, 5, -this.h);
        this.g.textSize(18);
        this.g.fill(this.playedbycolor);
        this.g.textAlign(RIGHT, TOP);
        this.g.text("Played By:", this.w, 0);
        this.g.textAlign(LEFT, TOP);
        this.g.text(this.who_played, this.w, 0);
        this.g.translate(this.bx, this.by);
        this.bcolor = lerpColor(
            this.bcolor,
            this.inside_button() ? this.bcolor1 : this.bcolor2,
            0.2
        );
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
        this.p.position(
            this.x + this.h * sin(this.theta),
            this.y - this.h * cos(this.theta)
        );
        this.p.style(
            "transform",
            "rotate(" + this.theta + "rad)" + " scaleY(" + this.melta + ")"
        );

        this.textbox.position(
            this.x +
            this.w / 2 -
            this.textbox.width / 2 +
            (this.h + this.hh + this.textbox.height + 10) * sin(this.theta),
            this.y - (this.h + this.hh + this.textbox.height + 10) * cos(this.theta)
        );
        this.textbox.style("transform", "rotate(" + this.theta + "rad)"); //+ " scaleY(" + i + ")" );
    }

    work_between() {
        this.work_dom();
        this.by = -this.h - this.hh / 2;
    }
    work() {
        this.h = this.on ? lerp(this.h, this.hmax, 0.06) : lerp(this.h, 0, 0.08);
        this.findmx();
        this.melta = this.h / this.hmax;
        if (this.melta > 0.0001 && this.melta < 0.9999) this.work_between();
        this.display();
        if (youtube_player_api.getPlayerState) {
            this.t = youtube_player_api.getCurrentTime();
            if (youtube_player_api.getPlayerState() === 1) {
                if (djid === player.id) socket.emit("djtime", this.t);
                this.add_particle();
                if (this.new_video) {
                    this.new_video = false;
                    this.s = youtube_player_api.getVideoData().title;
                    // this.dt = 0;
                    // youtube_player_api.seekTo(this.dt);// youtube_player_api.playVideo();
                    this.work_more = null;
                    //easter eggs and header graphics
                    this.hoffsetnew = true;
                    this.newline = -100;
                    this.hgraphics.textSize(this.textsizetop);
                    this.textsizetopwidth = this.hgraphics.textWidth(this.s);
                    /// easter eggs! 
                    easter_egg_general = () => { };
                    let temp = Object.keys(easter_egg_list_creator);
                    let temp_creator = youtube_player_api.getVideoData().author;
                    for (let i = temp.length; i >= 0; i--) {
                        if (temp_creator.toLowerCase().indexOf(temp[i]) !== -1) {
                            easter_egg_general = easter_egg_list_creator[temp[i]];
                            break;
                        }
                    }
                    temp = Object.keys(easter_egg_list_string);
                    for (let i = temp.length; i >= 0; i--) {
                        if (this.s.toLowerCase().indexOf(temp[i]) !== -1) {
                            easter_egg_general = easter_egg_list_string[temp[i]];
                            break;
                        }
                    }
                    if (easter_egg_list_id[this.id]) easter_egg_general = easter_egg_list_id[this.id];
                    this.default_colors();
                    easter_egg_refresh();
                }
            }
        }
        if (this.textbox_hover) {
            if (this.textbox_tempval !== this.textbox.value()) {
                this.textbox_hover = false;
                this.textbox.elt.focus();
            }
            // background(150, 50, 50);
            this.textbox_height = lerp(this.textbox_height, this.hmax / 2, 0.1);
            this.textbox.size((this.w * 4) / 5, this.textbox_height);
            this.work_dom();
        } else if (this.textbox_height > 24.1) {
            // background(50, 50, 150);
            this.textbox_height = lerp(this.textbox_height, 24, 0.1);
            this.textbox.size((this.w * 4) / 5, this.textbox_height);
            this.work_dom();
        }
    }
    clicked() {
        if (this.inside_button()) {
            this.on = !this.on;
        }
    }
}
class ytParticle {
    constructor(g, x, y, s) {
        this.g = g;
        this.x = x;
        this.y = y;
        this.s = s;
        this.dx = random(-2, 2);
        this.dy = random(-4, -2);
        this.da = -random(3, 8);
        this.cr = random(100, 255);
        this.cg = random(20);
        this.cb = random(110, 255);
        this.a = 255;
        this.c = color(this.cr, this.cg, this.cb, this.a);
    }
}
ytParticle.prototype.display = function (y = 0) {
    this.g.noStroke();
    this.g.fill(this.c);
    this.g.circle(this.x, y + this.y, this.s);
};
ytParticle.prototype.work = function (y = 0) {
    this.display(y);
    this.x += this.dx;
    this.y += this.dy;
    this.a += this.da;
    this.c = color(this.cr, this.cg, this.cb, this.a);
};
