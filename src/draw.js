const canvas = document.querySelector("canvas"); // definir el canvas y sus dimensiones

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; // evitar la interpolación linear

class Block { // objeto bloque
	constructor(x, y, ctx) {
		this.x = x;
		this.y = y;

		this.spriteWidth = 32;
		this.spriteHeight = 32;

		this.sprite = new Image();
		this.sprite.src = "./sprites/block.png";
	}

	draw() {
		ctx.drawImage(this.sprite, this.x, this.y, this.spriteWidth, this.spriteHeight);
	}

	init() {
		this.draw();
	}
}

class Player { // objeto jugador
	constructor(x, y, xscale, yscale, ctx) {
		this.x = x;
		this.y = y;

		this.xscale = xscale;
		this.yscale = yscale;

		this.sprite = new Image();
		this.sprite.src = "./sprites/playerIdleRight.png";

		this.spriteWidth = 96;
		this.spriteHeight = 24;

		this.spriteFrameCount = 4;
		this.spriteFrame = 0;

		this.spriteCols = 4;
		this.spriteRows = 1;

		this.srcX;
		this.srcY;

		this.width = (this.spriteWidth/this.spriteCols);
		this.height = (this.spriteHeight/this.spriteRows);

		this.facing = 1;

		this.keys = {
			"a" : false,
			"d" : false,
			"w" : false
		}

		this.vel = 10;
		this.vx = 0;
		this.vy = 0;

		this.colx = false;
		this.coly = false;
	}

	draw() {
		this.updateFrame();
		//dibujar el player
		ctx.drawImage(this.sprite, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width*this.xscale, this.height*this.yscale);

		//cambiar de sprite dependiendo de las velocidades y dirección de movimiento
		if (this.facing === 1) {
			if (this.vx === 0) {
				this.sprite.src = "./sprites/playerIdleRight.png";
			} else {
				this.sprite.src = "./sprites/playerRunRight.png";
			}
		} else if (this.facing === -1) {
			if (this.vx === 0) {
				this.sprite.src = "./sprites/playerIdleLeft.png";
			} else {
				this.sprite.src = "./sprites/playerRunLeft.png";
			}
		}
	}

	updateFrame() { // animar al personaje
		this.spriteFrame = ++this.spriteFrame % this.spriteCols;
		this.srcX = this.spriteFrame * this.width;
		this.srcY = 0;
	}

	control() { // controles, velocidad y gravedad
		if (this.keys["a"]) this.vx = this.approach(this.vx, -this.vel, 2); // izquierda
		if (this.keys["d"]) this.vx = this.approach(this.vx, this.vel, 2); // derecha
		if (this.keys["w"] && this.collision(this.x, this.y+1)) this.vy = -25; // saltar si solo se ecuentra en el suelo

		if (!this.keys["a"]&&!this.keys["d"]) this.vx = this.approach(this.vx, 0, 2); // ninguna tecla

		if (this.collision(this.x + this.vx, this.y)) { // colisión perfecta en X
			this.x = Math.floor(this.x);
			while(!this.collision(this.x + this.sign(this.vx), this.y)) this.x += this.sign(this.vx);
			this.vx = 0;
		} else this.x += this.vx;

		if (this.collision(this.x, this.y + this.vy)) { // colision perfecta en Y
			this.y = Math.floor(this.y);
			while(!this.collision(this.x, this.y + this.sign(this.vy))) this.y += this.sign(this.vy);
			this.vy = 0;
		} else this.y += this.vy;

		if (this.vx > 0 ) this.facing = 1; // controlar facing (dirección a la que mira)
		if (this.vx < 0) this.facing = -1;

		//gravedad
		this.vy = this.approach(this.vy, 40, 5);
	}

	approach(val, max, shift) { // metodo para controlar la velocidad maxima, minima, aceleración y fricción
		if (val < max)
			return Math.min(val + shift, max);
		else 
			return Math.max(val - shift, max);
	}

	collision(x, y) { // detectar colisiones con los bloques
		for(let i = 0; i < blocks.length; i++) {
			if (x < blocks[i].x + blocks[i].spriteWidth && 
				(x + (this.width*this.xscale)) > blocks[i].x &&
				y < blocks[i].y + blocks[i].spriteHeight &&
				(y + (this.height*this.yscale)) > blocks[i].y) return true
		}
		return false;
	}

	sign(x) { // retornar 1, 0 o -1 
		if (x < 0) return -1;
		else if (x > 0) return 1;
		else if (x === 0) return 0;
	}

	init() { // loop
		this.control();
		this.draw();
	}
}

// objetos en el room

var player = new Player(0, 0, 3, 3, ctx);

var blocks = Array();

for (var i = 0; i < Math.floor(innerWidth/32); i++) {
	blocks.push(new Block(i*32, 200, ctx));
}
blocks.push(new Block(256, 168, ctx));
blocks.push(new Block(288, 136, ctx));
blocks.push(new Block(320, 104, ctx));
blocks.push(new Block(352, 136, ctx));
blocks.push(new Block(384, 168, ctx));

// bucle inical

function mainLoop () {
	ctx.globalCompositeOperation = 'destination-over';
  	ctx.clearRect(0, 0, innerWidth, innerHeight); // borrar el canvas
  	player.init(); // actualizar al jugador por frame

  	for (var i = 0; i < blocks.length; i++) { // dibujar todos los bloques
  		blocks[i].init(); // inicializarlos
  	}
}

// controles del teclado

window.addEventListener("keydown", (e) => {
	if (player.keys[e.key] !== undefined) player.keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
	if (player.keys[e.key] !== undefined) player.keys[e.key] = false;
});

// inicializar el bucle a 60 fps

setInterval(()=> {
	mainLoop();
}, 60);