function test() {

    const jsdom = require("jsdom");
    const {JSDOM} = jsdom;
    const dom = new JSDOM(`<!doctype html>
<html xmlns="http://www.w3.org/1999/html">
<head>
   <title>Tetris</title>
</head>
<body>
    <canvas id="canvas" width="1000" height="150"></canvas>
</body>`);

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
        ctx.strokeRect(this.px,this.py,this.width,this.height);
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

        this.init(new Point(pos.x*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH,pos.y*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH),new Point((pos.x*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH)+Block.BLOCK_SIZE,(pos.y*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH)+Block.BLOCK_SIZE)); //Paso de cuadrado a pixeles
        this.color=color;
        this.lineWidth=Block.OUTLINE_WIDTH;


        //Canvas de 150x150  --> 10x20 -> 20x30=
    }
    Block.prototype = new Rectangle();
    Block.prototype.constructor=Block;


    Block.BLOCK_SIZE = 30;
    Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO: emplea el patrón de herencia (Block es un Rectangle)

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
        this.blockList=[];
        for (var i=0; i<coords.length;i++){
            this.blockList[i]=new Block(coords[i],color);
        }
    };

    Shape.prototype.draw = function() {

        // TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
        // que forman la Pieza
        for (var i=0;i<this.blockList.length;i++){
            this.blockList[i].draw();
        }
    };
// Por ahora, siempre devolverá true

    Shape.prototype.can_move = function(board, dx, dy) {
        return true;
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
    Tetris.BOARD_COLOR='ivory';

    Tetris.prototype.create_new_shape = function(){

        // TU CÓDIGO AQUÍ:
        // Elegir un nombre de pieza al azar del array Tetris.SHAPES
        // Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
        // Devolver la referencia de esa pieza nueva

        var index= Math.floor(Math.random() * Tetris.SHAPES.length); //Obtengo un indice aleatorio para sacar la pieza al azar
        var tetronimo= Tetris.SHAPES[index];
        return new tetronimo(new Point(Tetris.BOARD_WIDTH/2,0));
    }

    Tetris.prototype.init = function(){

        // Obtener una nueva pieza al azar y asignarla como pieza actual

        this.current_shape = this.create_new_shape()

        // TU CÓDIGO AQUÍ:
        // Pintar la pieza actual en el tablero
        // Aclaración: (Board tiene un método para pintar)
        this.board.draw_shape(this.current_shape);

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

    QUnit.test( "Existencia de Clases", function( assert ) {
        assert.ok( game instanceof Tetris, "Passed!" );
    });

    QUnit.test( "Existencia de atributo current_shape", function( assert ) {
        assert.ok( game.current_shape instanceof Shape, "Es una pieza" );
        for (t of Tetris.SHAPES)
            if (t.name == game.current_shape.constructor.name)
                assert.equal(t, game.current_shape.constructor,"Es una de las 7 posibles");
    });

    QUnit.test('pixel equal test', function(assert) {
        // assert.pixelEqual(canvas, x, y, r, g, b, a, message);
        // ctx.fillStyle = 'black';
        // ctx.fillRect(15*5*2+10,15,4,4);
        assert.pixelEqual(canvas, 15, 45, 255, 255, 255, 255, "White");
        assert.pixelNotEqual(canvas, 15*5*2+10, 10, 255, 255, 255, 255, "! White");

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