//Variable global que guarda la puntuacion1 actual
var puntuacion1=0;
var nivel=1;
var audio = false; //Indica si esta reproduciendo la musica o no

// ************************************
// *     EJERCICIO 1                   *
// ************************************

// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;
}

// ============== Rectangle1 ====================
function Rectangle1() {}

Rectangle1.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle1.prototype.drawPreview = function() {

	// Pinta en el canvas preview

	previewctx1.fillStyle = this.color;
	previewctx1.fillRect(this.px,this.py,this.width,this.height);
	previewctx1.lineWidth = this.lineWidth;
	previewctx1.strokeStyle= 'black'; //Linea de borde negra
	previewctx1.strokeRect(this.px,this.py,this.width,this.height);
}

Rectangle1.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que 
	// en este ejemplo la variable ctx1 es global y que guarda el contexto (context) 
	// para pintar en el canvas.
	ctx1.fillStyle = this.color;
	ctx1.fillRect(this.px,this.py,this.width,this.height);
	ctx1.lineWidth = this.lineWidth;
	ctx1.strokeStyle= 'black'; //Linea de borde negra
	ctx1.strokeRect(this.px,this.py,this.width,this.height);
}

//** Método introducido en el EJERCICIO 4 */
Rectangle1.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

//** Método introducido en el EJERCICIO 4 */

Rectangle1.prototype.erase = function(){
	ctx1.beginPath();
	ctx1.lineWidth = this.lineWidth+2;
	ctx1.strokeStyle = Tetris1.Board1_COLOR;
	ctx1.rect(this.px, this.py, this.width, this.height);
	ctx1.stroke();
	ctx1.fillStyle = Tetris1.Board1_COLOR;
	ctx1.fill()

}

Rectangle1.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle1.prototype.setFill = function(color) { this.color = color}


// ============== Block ===============================

function Block1 (pos, color) {


	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color. Pos = posición de la celda, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle1, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea.

	//Calculo posicion inicial
	this.x=pos.x;
	this.y=pos.y;
	var newx=pos.x*Block1.BLOCK_SIZE+Block1.OUTLINE_WIDTH;
	var newy=pos.y*Block1.BLOCK_SIZE+Block1.OUTLINE_WIDTH;
	this.init(new Point(newx,newy),new Point(newx+Block1.BLOCK_SIZE,newy+Block1.BLOCK_SIZE)); //Paso de cuadrado a pixeles
	this.color=color;
	this.lineWidth=Block1.OUTLINE_WIDTH;
}
Block1.BLOCK_SIZE = 30;
Block1.OUTLINE_WIDTH = 2;

// TU CÓDIGO: emplea el patrón de herencia (Block es un Rectangle1)
Block1.prototype = new Rectangle1();
Block1.prototype.constructor=Block1;

/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Block1.prototype.can_move = function(Board1, dx, dy) {
	// TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
	// e indica si es posible mover el bloque actual si
	// incrementáramos su posición en ese valor
	return Board1.can_move(this.x+dx,this.y+dy);
}

/** Método introducido en el EJERCICIO 4 */

// ESTE CÓDIGO VIENE YA PROGRAMADO
Block1.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle1.prototype.move.call(this, dx * Block1.BLOCK_SIZE, dy * Block1.BLOCK_SIZE);
}


// ************************************
// *      EJERCICIO 2                  *
// ************************************

// ============== Shape1 ===================================

function Shape1() {}


Shape1.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array.
	this.blocks=[];
	for (var i=0; i<coords.length;i++){
		this.blocks[i]=new Block1(coords[i],color);
	}
	/*8 Atributo introducido en el EJERCICIO 8*/
	this.rotation_dir = 1;
};
Shape1.prototype.drawPreview = function (){
	for (var i=0;i<this.blocks.length;i++){
		this.blocks[i].drawPreview();
	}
}
Shape1.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	for (var i=0;i<this.blocks.length;i++){
		this.blocks[i].draw();
	}
};

/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Shape1.prototype.can_move = function(Board1, dx, dy) {
	// TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza
	for (var i=0;i<this.blocks.length;i++){ //Por cada bloque miro si se puede mover
		for (block of this.blocks) {
			if (!block.can_move(Board1,dx,dy)){
				return false;
			}
		}
	}
	//Si llego a este punto todos se pueden mover, devuelvo true
	return true;
};
/* Método introducido en el EJERCICIO 8 */

Shape1.prototype.can_rotate = function(Board1) {

//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
// devolver false. En caso contrario, true.
	for (block of this.blocks) {
		var x = this.center_block.x - this.rotation_dir * this.center_block.y + this.rotation_dir * block.y;
		var y = this.center_block.y + this.rotation_dir * this.center_block.x - this.rotation_dir * block.x;
		if (!Board1.can_move(x,y)){
			return false;
		}
	}
	return true;
};

/* Método introducido en el EJERCICIO 8 */

Shape1.prototype.rotate = function() {

// TU CÓDIGO AQUÍ: básicamente tienes que aplicar la fórmula de rotación
// (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza

	for (block of this.blocks) {
		block.erase();
	}
	for (block of this.blocks) {
		var x = this.center_block.x - this.rotation_dir * this.center_block.y + this.rotation_dir * block.y;
		var y = this.center_block.y + this.rotation_dir * this.center_block.x - this.rotation_dir * block.x;
		block.move(x-block.x,y-block.y);
		//block.move(x,y); //pinto el nuevo
	}
	/* Deja este código al final. Por defecto las piezas deben oscilar en su
       movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
	if (this.shift_rotation_dir)
		this.rotation_dir *= -1
};
/** Método creado en el EJERCICIO 4 */

Shape1.prototype.move = function(dx, dy) {

	for (block of this.blocks) {
		block.erase();
	}

	for (block of this.blocks) {
		block.move(dx,dy);
	}
};

// ============= I_Shape1 ================================
function I_Shape1(center) {
	var coords = [new Point(center.x - 2, center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];

	Shape1.prototype.init.call(this, coords, "blue");
	/* Atributo introducido en el ejercicio 8*/

	this.shift_rotation_dir = true;
	this.center_block = this.blocks[2];
}
// TU CÓDIGO AQUÍ: La clase I_Shape1 hereda de la clase Shape1
I_Shape1.prototype = new Shape1();
I_Shape1.prototype.constructor = Shape1;

// =============== J_Shape1 =============================
function J_Shape1(center) {

	// TU CÓDIGO AQUÍ: Para programar J_Shape1 toma como ejemplo el código de la clase I_Shape1
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x +1, center.y+1),
		new Point(center.x + 1, center.y)];

	Shape1.prototype.init.call(this, coords, "orange");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blocks[1];

}

// TU CÓDIGO AQUÍ: La clase J_Shape1 hereda de la clase Shape1
J_Shape1.prototype = new Shape1();
J_Shape1.prototype.constructor = Shape1;

// ============ L Shape1 ===========================
function L_Shape1(center) {

	// TU CÓDIGO AQUÍ: Para programar L_Shape1 toma como ejemplo el código de la clase I_Shape1
	var coords = [new Point(center.x + 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x - 1, center.y+1)
	];

	Shape1.prototype.init.call(this, coords, "cyan");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blocks[1];
}

// TU CÓDIGO AQUÍ: La clase L_Shape1 hereda de la clase Shape1
L_Shape1.prototype = new Shape1();
L_Shape1.prototype.constructor = Shape1;

// ============ O Shape1 ===========================
function O_Shape1(center) {

	// TU CÓDIGO AQUÍ: Para programar O_Shape1 toma como ejemplo el código de la clase I_Shape1
	var coords = [new Point(center.x - 1, center.y+1),
		new Point(center.x - 1, center.y),
		new Point(center.x, center.y+1),
		new Point(center.x , center.y)];

	Shape1.prototype.init.call(this, coords, "red");

	this.center_block = this.blocks[0];
}

// TU CÓDIGO AQUÍ: La clase O_Shape1 hereda de la clase Shape1
O_Shape1.prototype = new Shape1();
O_Shape1.prototype.constructor = Shape1;

/* Código introducido en el EJERCICIO 8*/
// O_Shape1 la pieza no rota. Sobreescribiremos el método can_rotate que ha heredado de la clase Shape1

O_Shape1.prototype.can_rotate = function(Board1){
	return false;
};

// ============ S Shape1 ===========================
function S_Shape1(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape1 toma como ejemplo el código de la clase I_Shape1
	var coords = [new Point(center.x , center.y),
		new Point(center.x - 1, center.y+1),
		new Point(center.x, center.y+1),
		new Point(center.x+1, center.y)];

	Shape1.prototype.init.call(this, coords, "green");

	this.shift_rotation_dir = true;
	this.center_block = this.blocks[0];
}

// TU CÓDIGO AQUÍ: La clase S_Shape1 hereda de la clase Shape1
S_Shape1.prototype = new Shape1();
S_Shape1.prototype.constructor = Shape1;

// ============ T Shape1 ===========================
function T_Shape1(center) {

	// TU CÓDIGO AQUÍ: : Para programar T_Shape1 toma como ejemplo el código de la clase I_Shape1
	var coords = [new Point(center.x-1, center.y),
		new Point(center.x , center.y),
		new Point(center.x, center.y+1),
		new Point(center.x+1, center.y)];

	Shape1.prototype.init.call(this, coords, "yellow");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blocks[1];

}

// TU CÓDIGO AQUÍ: La clase T_Shape1 hereda de la clase Shape1
T_Shape1.prototype = new Shape1();
T_Shape1.prototype.constructor = Shape1;

// ============ Z Shape1 ===========================
function Z_Shape1(center) {

	// TU CÓDIGO AQUÍ: : Para programar Z_Shape1 toma como ejemplo el código de la clase I_Shape1
	var coords = [new Point(center.x+1, center.y+1),
		new Point(center.x , center.y),
		new Point(center.x-1, center.y),
		new Point(center.x, center.y+1)];

	Shape1.prototype.init.call(this, coords, "magenta");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
	this.center_block = this.blocks[1];

}
Z_Shape1.prototype = new Shape1();
Z_Shape1.prototype.constructor = Shape1;

// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== Board1 ================

function Board1(width, height) {
	this.width = width;
	this.height = height;
	this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6  //this.grid= [x,y] = Bloque */

}

// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false
/*****************************
 *	 EJERCICIO 6          *
 *****************************/

Board1.prototype.add_Shape1 = function(Shape1){

	// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid
	for (block of Shape1.blocks) {
		var clave=block.x+","+block.y;
		this.grid[clave]=block;
	}

}
Board1.prototype.draw_Shape1_preview = function(Shape1){
	//Borro lo que habia en el canvas
	previewctx1.clearRect(0, 0, previewCanvas1.width, previewCanvas1.height);
	//Pinto la nueva pieza
	Shape1.drawPreview();
	return true;
}

Board1.prototype.draw_Shape1 = function(Shape1){
	if (Shape1.can_move(this,0,0)){
		Shape1.draw();
		return true;
	}
	return false;
}

// ****************************
// *     EJERCICIO 5          *
// ****************************

Board1.prototype.can_move = function(x,y){
	// TU CÓDIGO AQUÍ:
	// hasta ahora, este método siempre devolvía el valor true. Ahora,
	// comprueba si la posición que se le pasa como párametro está dentro de los
	// límites del tablero y en función de ello, devuelve true o false.
	if (x>=0 && x<this.width && y>=0 && y<this.height){ //Esta dentro de los limites del tablero
		//Detecto colisiones
		/* EJERCICIO 7 */
		// TU CÓDIGO AQUÍ: código para detectar colisiones. Si la posición x,y está en el diccionario grid, devolver false y true en cualquier otro caso.
		return !([x,y] in this.grid); //Devuelvo true si no esta, devuelvo false si esta
	}
	else{
		return false;
	}


}
Board1.prototype.is_row_complete = function(y){
// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
// es completa o no (se busca en el grid).
	for (var x=0;x<this.width;x++){
		if (!([x,y] in this.grid)){ //si no esta, es que no esta completa y devuelvo false
			return false;
		}
	}
	return true;
};

Board1.prototype.delete_row = function(y){
// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila y
	for (var x=0;x<this.width;x++){
		var bloque=this.grid[x+","+y]; //Obtengo el bloque
		bloque.erase(); //Elimino el bloque de la pantalla
		delete this.grid[x+","+y]; //Elimino el bloque del grid
	}
};

Board1.prototype.move_down_rows = function(y_start){
/// TU CÓDIGO AQUÍ:
	for (var y=y_start;y>=0;y--){ //empezando en la fila y_start y hasta la fila 0
		for (var x=0;x<this.width;x++){ //para todas las casillas de esa fila
			if ([x,y] in this.grid){  //si la casilla está en el grid  (hay bloque en esa casilla)
				var bloque=this.grid[x+","+y]; //Obtengo el bloque
				delete this.grid[x+","+y];//borrar el bloque del grid
				while (bloque.can_move(this,0, 1)){ // mientras se pueda mover el bloque hacia abajo
					bloque.erase();
					bloque.move(0,1); //mover el bloque hacia abajo
				}
				var clave=bloque.x+","+bloque.y;
				this.grid[clave]=bloque;// meter el bloque en la nueva posición del grid
			}
		}
	}
};

Board1.prototype.remove_complete_rows = function(){
// TU CÓDIGO AQUÍ:
	var lineasSeguidas=0; //Contador de las lineas que llevo seguidas

	for (var y=0;y<this.height;y++){ // Para toda fila y del tablero
		if (this.is_row_complete(y)){ // si la fila y está completa
			//Linea, sumo 10 puntos * Nº lineas seguidas
			if (audio) {loadAudio("../audio/sonidoLinea.mp3").then(function(audio){ audio.volume=0.4; audio.play(); });} //Efecto sonoro linea
			lineasSeguidas++;
			this.delete_row(y); //borrar fila y
			this.move_down_rows(y-1); //mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
		}
	}
	if (lineasSeguidas>0){ //He hecho al menos una linea, actualizo puntuacion1
		puntuacion1=puntuacion1+(10*lineasSeguidas);
		if (lineasSeguidas==4) {
			document.getElementById("puntuacion1").innerHTML=puntuacion1+ " Tetris!!!"; //Muestro la nueva puntuacion1 junto con mensaje de tetris
			setTimeout(function() { //A los 3 segundos borro el mensaje tetris
				document.getElementById("puntuacion1").innerHTML=puntuacion1;
			},3000);
		}
		else if (lineasSeguidas>1){
			document.getElementById("puntuacion1").innerHTML=puntuacion1+ " "+lineasSeguidas+" filas seguidas!!!"; //Muestro la nueva puntuacion1 junto con las filas eliminadas
			setTimeout(function() { //A los 3 segundos borro el mensaje
				document.getElementById("puntuacion1").innerHTML=puntuacion1;
			},3000);
		}
		else{
			document.getElementById("puntuacion1").innerHTML=puntuacion1 //Muestro la puntuacion1
		}
		//Gestiono aumento de dificultad

	}
};
// ==================== Tetris1 ==========================

function Tetris1() {
	this.Board1 = new Board1(Tetris1.Board1_WIDTH, Tetris1.Board1_HEIGHT);
}

Tetris1.Shape1S = [I_Shape1, J_Shape1, L_Shape1, O_Shape1, S_Shape1, T_Shape1, Z_Shape1];
Tetris1.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris1.Board1_WIDTH = 10;
Tetris1.Board1_HEIGHT = 20;
Tetris1.Board1_COLOR='white';
Tetris1.GAME_OVER=false;
Tetris1.TIMEOUT=1000;
Tetris1.PAUSED=false;
Tetris1.PLAYER2_GAMEOVER=false;
Tetris1.prototype.create_new_Shape1 = function(){

	// TU CÓDIGO AQUÍ:
	// Elegir un nombre de pieza al azar del array Tetris1.Shape1S
	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
	// Devolver la referencia de esa pieza nueva
	if (Tetris1.PREVIEW_Shape1==null){ //Si no tengo pieza preview, genero la preview y actual
		//Creo la pieza preview
		var index= Math.floor(Math.random() * Tetris1.Shape1S.length); //Obtengo un indice aleatorio para sacar la pieza al azar
		Tetris1.PREVIEW_Shape1= Tetris1.Shape1S[index];
		var shapeInstance=new Tetris1.PREVIEW_Shape1(new Point(2,1));
		this.previewShape=shapeInstance;
		//Pinto pieza preview
		this.Board1.draw_Shape1_preview(new Tetris1.PREVIEW_Shape1(new Point(2,1)));
		//Creo la pieza actual
		var index= Math.floor(Math.random() * Tetris1.Shape1S.length); //Obtengo un indice aleatorio para sacar la pieza al azar
		var tetronimo= Tetris1.Shape1S[index];
		return new tetronimo(new Point(Tetris1.Board1_WIDTH/2,0));
	}
	else { //Tengo pieza
		tetronimo=Tetris1.PREVIEW_Shape1; //Obtengo la pieza preview
		//Saco una nueva pieza para mostrar en preview
		var index= Math.floor(Math.random() * Tetris1.Shape1S.length); //Obtengo un indice aleatorio para sacar la pieza al azar
		var tetronimoNuevo= Tetris1.Shape1S[index];
		Tetris1.PREVIEW_Shape1=tetronimoNuevo; //Guardo la siguiente pieza
		var shapeInstance=new Tetris1.PREVIEW_Shape1(new Point(2,1));
		this.previewShape=shapeInstance;
		//Pinto pieza preview
		this.Board1.draw_Shape1_preview(new Tetris1.PREVIEW_Shape1(new Point(3,1)));
		return new tetronimo(new Point(Tetris1.Board1_WIDTH/2,0)); //Devuelvo la pieza preview
	}

	//Modificado temporalmente para devolver un S_Shape1
	//return new I_Shape1(new Point(Tetris1.Board1_WIDTH/2,0));
}

Tetris1.prototype.init = function(){

	/**************
	 EJERCICIO 4
	 ***************/


	// Obtener una nueva pieza al azar y asignarla como pieza actual

	this.current_Shape1 = this.create_new_Shape1()

	document.getElementById("esperarJugador").style= "display:none";
	// TU CÓDIGO AQUÍ:
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board1 tiene un método para pintar)
	this.Board1.draw_Shape1(this.current_Shape1);
	window.requestAnimationFrame(renderCanvas1);
	// gestor de teclado
	document.addEventListener('keydown', this.key_pressed.bind(this), false);
	// Crea el código del método Tetris1.animate_Shape1 (más abajo lo verás)
	this.animate_Shape1();
}

Tetris1.prototype.key_pressed = function(e) {

	var key = e.keyCode ? e.keyCode : e.which;

	// TU CÓDIGO AQUÍ:
	// en la variable key se guardará el código ASCII de la tecla que
	// ha pulsado el usuario. ¿Cuál es el código key que corresponde
	// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
	console.log(key);
	if (!Tetris1.PAUSED) { //Si el juego no está pausado
		if (key == 80) { //Pulsa P, pausa el juego
			clearInterval(this.timer);
			Tetris1.PAUSED = true;
			document.getElementById("juegoPausado").style = "position: absolute;left: 330px; top: 200px; color:#FF0000; font-size:20px; display; ";
			if (audio){
				document.getElementById("audiofondo").pause();
			}
			document.getElementById("audio").disabled=true;
		}

		if (key == 37) {
			this.do_move("Left");
		}
		if (key == 39) {
			this.do_move("Right");
		}
		if (key == 40) {
			this.do_move("Down");
		}
		// TU CÓDIGO AQUÍ: Añadir una condición para que si el jugador pulsa la tecla "Espacio", la pieza caiga en picado
		if (key == 32) {
			var dx = Tetris1.DIRECTION["Down"][0];
			var dy = Tetris1.DIRECTION["Down"][1];
			while (this.current_Shape1.can_move(this.Board1, dx, dy)) { //Mientras se pueda mover hacia abajo muevo
				this.do_move("Down");
			}
			this.do_move("Down"); //Muevo una vez mas para que saque la siguiente pieza
		}
		if (key == 38) {
			this.do_rotate();
			if (audio) {loadAudio("../audio/giroPieza.mp3").then(function(audio){ audio.volume=0.5; audio.play(); });} //Efecto sonoro giro pieza
		}
	}
	else{ //Juego pausado
		if (key ==80 ) { //Pulsa P, retoma el juego
			this.timer = setInterval(function() {this.game1.do_move("Down")}, Tetris1.TIMEOUT);
			Tetris1.PAUSED=false;
			document.getElementById("juegoPausado").style="display:none";
			if (audio) {
				document.getElementById("audiofondo").play();
			}
			document.getElementById("audio").disabled=false;
		}
	}
	//Rotar: 38
	//Izquierda: 37intervalo javascript
	//Derecha: 39
	//Abajo: 40
	//Barra espaciadora: 32

}
//Metodos para pintar interaccion con el segundo jugador
Tetris1.prototype.dibujarBloqueSegundoJugador = function (block){
	//Dibuja el bloque del segundo jugador
	canvas2ctx.fillStyle = block.color;
	canvas2ctx.fillRect(block.px,block.py,block.width,block.height);
	canvas2ctx.lineWidth = block.lineWidth;
	canvas2ctx.strokeStyle= 'black'; //Linea de borde negra
	canvas2ctx.strokeRect(block.px,block.py,block.width,block.height);
}

Tetris1.prototype.limpiarSegundoJugador = function (){
	//Limpia el canvas del segundo jugador
	canvas2ctx.fillStyle = 'white';
	canvas2ctx.fillRect(0,0,canvas2.width,canvas2.height);
	previewctx2.fillStyle = 'white';
	previewctx2.fillRect(0,0,previewCanvas2.width,previewCanvas2.height);
}
Tetris1.prototype.dibujarPreviewSegundoJugador = function (block){
	//Limpia el canvas preview del segundo jugador
	previewctx2.fillStyle = block.color;
	previewctx2.fillRect(block.px,block.py,block.width,block.height);
	previewctx2.lineWidth = block.lineWidth;
	previewctx2.strokeStyle= 'black'; //Linea de borde negra
	previewctx2.strokeRect(block.px,block.py,block.width,block.height);
}
Tetris1.prototype.actualizarPuntuacionSegundoJugador = function (punt,niv){
	//Actualiza nivel y puntuacion del segundo jugador
	document.getElementById("puntuacion2").innerHTML=punt;
	document.getElementById("nivel2").innerHTML=niv;
}

Tetris1.prototype.pintarGameOverSegundoJugador = function (punt,niv){
	//Actualiza nivel y puntuacion del segundo jugador
	canvas2ctx.fillStyle = "Black"; //cuadrado negro
	canvas2ctx.fillRect(25, 200, 250, 100);
	canvas2ctx.font = "bold 42px fantasy"; //estilo de texto
	canvas2ctx.fillStyle="red";
	canvas2ctx.textAlign = "center";
	canvas2ctx.strokeText("Game over!!", 150, 265);
	canvas2ctx.fillText("Game over!!", 150, 265);
	if (audio) {loadAudio("../audio/gameOver.mp3").then(function(audio){ audio.volume=0.5; audio.play(); });} //Efecto sonoro game over
	Tetris1.PLAYER2_GAMEOVER=true;
	if (audio && Tetris1.GAME_OVER) {
		document.getElementById("audiofondo").pause();
		audio=false;
	}
	if (Tetris1.GAME_OVER) {
		document.getElementById("audio").disabled=true;
	}
}

Tetris1.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris1.DIRECTION guarda los desplazamientos
	// en cada dirección, por tanto, si accedes a Tetris1.DIRECTION[direction],
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza.
	if (!Tetris1.GAME_OVER) {

		//Gestion de la dificultad en funcion de la puntuacion1
		if (puntuacion1>=100 && puntuacion1<200){ //Si puntuacion1 entre 100 y 200, nivel 2
			Tetris1.TIMEOUT=700; //Se guarda el tiempo para volver a ponerlo en el PAUSE
			this.reanimate_Shape1(Tetris1.TIMEOUT);
			nivel=2;
			document.getElementById("nivel1").innerHTML=2;
		}
		else if (puntuacion1>=200 && puntuacion1<300){ //Si puntuacion1 mayor de 200 y menor de 300, nivel 3
			Tetris1.TIMEOUT=500;
			this.reanimate_Shape1(Tetris1.TIMEOUT);
			nivel=3;
			document.getElementById("nivel1").innerHTML=3;
		}
		else if (puntuacion1>=300 && puntuacion1<400){ //Si puntuacion1 mayor de 300, nivel 4
			Tetris1.TIMEOUT=400;
			this.reanimate_Shape1(Tetris1.TIMEOUT);
			nivel=4;
			document.getElementById("nivel1").innerHTML=4;
		}
		else if (puntuacion1>=400){
			Tetris1.TIMEOUT=300;
			this.reanimate_Shape1(Tetris1.TIMEOUT);
			nivel=5;
			document.getElementById("nivel1").innerHTML=5;
		}
		//Gestion del movimiento
		var direccion = Tetris1.DIRECTION[direction]
		var dx = direccion[0];
		var dy = direccion[1];
		if (this.current_Shape1.can_move(this.Board1, dx, dy)) {
			this.current_Shape1.move(dx, dy);
		}
		/* Código que se pide en el EJERCICIO 6 */
		else if (direction == 'Down') {
			if (audio) {loadAudio("../audio/piezaClic.mp3").then( audio => audio.play());} //Efecto sonoro cuando colocas una pieza
			this.Board1.add_Shape1(this.current_Shape1);
			this.Board1.remove_complete_rows(); //Miro si hay alguna fila para eliminar
			if (this.Board1.can_move(this.Board1.width / 2, 0)) { //Si se puede añadir
				//Añado la nueva pieza
				this.current_Shape1 = this.create_new_Shape1()
				this.Board1.draw_Shape1(this.current_Shape1);

			} else { //Si no, game over
				Tetris1.GAME_OVER=true;
				this.GAMEOVER=true;
				clearInterval(this.timer); //Paro el reloj
				//Dibujo el mensaje de game-over
				ctx1.fillStyle = "Black"; //cuadrado negro
				ctx1.fillRect(25, 200, 250, 100);
				ctx1.font = "bold 42px fantasy"; //estilo de texto
				ctx1.fillStyle="red";
				ctx1.textAlign = "center";
				ctx1.strokeText("Game over!!", 150, 265);
				ctx1.fillText("Game over!!", 150, 265);
				if (audio) {loadAudio("../audio/gameOver.mp3").then(function(audio){ audio.volume=0.5; audio.play(); });} //Efecto sonoro game over
				if (audio && Tetris1.PLAYER2_GAMEOVER) {
					document.getElementById("audiofondo").pause();
					audio=false;
				}
				if (Tetris1.PLAYER2_GAMEOVER) {
					document.getElementById("audio").disabled=true;
				}

			}

		}
	}
	// TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
}
/***** EJERCICIO 8 ******/
Tetris1.prototype.do_rotate = function(){

	// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape1.can_rotate y Shape1.rotate ya están programadas.
	if (this.current_Shape1.can_rotate(this.Board1)){
		this.current_Shape1.rotate();
	}
}
// TU CÓDIGO AQUÍ: genera un timer que mueva hacia abajo la pieza actual cada segundo
Tetris1.prototype.animate_Shape1 = function(){
	this.timer = setInterval(function() {this.game1.do_move("Down")}, 1000);
}

Tetris1.prototype.reanimate_Shape1 = function(timeout){
	clearInterval(this.timer);
	this.timer = setInterval(function() {this.game1.do_move("Down")}, timeout);
}

function ponerAudioBackground(){
	if (!audio){
		var audioElement=document.getElementById("audiofondo");
		audioElement.loop=true;
		audioElement.volume=0.5;
		audioElement.play();
		audio=true;
	}
}

function loadAudio(url){
	return new Promise(resolve => {
		const audio = new Audio();
		audio.addEventListener('loadeddata', () => {
			resolve(audio);
		});
		audio.src = url;
	});
}

function renderCanvas1(){
	canvas1ctx.drawImage(buffer1, 0, 0);
	window.requestAnimationFrame(renderCanvas1);
}

