class Coin {
	constructor(x, y, xscale, yscale, ctx) {
		this.x = x;
		this.y = y;

		this.xscale = xscale;
		this.yscale = yscale;

		this.sprite = new Image();
		this.sprite.src = "./sprites/coin.png";

		this.spriteWidth = 60;
		this.spriteHeight = 15;

		this.spriteFrameCount = 4;
		this.spriteFrame = 0;

		this.spriteCols = 4;
		this.spriteRows = 1;

		this.srcX;
		this.srcY;

		this.width = (this.spriteWidth/this.spriteCols);
		this.height = (this.spriteHeight/this.spriteRows);
	}

	draw() {
		this.updateFrame();
		ctx.drawImage(this.sprite, this.srcX, this.srcY, this.width, this.height, this.x, this.y, this.width*this.xscale, this.height*this.yscale);
	}

	updateFrame() {
		this.spriteFrame = ++this.spriteFrame % this.spriteCols;
		this.srcX = this.spriteFrame * this.width;
		this.srcY = 0;
	}

	init() {
		this.draw();
	}
}

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

		this.spriteFrameCount = 4;
		this.spriteFrame = 0;

		this.getImage();

		this.xscale = xscale;
		this.yscale = yscale;

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

		this.coins = 0;
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
		if (this.keys["w"] && this.collision(this.x, this.y+1, blocks)) this.vy = -30; // saltar si solo se ecuentra en el suelo

		if (!this.keys["a"]&&!this.keys["d"]) this.vx = this.approach(this.vx, 0, 2); // ninguna tecla

		if (this.collision(this.x + this.vx, this.y, blocks)) { // colisión perfecta en X
			this.x = Math.floor(this.x);
			while(!this.collision(this.x + this.sign(this.vx), this.y, blocks)) this.x += this.sign(this.vx);
			this.vx = 0;
		} else this.x += this.vx;

		if (this.collision(this.x, this.y + this.vy, blocks)) { // colision perfecta en Y
			this.y = Math.floor(this.y);
			while(!this.collision(this.x, this.y + this.sign(this.vy), blocks)) this.y += this.sign(this.vy);
			this.vy = 0;
		} else this.y += this.vy;

		if (this.vx > 0 ) this.facing = 1; // controlar facing (dirección a la que mira)
		if (this.vx < 0) this.facing = -1;

		//gravedad
		this.vy = this.approach(this.vy, 40, 5);

		//tomar monedas
		let coin = this.collisionId(this.x, this.y, coins);
		if (coin != -1) {
			coins.splice(coin, 1);
			this.coins++;
		}
	}

	approach(val, max, shift) { // metodo para controlar la velocidad maxima, minima, aceleración y fricción
		if (val < max)
			return Math.min(val + shift, max);
		else 
			return Math.max(val - shift, max);
	}

	collision(x, y, obj) { // detectar colisiones
		for(let i = 0; i < obj.length; i++) {
			if (x < obj[i].x + obj[i].spriteWidth && 
				(x + (this.width*this.xscale)) > obj[i].x &&
				y < obj[i].y + obj[i].spriteHeight &&
				(y + (this.height*this.yscale)) > obj[i].y) return true;
		}
		return false;
	}

	collisionId(x, y, obj) { // detectar colisiones y devolver su id
		for(let i = 0; i < obj.length; i++) {
			if (x < obj[i].x + obj[i].spriteWidth && 
				(x + (this.width*this.xscale)) > obj[i].x &&
				y < obj[i].y + obj[i].spriteHeight &&
				(y + (this.height*this.yscale)) > obj[i].y) return i;
		}
		return -1;
	}

	sign(x) { // retornar 1, 0 o -1 
		if (x < 0) return -1;
		else if (x > 0) return 1;
		else if (x === 0) return 0;
	}

	getImage() {
		this.sprite = new Image();
		this.sprite.src = "./sprites/playerIdleRight.png";

		this.sprite.onload = ()=> {
			this.spriteWidth = this.sprite.width//96;
			this.spriteHeight = this.sprite.height//24;

			this.spriteCols = 4;
			this.spriteRows = 1;

			this.srcX;
			this.srcY;

			this.width = (this.spriteWidth/this.spriteCols);
			this.height = (this.spriteHeight/this.spriteRows);
		}
	}

	init() { // loop
		this.control();
		this.draw();
	}
}