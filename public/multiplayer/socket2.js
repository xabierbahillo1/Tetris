const serverURL = window.location.hostname + ":" +  window.location.port;

const socket2 = io.connect(serverURL, {secure: true});

socket2.emit('client2-connect');

socket2.on('start-game', function() {
        startSendingData();
        game1.init();
    });

socket2.on('receiveGameState', function(gameState){
    game1.limpiarSegundoJugador();
    var grid=gameState.gameGrid;
    var currentShape= gameState.currentShape;
    var previewShape= gameState.previewShape;
    var puntJuego= gameState.puntJuego;
    var nivJuego= gameState.nivJuego;
    //game1.dibujarSegundoJugador(currentShape,null);
    for (coord in grid){
        var bloque=grid[coord];
        game1.dibujarBloqueSegundoJugador(bloque);
    }
    for (var i=0;i<currentShape.blocks.length;i++){
        game1.dibujarBloqueSegundoJugador(currentShape.blocks[i]);
    }
    for (var i=0;i<previewShape.blocks.length;i++){
        game1.dibujarPreviewSegundoJugador(previewShape.blocks[i]);
    }
    game1.actualizarPuntuacionSegundoJugador(puntJuego,nivJuego);
});

socket2.on('receiveGameOver', function(){
    game1.pintarGameOverSegundoJugador();
});


function startSendingData ()  {
    sendDataInterval = setInterval(function () {
        socket2.emit('sendGameState', gameState = {
            gameGrid : game1.Board1.grid,
            currentShape : game1.current_Shape1,
            previewShape : game1.previewShape,
            puntJuego: puntuacion1,
            nivJuego: nivel,
            host : 'client2'
        })
        if (game1.GAMEOVER){ //Si game-over, mando mensaje game-over y dejo de mandar mas datos
            socket2.emit('gameOver',{host:'client2'});
            clearInterval(sendDataInterval);
        }
    }, 5);
}