// ************************************
// *     EJERCICIO 1                   *
// ************************************

// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que 
	// en este ejemplo la variable ctx es global y que guarda el contexto (context) 
	// para pintar en el canvas.
	ctx.fillStyle = this.color;
	ctx.fillRect(this.px,this.py,this.width,this.height);
	ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle= 'black'; //Linea de borde negra
	ctx.strokeRect(this.px,this.py,this.width,this.height);
}
//** Método introducido en el EJERCICIO 4 */
Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

//** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth+2;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()

}

Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}



// ============== Block ===============================

function Block (pos, color) {


	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color. Pos = posición de la celda, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea.

	//Calculo posicion inicial
	this.x=pos.x;
	this.y=pos.y;
	var newx=pos.x*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH;
	var newy=pos.y*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH;
	this.init(new Point(newx,newy),new Point(newx+Block.BLOCK_SIZE,newy+Block.BLOCK_SIZE)); //Paso de cuadrado a pixeles
	this.color=color;
	this.lineWidth=Block.OUTLINE_WIDTH;


	//Canvas de 150x150  --> 10x20 -> 20x30=
}

Block.prototype.can_move = function(board, dx, dy) {
	return true;
}

// ESTE CÓDIGO VIENE YA PROGRAMADO
Block.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO: emplea el patrón de herencia (Block es un Rectangle)
Block.prototype = new Rectangle();
Block.prototype.constructor=Block;

// ************************************
// *      EJERCICIO 2                  *
// ************************************

// ============== Shape ===================================

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array.
	this.blocks=[];
	for (var i=0; i<coords.length;i++){
		this.blocks[i]=new Block(coords[i],color);
	}
};

Shape.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	for (var i=0;i<this.blocks.length;i++){
		this.blocks[i].draw();
	}
};
// Por ahora, siempre devolverá true

Shape.prototype.can_move = function(board, dx, dy) {
	return true;
};

/** Método creado en el EJERCICIO 4 */

Shape.prototype.move = function(dx, dy) {

	for (block of this.blocks) {
		block.erase();
	}

	for (block of this.blocks) {
		block.move(dx,dy);
	}
};

// ============= I_Shape ================================
function I_Shape(center) {
	var coords = [new Point(center.x - 2, center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];

	Shape.prototype.init.call(this, coords, "blue");
}
// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = Shape;

// =============== J_Shape =============================
function J_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar J_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x +1, center.y+1),
		new Point(center.x + 1, center.y)];

	Shape.prototype.init.call(this, coords, "orange");

}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = Shape;

// ============ L Shape ===========================
function L_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y+1),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)
	];

	Shape.prototype.init.call(this, coords, "cyan");
}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = Shape;

// ============ O Shape ===========================
function O_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y+1),
		new Point(center.x - 1, center.y),
		new Point(center.x, center.y+1),
		new Point(center.x , center.y)];

	Shape.prototype.init.call(this, coords, "red");
}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = Shape;

// ============ S Shape ===========================
function S_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y+1),
		new Point(center.x, center.y+1),
		new Point(center.x+1, center.y),
		new Point(center.x , center.y)];

	Shape.prototype.init.call(this, coords, "green");
}

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = Shape;

// ============ T Shape ===========================
function T_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar T_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x-1, center.y),
		new Point(center.x, center.y+1),
		new Point(center.x , center.y),
		new Point(center.x+1, center.y)];

	Shape.prototype.init.call(this, coords, "yellow");
}

// TU CÓDIGO AQUÍ: La clase T_Shape hereda de la clase Shape
T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = Shape;

// ============ Z Shape ===========================
function Z_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar Z_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x+1, center.y+1),
		new Point(center.x , center.y),
		new Point(center.x-1, center.y),
		new Point(center.x, center.y+1)];

	Shape.prototype.init.call(this, coords, "magenta");

}
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Shape;

// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

function Board(width, height) {
	this.width = width;
	this.height = height;
}

// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

Board.prototype.draw_shape = function(shape){
	if (shape.can_move(this,0,0)){
		shape.draw();
		return true;
	}
	return false;
}


// En esta parte de la práctica devolveremos siempre 'true'
// pero, más adelante, tendremos que implementar este método
// que toma como parámetro la posición (x,y) de una casilla
// (a la que queremos mover una pieza) e indica si es posible
// ese movimiento o no (porque ya está ocupada o porque se sale
// de los límites del tablero)

Board.prototype.can_move = function(x,y){
	return true;
}

// ==================== Tetris ==========================

function Tetris() {
	this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='white';

Tetris.prototype.create_new_shape = function(){

	// TU CÓDIGO AQUÍ:
	// Elegir un nombre de pieza al azar del array Tetris.SHAPES
	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
	// Devolver la referencia de esa pieza nueva

	//var index= Math.floor(Math.random() * Tetris.SHAPES.length); //Obtengo un indice aleatorio para sacar la pieza al azar
	//var tetronimo= Tetris.SHAPES[index];
	//return new tetronimo(new Point(Tetris.BOARD_WIDTH/2,0));

	//Modificado temporalmente para devolver un S_shape
	return new S_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
}

Tetris.prototype.init = function(){

	/**************
	 EJERCICIO 4
	 ***************/



	// Obtener una nueva pieza al azar y asignarla como pieza actual

	this.current_shape = this.create_new_shape()

	// TU CÓDIGO AQUÍ:
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board tiene un método para pintar)
	this.board.draw_shape(this.current_shape);

	// gestor de teclado

	document.addEventListener('keydown', this.key_pressed.bind(this), false);

}

Tetris.prototype.key_pressed = function(e) {

	var key = e.keyCode ? e.keyCode : e.which;

	// TU CÓDIGO AQUÍ:
	// en la variable key se guardará el código ASCII de la tecla que
	// ha pulsado el usuario. ¿Cuál es el código key que corresponde
	// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
	console.log(key);
	if (key==37){
		this.do_move("Left");
	}
	if (key==39){
		this.do_move("Right");
	}
	if (key==40){
		this.do_move("Down");
	}
	//Rotar: 38
	//Izquierda: 37
	//Derecha: 39
	//Abajo: 40
}

Tetris.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos
	// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction],
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza.
	var direccion=Tetris.DIRECTION[direction]
	var dx=direccion[0];
	var dy=direccion[1];
	if (this.current_shape.can_move(dx,dy)){
		this.current_shape.move(dx,dy);
	}

}