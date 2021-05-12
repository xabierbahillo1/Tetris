
function test() {

    const jsdom = require("jsdom");
    const {JSDOM} = jsdom;
    const dom = new JSDOM(`<!doctype html>
<html xmlns="http://www.w3.org/1999/html">
<head>
   <title>Tetris</title>
</head>
<body>
    <canvas id="canvas" width="302" height="350"></canvas>
</body>`);

// ============== Point =======================
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
    }
    Block.BLOCK_SIZE = 30;
    Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO: emplea el patrón de herencia (Block es un Rectangle)
    Block.prototype = new Rectangle();
    Block.prototype.constructor=Block;

    /**************************************************
     *	 Código que se da dado para el EJERCICIO 5 *
     ***************************************************/

    Block.prototype.can_move = function(board, dx, dy) {
        // TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
        // e indica si es posible mover el bloque actual si
        // incrementáramos su posición en ese valor
        return board.can_move(this.x+dx,this.y+dy);
    }

    /** Método introducido en el EJERCICIO 4 */

// ESTE CÓDIGO VIENE YA PROGRAMADO
    Block.prototype.move = function(dx, dy) {
        this.x += dx;
        this.y += dy;

        Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
    }


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
        /*8 Atributo introducido en el EJERCICIO 8*/
        this.rotation_dir = 1;
    };

    Shape.prototype.draw = function() {

        // TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
        // que forman la Pieza
        for (var i=0;i<this.blocks.length;i++){
            this.blocks[i].draw();
        }
    };

    /**************************************************
     *	 Código que se da dado para el EJERCICIO 5 *
     ***************************************************/

    Shape.prototype.can_move = function(board, dx, dy) {
        // TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza
        for (var i=0;i<this.blocks.length;i++){ //Por cada bloque miro si se puede mover
            for (block of this.blocks) {
                if (!block.can_move(board,dx,dy)){
                    return false;
                }
            }
        }
        //Si llego a este punto todos se pueden mover, devuelvo true
        return true;
    };
    /* Método introducido en el EJERCICIO 8 */

    Shape.prototype.can_rotate = function(board) {

//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
// devolver false. En caso contrario, true.
        for (block of this.blocks) {
            var x = this.center_block.x - this.rotation_dir * this.center_block.y + this.rotation_dir * block.y;
            var y = this.center_block.y + this.rotation_dir * this.center_block.x - this.rotation_dir * block.x;
            if (!board.can_move(x,y)){
                return false;
            }
        }
        return true;
    };

    /* Método introducido en el EJERCICIO 8 */

    Shape.prototype.rotate = function() {

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
        /* Atributo introducido en el ejercicio 8*/

        this.shift_rotation_dir = true;
        this.center_block = this.blocks[2];
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

        /* atributo introducido en el EJERCICIO 8 */
        this.shift_rotation_dir = false;
        this.center_block = this.blocks[1];

    }

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
    J_Shape.prototype = new Shape();
    J_Shape.prototype.constructor = Shape;

// ============ L Shape ===========================
    function L_Shape(center) {

        // TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
        var coords = [new Point(center.x + 1, center.y),
            new Point(center.x , center.y),
            new Point(center.x - 1, center.y),
            new Point(center.x - 1, center.y+1)
        ];

        Shape.prototype.init.call(this, coords, "cyan");

        /* atributo introducido en el EJERCICIO 8 */
        this.shift_rotation_dir = false;
        this.center_block = this.blocks[1];
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

        this.center_block = this.blocks[0];
    }

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
    O_Shape.prototype = new Shape();
    O_Shape.prototype.constructor = Shape;

    /* Código introducido en el EJERCICIO 8*/
// O_Shape la pieza no rota. Sobreescribiremos el método can_rotate que ha heredado de la clase Shape

    O_Shape.prototype.can_rotate = function(board){
        return false;
    };

// ============ S Shape ===========================
    function S_Shape(center) {

        // TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
        var coords = [new Point(center.x , center.y),
            new Point(center.x - 1, center.y+1),
            new Point(center.x, center.y+1),
            new Point(center.x+1, center.y)];

        Shape.prototype.init.call(this, coords, "green");

        this.shift_rotation_dir = true;
        this.center_block = this.blocks[0];
    }

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
    S_Shape.prototype = new Shape();
    S_Shape.prototype.constructor = Shape;

// ============ T Shape ===========================
    function T_Shape(center) {

        // TU CÓDIGO AQUÍ: : Para programar T_Shape toma como ejemplo el código de la clase I_Shape
        var coords = [new Point(center.x-1, center.y),
            new Point(center.x , center.y),
            new Point(center.x, center.y+1),
            new Point(center.x+1, center.y)];

        Shape.prototype.init.call(this, coords, "yellow");

        /* atributo introducido en el EJERCICIO 8 */
        this.shift_rotation_dir = false;
        this.center_block = this.blocks[1];

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

        /* atributo introducido en el EJERCICIO 8 */
        this.shift_rotation_dir = true;
        this.center_block = this.blocks[1];

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
        this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6  //this.grid= [x,y] = Bloque */

    }

// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false
    /*****************************
     *	 EJERCICIO 6          *
     *****************************/

    Board.prototype.add_shape = function(shape){

        // TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid
        for (block of shape.blocks) {
            var clave=block.x+","+block.y;
            this.grid[clave]=block;
        }

    }

    Board.prototype.draw_shape = function(shape){
        if (shape.can_move(this,0,0)){
            shape.draw();
            return true;
        }
        return false;
    }

// ****************************
// *     EJERCICIO 5          *
// ****************************

    Board.prototype.can_move = function(x,y){
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
    Board.prototype.is_row_complete = function(y){
// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
// es completa o no (se busca en el grid).
        for (var x=0;x<this.width;x++){
            if (!([x,y] in this.grid)){ //si no esta, es que no esta completa y devuelvo false
                return false;
            }
        }
        return true;
    };

    Board.prototype.delete_row = function(y){
// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila y
        for (var x=0;x<this.width;x++){
            var bloque=this.grid[x+","+y]; //Obtengo el bloque
            bloque.erase(); //Elimino el bloque de la pantalla
            delete this.grid[x+","+y]; //Elimino el bloque del grid
        }
    };

    Board.prototype.move_down_rows = function(y_start){
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

    Board.prototype.remove_complete_rows = function(){
// TU CÓDIGO AQUÍ:
        for (var y=0;y<this.height;y++){ // Para toda fila y del tablero
            if (this.is_row_complete(y)){ // si la fila y está completa
                this.delete_row(y); //borrar fila y
                this.move_down_rows(y-1); //mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
            }
        }
    };
// ==================== Tetris ==========================

    function Tetris() {
        this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
    }

    Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
    Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
    Tetris.BOARD_WIDTH = 10;
    Tetris.BOARD_HEIGHT = 20;
    Tetris.BOARD_COLOR='white';
    Tetris.GAME_OVER=false;

    Tetris.prototype.create_new_shape = function(){

        // TU CÓDIGO AQUÍ:
        // Elegir un nombre de pieza al azar del array Tetris.SHAPES
        // Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
        // Devolver la referencia de esa pieza nueva

        var index= Math.floor(Math.random() * Tetris.SHAPES.length); //Obtengo un indice aleatorio para sacar la pieza al azar
        var tetronimo= Tetris.SHAPES[index];
        return new tetronimo(new Point(Tetris.BOARD_WIDTH/2,0));

        //Modificado temporalmente para devolver un S_shape
        //return new I_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
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
        dom.window.document.addEventListener('keydown', this.key_pressed.bind(this), false);
        // Crea el código del método Tetris.animate_shape (más abajo lo verás)
        this.animate_shape();

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
        // TU CÓDIGO AQUÍ: Añadir una condición para que si el jugador pulsa la tecla "Espacio", la pieza caiga en picado
        if (key==32){
            var dx=Tetris.DIRECTION["Down"][0];
            var dy=Tetris.DIRECTION["Down"][1];
            while (this.current_shape.can_move(this.board,dx,dy)){ //Mientras se pueda mover hacia abajo muevo
                this.do_move("Down");
            }
            this.do_move("Down"); //Muevo una vez mas para que saque la siguiente pieza
        }
        if (key==38){
            this.do_rotate();
        }
        //Rotar: 38
        //Izquierda: 37intervalo javascript
        //Derecha: 39
        //Abajo: 40
        //Barra espaciadora: 32

    }
    Tetris.prototype.do_move = function(direction) {

        // TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
        // derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
        // a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos
        // en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction],
        // obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual
        // se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza.
        if (!Tetris.GAME_OVER) {
            var direccion = Tetris.DIRECTION[direction]
            var dx = direccion[0];
            var dy = direccion[1];
            if (this.current_shape.can_move(this.board, dx, dy)) {
                this.current_shape.move(dx, dy);
            }
            /* Código que se pide en el EJERCICIO 6 */
            else if (direction == 'Down') {
                this.board.add_shape(this.current_shape);
                this.board.remove_complete_rows(); //Miro si hay alguna fila para eliminar
                if (this.board.can_move(this.board.width / 2, 0)) { //Si se puede añadir
                    //Añado la nueva pieza
                    this.current_shape = this.create_new_shape()
                    this.board.draw_shape(this.current_shape);
                } else { //Si no, game over
                    Tetris.GAME_OVER=true;
                    clearInterval(this.timer); //Paro el reloj
                    //Dibujo el mensaje de game-over
                    notctx.fillStyle = "Black"; //cuadrado negro
                    notctx.fillRect(25, 200, 250, 100);
                    notcanvas.style = "display"; //muestro el canvas
                    notctx.font = "bold 42px fantasy"; //estilo de texto
                    notctx.fillStyle="red";
                    notctx.textAlign = "center";
                    notctx.strokeText("Game over!!", 150, 265);
                    notctx.fillText("Game over!!", 150, 265);
                }

            }
        }
        // TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
    }
    /***** EJERCICIO 8 ******/
    Tetris.prototype.do_rotate = function(){

        // TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape.can_rotate y Shape.rotate ya están programadas.
        if (this.current_shape.can_rotate(this.board)){
            this.current_shape.rotate();
        }
    }
    Tetris.prototype.animate_shape = function(){
// TU CÓDIGO AQUÍ: genera un timer que mueva hacia abajo la pieza actual cada segundo
        this.timer = setInterval(function() {game.do_move("Down")}, 1000);
    }

// ===== main ====
// canvas related variables
    var canvas = dom.window.document.getElementById("canvas")
    var ctx = canvas.getContext("2d");

// clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width,canvas.height); //

    var game = new Tetris();
    game.init();

    // Hemos creado un pequeño tablero de 10x5 para estos tests
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    for (var x=0; x < Tetris.BOARD_WIDTH*30; x=x+30){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, Tetris.BOARD_HEIGHT*30);
        ctx.stroke();
    }

    for (var y=0; y < Tetris.BOARD_HEIGHT*30; y=y+30){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(Tetris.BOARD_WIDTH*30, y);
        ctx.stroke();
    }


    QUnit.test('Testing: las funciones existen', function(assert) {
        assert.ok( game.board.is_row_complete instanceof Function, "Board.is_row_complete existe");
        assert.ok( game.board.delete_row instanceof Function, "Board.delete_row existe");
        assert.ok( game.board.move_down_rows instanceof Function, "Board.move_down_rows existe");
        assert.ok( game.board.remove_complete_rows instanceof Function, "Board.remove_complete_rows existe");

    });

    QUnit.test('Testeando las funciones de línea completa', function(assert) {

        // Para este test hemos creado un tablero de 10x10.
        // Creamos dos filas completas de bloques en la parte inferior del grid

        for (var fila=Tetris.BOARD_HEIGHT-2; fila<Tetris.BOARD_HEIGHT; fila++){
            for (var i=0; i<Tetris.BOARD_WIDTH; i++){
                var pos = new Point(i, fila);
                game.board.grid["".concat(i,",",fila)] = new Block(pos,"blue");
            }
        }

        assert.ok( game.board.is_row_complete(Tetris.BOARD_HEIGHT-1) , "La última fila es completa" );
        assert.ok( game.board.is_row_complete(Tetris.BOARD_HEIGHT-2) , "La penúltima fila es completa" );

        // borrar las filas completas
        game.board.remove_complete_rows();

        assert.ok(! game.board.is_row_complete(Tetris.BOARD_HEIGHT-1) , "La última fila no es completa" );
        assert.ok(! game.board.is_row_complete(Tetris.BOARD_HEIGHT-2) , "La penúltima fila no es completa" );

    });


    (function (factory) {

        // NOTE:
        // All techniques except for the "browser globals" fallback will extend the
        // provided QUnit object but return the isolated API methods

        // For AMD: Register as an anonymous AMD module with a named dependency on "qunit".
        if (typeof define === "function" && define.amd) {
            define(["qunit"], factory);
        }
        // For Node.js
        else if (typeof module !== "undefined" && module && module.exports && typeof require === "function") {
            module.exports = factory(require("qunitjs"));
        }
        // For CommonJS with `exports`, but without `module.exports`, like Rhino
        else if (typeof exports !== "undefined" && exports && typeof require === "function") {
            var qunit = require("qunitjs");
            qunit.extend(exports, factory(qunit));
        }
        // For browser globals
        else {
            factory(QUnit);
        }

    }(function (QUnit) {

        var _slicer = Array.prototype.slice;

        function _getImagePixelData(canvas, x, y) {
            return _slicer.apply(canvas.getContext("2d").getImageData(x, y, 1, 1).data);
        }

        function _dumpArray(arr) {
            return "[" + arr.join(", ") + "]";
        }

        /**
         * Find an appropriate `Assert` context to `push` results to.
         * @param * context - An unknown context, possibly `Assert`, `Test`, or neither
         * @private
         */
        function _getPushContext(context) {
            var pushContext;

            if (context && typeof context.push === "function") {
                // `context` is an `Assert` context
                pushContext = context;
            } else if (context && context.assert && typeof context.assert.push === "function") {
                // `context` is a `Test` context
                pushContext = context.assert;
            } else if (
                QUnit && QUnit.config && QUnit.config.current && QUnit.config.current.assert &&
                typeof QUnit.config.current.assert.push === "function"
            ) {
                // `context` is an unknown context but we can find the `Assert` context via QUnit
                pushContext = QUnit.config.current.assert;
            } else if (QUnit && typeof QUnit.push === "function") {
                pushContext = QUnit.push;
            } else {
                throw new Error("Could not find the QUnit `Assert` context to push results");
            }

            return pushContext;
        }

        function pixelEqual(canvas, x, y, r, g, b, a, message) {
            if (typeof a === "string" && typeof message === "undefined") {
                message = a;
                a = undefined;
            }

            var actual = _getImagePixelData(canvas, x, y),
                expected = [r, g, b, a],
                pushContext = _getPushContext(this);

            if (typeof a === "undefined") {
                actual.pop();
                expected.pop();
            }

            message = message || "Pixel should be: " + _dumpArray(expected);
            pushContext.push(QUnit.equiv(actual, expected), actual, expected, message);
        }

        function notPixelEqual(canvas, x, y, r, g, b, a, message) {
            if (typeof a === "string" && typeof message === "undefined") {
                message = a;
                a = undefined;
            }

            var actual = _getImagePixelData(canvas, x, y),
                expected = [r, g, b, a],
                pushContext = _getPushContext(this);

            if (typeof a === "undefined") {
                actual.pop();
                expected.pop();
            }

            message = message || "Pixel should not be: " + _dumpArray(expected);
            pushContext.push(!QUnit.equiv(actual, expected), actual, expected, message);
        }


        var api = {
            pixelEqual: pixelEqual,
            notPixelEqual: notPixelEqual,

            // Add an alias for `notPixelEqual` == `pixelNotEqual`
            // People will prefer one name or the another... hopefully they just pick one
            // and stick with it. ;)
            pixelNotEqual: notPixelEqual
        };

        QUnit.extend(QUnit.assert, api);

        return api;
    }));
}

module.exports = {
    "test": test
}