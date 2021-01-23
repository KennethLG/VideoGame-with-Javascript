const canvas = document.querySelector("canvas"); // definir el canvas y sus dimensiones

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; // evitar la interpolación linear

// objetos en el room
var player = new Player(0, 0, 2, 2, ctx);

var blocks = Array();

for (var i = 0; i < Math.floor(innerWidth/32)+1; i++) {
	blocks.push(new Block(i*32, 400, ctx));
}
blocks.push(new Block(256, 368, ctx));
blocks.push(new Block(288, 336, ctx));
blocks.push(new Block(320, 304, ctx));
blocks.push(new Block(352, 336, ctx));
blocks.push(new Block(384, 368, ctx));

var coins = Array();
coins.push(new Coin(100, 360, 2, 2, ctx));
coins.push(new Coin(420, 360, 2, 2, ctx));
coins.push(new Coin(320, 260, 2, 2, ctx));
coins.push(new Coin(320, 150, 2, 2, ctx));

// bucle inical

function mainLoop () {
	ctx.globalCompositeOperation = 'destination-over';
  	ctx.clearRect(0, 0, innerWidth, innerHeight); // borrar el canvas
  	player.init(); // actualizar al jugador por frame

  	blocks.map((i)=> i.init()); // inicializar bloques
  	coins.map((i) => i.init()); // inicializar monedas

  	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "white";
  	ctx.fillText(`Score : ${player.coins}`, 10,30);
}

// controles del teclado

window.addEventListener("keydown", (e) => {
	if (player.keys[e.key] !== undefined) player.keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
	if (player.keys[e.key] !== undefined) player.keys[e.key] = false;
});
window.addEventListener("click", (e)=> {
	console.log("click");
	blocks.push(new Block(M(e.clientX), M(e.clientY), ctx));
});

// inicializar el bucle a 60 fps

setInterval(()=> {
	mainLoop();
}, 60);

// other functions

const M = (x) => {
	return (x-(x % 32));
}