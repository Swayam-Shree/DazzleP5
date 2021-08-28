//TEMPLATE####
function easter_eoogg(g) {
    //... youtube_player_api.getCurrentTime()
    //... every frame
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            //... every frame but matrixed to youtube_player
            //... dont forget this.s , like this.add_particle();
            for (let i = 0; i < youtube_player.particles.length; i++)
                if (!youtube_player.particles[i].workedon) {
                    youtube_player.particles[i].workedon = true;
                    //... once for every particle, to modify particle
                }
            if (easter_egg_var_flamed) {
                //... use loaded object
            } else {
                //... once unless nulled
                //... preload objects
            }
        };
}

function easter_egg_general(g) {
    //Pointer(?) to all eastereoggs
}

let easter_egg_var_image, easter_egg_var_image2,
    easter_egg_var_dmcv = 0;
function easter_egg_refresh() {
    easter_egg_var_image = null;
    easter_egg_var_image2 = null;
}

let easter_egg_list_creator = {
    "ssethtzeentach": easter_egg_heyheypeople,
    "glass animals": easter_egg_chairkun,
    "pewdiepie": easter_egg_pewds,
    "miek kobe": easter_egg_godhandgod,
}
let easter_egg_list_string = {
    "skyrim": easter_egg_skyrim,
    "sovngarde": easter_egg_real_skyrim,
    "touhou": easter_egg_marisa,
    "god hand": easter_egg_godhand,
}

let easter_egg_list_id = {
    "-WpnPSChVRQ": easter_egg_dmcv,
    Jrg9KxGNeJY: easter_egg_dmcv,
    W26PZOktM3s: easter_egg_dmcvnoro,
    PL8vLtyeU7Y: easter_egg_dmc4,
    ntG_EEfpasM: easter_egg_flamed,
    mW5Qw5BCwNg: easter_egg_chairkun, // DROGORA!
    AElDJCkN0Wo: easter_egg_aigis,
    oAXACgxeUvo: easter_egg_kickstartmaheart,
    zPAalhYYeFc: easter_egg_red_orange_yellow,
};

function easter_egg_red_orange_yellow(g) {
    youtube_player.hcolor = color(150, 30, 30);
    youtube_player.bcolor2 = color(200, 100, 30);
    youtube_player.bcolor1 = color(200, 200, 30);
    youtube_player.textbox.style("background-color", color(200, 100, 30));
    for (let i = 0; i < youtube_player.particles.length; i++)
        if (!youtube_player.particles[i].workedon) {
            youtube_player.particles[i].workedon = true;
            youtube_player.particles[i].a = random(100, 255);
            // youtube_player.particles[i].dx /= 1.5;
            youtube_player.particles[i].da = -random(1, 4);
            youtube_player.particles[i].s -= random();
            youtube_player.particles[i].cr = random(200, 255);
            youtube_player.particles[i].cg = random(200, 255);
            youtube_player.particles[i].cb = random(10);
        }
}
function easter_egg_heyheypeople(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 300 - noise(frameCount / 100) * 150, -this.h - 255, 778 / 4, 769 / 4);
            else easter_egg_var_image = loadImage("assets/sseth_here.png");
            if (random() < 0.1) this.g.text('hey hey', random(this.w), -this.h - random(this.hmax));
            if (random() < 0.1) this.g.text('people', random(this.w), -this.h - random(this.hmax));
        };
}
function easter_egg_marisa(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 200, -this.h - 345, 633 / 1.5, 451 / 1.5);
            else easter_egg_var_image = loadImage("assets/marisa.png");
        };
}
function easter_egg_godhandgod(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 223, -this.h - 465, 420, 414);
            else easter_egg_var_image = loadImage("assets/godhandmiekkobe.png");
        };
}
function easter_egg_pewds(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image2) {
                this.hcolor = color(200, 0, 64)
                this.scolor = this.bcolor2 = color(0)
                this.bcolor1 = color(64, 0, 200);
                this.textbox.style("background-color", color(0));

                this.g.image(easter_egg_var_image2, 0, -this.h - this.hh * 2, this.w, this.hh);
            }
            else easter_egg_var_image2 = loadImage("assets/pewdiepieback.png");
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 713 / 3, -this.h - 356, 713 / 1.5, 456 / 1.5);
            else easter_egg_var_image = loadImage("assets/mayaedgar.png");
        };
    for (let i = 0; i < youtube_player.particles.length; i++)
        if (!youtube_player.particles[i].workedon) {
            youtube_player.particles[i].workedon = true;
            youtube_player.particles[i].s -= random();
            youtube_player.particles[i].cr = 255
            youtube_player.particles[i].cg = 0;
            youtube_player.particles[i].cb = 69;
        }
}
function easter_egg_chairkun(g) {
    let sx = (180 + 5 * cos(frameCount / 30));
    let sy = (180 + 5 * sin(frameCount / 30));
    // youtube_player.position(); 

    youtube_player.p.style("transform", "skew(" + str(sx) + "deg, " + str(sy) + "deg)");
    youtube_player.textbox.style("transform", "skew(" + str(sx) + "deg, " + str(sy) + "deg)");
    if (!youtube_player.work_more) {
        youtube_player.work_more = function () {
            let sx = (180 + 5 * cos(frameCount / 30));
            let sy = (180 + 5 * sin(frameCount / 30));

            this.g.translate(0, -this.h);
            this.g.shearY(radians(sy));
            this.g.shearX(radians(sx));
            this.g.translate(0, this.h);
        }
    }
}
function easter_egg_aigis(g) {
    youtube_player.hcolor = color(cos(frameCount / 10) * 255 / 2 + 255 / 2, 0, cos(frameCount / 15) * 255 / 2 + 255 / 2, 20); /// FINSIH THIS ONE <3 
    if (youtube_player_api.getCurrentTime() > 7.4)
        youtube_player_api.seekTo(0);
}
function easter_egg_kickstartmaheart(g) {
    if (!youtube_player.work_more) {
        youtube_player.work_more = function () {
            if (youtube_player_api.getPlayerState() !== 1) return;
            let t = youtube_player_api.getCurrentTime();
            let oooo = [64, 69, 74, 79, 80, 125, 130, 131, 136, 141, 195, 200, 205, 206, 211, 227, 232, 237, 243,
            ];
            let yeaa = [65, 70, 75, 76, 81, 82, 126, 132, 137, 142, 196, 201, 207, 212, 228, 233, 238, 244,
            ];
            this.g.textSize(100);
            this.g.textAlign(CENTER, TOP);
            for (let i = 0; i < oooo.length; i++)
                if (int(t) === oooo[i]) {
                    this.g.fill(69, random(20), 255);
                    this.g.text("WHOAAA", this.w / 2, -this.h - 220);
                    this.g.fill(random(255), random(100), 255);
                    this.g.text(
                        "WHOAAA",
                        this.w / 2 + random(-10, 10),
                        -this.h - 220 + random(-10, 10)
                    );
                    this.g.fill(random(255), random(100), 255);
                    this.g.text(
                        "WHOAAA",
                        this.w / 2 + random(-10, 10),
                        -this.h - 220 + random(-10, 10)
                    );
                    return;
                }
            for (let i = 0; i < yeaa.length; i++)
                if (int(t) === yeaa[i]) {
                    this.g.fill(69, random(20), 255);
                    this.g.text("YEAAHHH", this.w / 2, -this.h - 220);
                    this.g.fill(255, random(100), random(255));
                    this.g.text(
                        "YEAAHHH",
                        this.w / 2 + random(-10, 10),
                        -this.h - 220 + random(-10, 10)
                    );
                    this.g.fill(255, random(100), random(255));
                    this.g.text(
                        "YEAAHHH",
                        this.w / 2 + random(-10, 10),
                        -this.h - 220 + random(-10, 10)
                    );
                    return;
                }
            this.g.textSize(50);
            t /= 10;
            this.g.text(
                "KICKSTART MY HEART",
                this.w / 2 + random(-t, t),
                -this.h - 220 + random(-t, t)
            );
            this.g.fill(209, 67, 64);
            this.g.text("KICKSTART MY HEART", this.w / 2, -this.h - 220);
            if (t > 25.4) {
                t *= 2;
                textSize(70);
                fill(random(255), 0, random(255));
                this.g.text(
                    "KICKSTART MY HEART",
                    this.w / 2 + random(-t, t),
                    -this.h - 220 + random(-t, t)
                );
            }
            if (t > 21) {
                textSize(65);
                fill(0, 0, random(255));
                this.g.text(
                    "KICKSTART MY HEART",
                    this.w / 2 + random(-t, t),
                    -this.h - 220 + random(-t, t)
                );
            }
        };
    }
}

function easter_egg_real_skyrim(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 153, -this.h - 465, 306, 414);
            else easter_egg_var_image = loadImage("assets/skyrimDragon.png");
        };
    for (let i = 0; i < youtube_player.particles.length; i++)
        if (!youtube_player.particles[i].workedon) {
            youtube_player.particles[i].workedon = true;
            youtube_player.particles[i].a = random(100, 255);
            // youtube_player.particles[i].dx /= 1.5;
            youtube_player.particles[i].da = -random(1, 4);
            youtube_player.particles[i].s -= random();
            youtube_player.particles[i].cr = 255
            youtube_player.particles[i].cg = 255;
            youtube_player.particles[i].cb = 255;
        }
}
function easter_egg_skyrim(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 153, -this.h - 465, 306, 414);
            else easter_egg_var_image = loadImage("assets/skyrimDragon.png");
        };
    for (let i = 0; i < youtube_player.particles.length; i++)
        if (!youtube_player.particles[i].workedon) {
            youtube_player.particles[i].workedon = true;
            // youtube_player.particles[i].a = 255;
            // youtube_player.particles[i].dx /= 1.5;
            // youtube_player.particles[i].da = -random(1, 3);
            // youtube_player.particles[i].s -= random();
            // youtube_player.particles[i].cr = random(100, 255);
            // youtube_player.particles[i].cg = random(69);
            // youtube_player.particles[i].cb = 0;
        }
}
function easter_egg_godhand(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, this.w / 2 - 104, -this.h - 305, 208, 219);
            else easter_egg_var_image = loadImage("assets/godhandlogo.png");
        };
    for (let i = 0; i < youtube_player.particles.length; i++)
        if (!youtube_player.particles[i].workedon) {
            youtube_player.particles[i].workedon = true;
            // youtube_player.particles[i].a = 255;
            youtube_player.particles[i].dx /= 2;
            youtube_player.particles[i].da = -random(2, 5);
            // youtube_player.particles[i].s -= random();
            youtube_player.particles[i].cr = 155 + random(40);
            youtube_player.particles[i].cg = 53 + random(20);
            youtube_player.particles[i].cb = 51 + random(20);
        }
}
function easter_egg_flamed(g) {
    if (!youtube_player.work_more)
        youtube_player.work_more = function () {
            if (easter_egg_var_image)
                this.g.image(easter_egg_var_image, -this.w / 10, -this.h - 450, this.w * 1.2, 400);
            else easter_egg_var_image = loadImage("assets/dragonforcelogo.png");

            this.add_particle();
            this.add_particle();
            this.add_particle();
        };
    for (let i = 0; i < youtube_player.particles.length; i++)
        if (!youtube_player.particles[i].workedon) {
            youtube_player.particles[i].workedon = true;
            youtube_player.particles[i].a = 255;
            youtube_player.particles[i].dx /= 1.5;
            youtube_player.particles[i].da = -random(1, 3);
            youtube_player.particles[i].s -= random();
            youtube_player.particles[i].cr = random(100, 255);
            youtube_player.particles[i].cg = random(69);
            youtube_player.particles[i].cb = 0;
        }
}

function easter_egg_dmcvnoro(g) {
    easter_egg_dmcv(g);
    if (
        youtube_player_api.getCurrentTime() > 48.4 &&
        youtube_player_api.getCurrentTime() < 48.85
    ) {
        easter_egg_var_dmcv = 2000;
        fill(41, 85, 255);
        textSize(250);
        textAlign(CENTER, CENTER);
        text("FUCK YOU", g.width / 2, g.height / 2);
    }
}
function easter_egg_dmcv(g) {
    easter_egg_dmc4(g);
    g.push();
    g.translate(
        5 * cos(random(easter_egg_var_dmcv / 1000)),
        5 * cos(random(easter_egg_var_dmcv / 800))
    );
    easter_egg_dmc4(g);
    g.pop();
}
function easter_egg_dmc4(g) {
    easter_egg_var_dmcv -= map(easter_egg_var_dmcv, 0, 1400, 0.2, 5);
    easter_egg_var_dmcv = constrain(easter_egg_var_dmcv, 0, 1599);
    let rank = ["D", "C", "B", "A", "S", "SS", "SSS", "SSSS|E|N|S|A|T|I|O|N|A|L"];
    g.push();
    g.translate((g.width * 4) / 5, g.height / 3);
    g.rotate(-0.1);
    g.noStroke();
    g.fill(
        map(easter_egg_var_dmcv % 200, 0, 200, 0, 255),
        0,
        map(easter_egg_var_dmcv % 200, 0, 200, 255, 69)
    );
    g.rect(-100, 0, easter_egg_var_dmcv % 200, 15);
    g.stroke(0);
    g.noFill();
    g.rect(-100, 0, 200, 15);
    g.textSize(70);
    g.textAlign(CENTER, BOTTOM);
    // fill(255,0,69);
    g.fill(
        map(easter_egg_var_dmcv, 0, 1400, 0, 255),
        0,
        map(easter_egg_var_dmcv, 0, 1400, 255, 69)
    );
    g.text(rank[int(easter_egg_var_dmcv / 200)], 0, 0);
    g.pop();
}
