function test() {

    const jsdom = require("jsdom");
    const {JSDOM} = jsdom;
    const dom = new JSDOM(`<!doctype html>
<html xmlns="http://www.w3.org/1999/html">
<head>
   <title>Tetris</title>
</head>
<body>
    <canvas id="canvas" width="300" height="600"></canvas>
</body>`);

// ============== Point =======================

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

// ============== Rectangle ====================
    function Rectangle() {
    }

    Rectangle.prototype.init = function (p1, p2) {
        this.px = p1.x;
        this.py = p1.y;
        this.width = p2.x - p1.x;
        this.height = p2.y - p1.y;
        this.lineWidth = 1;
        this.color = 'black';
    }

    Rectangle.prototype.draw = function () {
        /*   TU CÓDIGO AQUÍ: pinta un rectángulo del color actual en pantalla
             en la posición px,py, con la anchura y altura actual y una línea
             de anchura=lineWidth. Observa que en este ejemplo, ctx es el nombre
             de la variable global contexto */
        ctx.fillStyle = this.color;
        ctx.fillRect(this.px, this.py, this.width, this.height);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = 'black'; //Linea de borde negra
        ctx.strokeRect(this.px, this.py, this.width, this.height);
    }


    Rectangle.prototype.setLineWidth = function (width) {
        this.lineWidth = width
    }
    Rectangle.prototype.setFill = function (color) {
        this.color = color
    }

// ============== Block ===============================

    function Block(pos, color) {
        /* TU CÓDIGO AQUÍ: constructor de la clase Block
           pos en coordenadas del tablero. color = color con el que pintar el bloque
           Internamente genera dos puntos (en coordenadas pixel) y llama al
           método init de Rectangle, pasándole estos 2 puntos como parámetros
           Sería interesante que usaras las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH
           para establecer el ancho del bloque y de la línea de contorno respectivamente. */
        //Calculo posicion inicial
        this.x = pos.x;
        this.y = pos.y;
        var newx = pos.x * Block.BLOCK_SIZE + Block.OUTLINE_WIDTH;
        var newy = pos.y * Block.BLOCK_SIZE + Block.OUTLINE_WIDTH;
        this.init(new Point(newx, newy), new Point(newx + Block.BLOCK_SIZE, newy + Block.BLOCK_SIZE)); //Paso de cuadrado a pixeles
        this.color = color;
        this.lineWidth = Block.OUTLINE_WIDTH;
    }

    Block.BLOCK_SIZE = 30;
    Block.OUTLINE_WIDTH = 2;

    Block.prototype = new Rectangle();
    Block.prototype.constructor = Block;
// TU CÓDIGO AQUÍ: patrón de herencia (Block es un Rectangle)


// ===== main ====

// variables globales para acceder al canvas 
    var canvas = dom.window.document.getElementById("canvas")
    var ctx = canvas.getContext("2d");

    var block1 = new Block(new Point(0, 0), 'red'),
        block2 = new Block(new Point(1, 1), 'blue'),
        block3 = new Block(new Point(2, 2), 'green');

    block1.draw();
    block2.draw();
    block3.draw();

    QUnit.test("Subclases", function (assert) {
        assert.ok(block1 instanceof Block, "Passed!");
        assert.ok(block1 instanceof Rectangle, "Passed!");

        assert.ok(block2 instanceof Block, "Passed!");
        assert.ok(block2 instanceof Rectangle, "Passed!");

    })

    QUnit.test('pixel equal test', function (assert) {
        //assert.pixelEqual(canvas, x, y, r, g, b, a, message);

        assert.pixelEqual(canvas, 15, 15, 255, 0, 0, 255, "Passed!");
        assert.pixelEqual(canvas, 45, 45, 0, 0, 255, 255, "Passed!");
        assert.pixelEqual(canvas, 75, 75, 0, 128, 0, 255, "Passed!");
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