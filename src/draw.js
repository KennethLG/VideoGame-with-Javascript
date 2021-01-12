const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// draw scene

class Player {
	constructor(x, y, xscale, yscale, ctx) {
		this.x = x;
		this.y = y;
		this.xscale = xscale;
		this.yscale = yscale;
		this.img = GIF();
		this.imgsrc= "./sprites/playerIdle.gif";
		this.vel = 5;
		this.keys = {
			"a" : false,
			"d" : false,
			"w" : false,
			"s" : false
		}
	}

	draw() {
		ctx.drawImage(this.img, this.x, this.y, this.xscale, this.yscale);
		this.img.load(this.imgsrc);
	}

	control() {
		if (this.keys["a"]) this.x -= this.vel;
		if (this.keys["d"]) this.x += this.vel;
		if (this.keys["w"]) this.y -= this.vel;
		if (this.keys["s"]) this.y += this.vel;

		if (!this.keys["a"]&&!this.keys["s"]&&!this.keys["d"]&&!this.keys["w"]&&this.imgsrc!=="./sprites/playerRun.gif") this.imgsrc = "./sprites/playerRun.gif";
		else if (this.imgsrc!=="./sprites/playerIdle.gif")this.imgsrc = "./sprites/playerIdle.gif";
	}
}

var player = new Player(0, 100, 96, 112, ctx);

function draw () {
	//requestAnimationFrame(draw);
	ctx.globalCompositeOperation = 'destination-over';
  	ctx.clearRect(0, 0, innerWidth, innerHeight);
	//ctx.drawImage(player.img, player.x, player.y, player.xscale, player.yscale);
	player.draw();
	player.control();
}

window.addEventListener("keydown", (e) => {
	player.keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
	player.keys[e.key] = false;
});

setInterval(()=> {
	draw();
}, 60);