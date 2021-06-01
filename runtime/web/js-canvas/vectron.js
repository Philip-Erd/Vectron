"use strict"
//config
const updateTime = 1000;

//runtime
let vectron_canvas;
let vectron_canvasContext;

let vectron_game_instance;
let vectron_game_exports;


//machine values
let vectron_lineColor = "#00FF00FF";
let vectron_position = {x: 0.0, y: 0.0};

var start = vectron_init;

let vectron_importObject = {
    env: {
        setPosition: vectron_setPosition,
        drawLineTo: vectron_drawLineTo,
        setColor: vectron_setColor,
        clear: vectron_clear,
        translate: vectron_translate,
        scale: vectron_scale,
        rotate: vectron_rotate,
        setTransform: vectron_setTransform,
        push: vectron_push,
        pop: vectron_pop,
        getInput: vectron_getInput,
        playTone: vectron_playTone
    }
}

function vectron_init() {
    console.log("init");
    //canvas
    vectron_canvas = document.getElementById("canvas");
    vectron_canvasContext = vectron_canvas.getContext("2d");
    vectron_canvasContext.strokeStyle = vectron_lineColor;

    //WASM
    WebAssembly.compileStreaming(fetch("line.wasm"))
    .then(module => WebAssembly.instantiate(module, vectron_importObject))
    .then((instance)=> {
        window.setInterval(vectron_update, updateTime);
        vectron_game_instance = instance;
        vectron_game_exports = instance.exports;
    });

}


function vectron_update(){
    vectron_canvasContext.beginPath();
    vectron_game_instance.exports.update();
    vectron_canvasContext.stroke();

}

function vectron_setPosition(x, y) {
    vectron_position.x = x;
    vectron_position.y = y;

    let newCoords = vectron_toCanvasCoords(vectron_position.x, vectron_position.y);  
    vectron_canvasContext.moveTo(newCoords.x, newCoords.y);
    console.log("position: " + vectron_position.x + ", " + vectron_position.y);
}

function vectron_drawLineTo(x, y){

    let newCoords = vectron_toCanvasCoords(x, y);
    vectron_canvasContext.lineTo(newCoords.x, newCoords.y);
    vectron_position.x = newCoords.x;
    vectron_position.y = newCoords.y;

}

function vectron_setColor(color) {
    vectron_lineColor = color;
    vectron_canvasContext.strokeStyle = color;
}

function vectron_clear(color) {
    //TODO: color conversion
    vectron_canvasContext.fillStyle = color;
    vectron_canvasContext.fillRect(0, 0, vectron_canvas.width, vectron_canvas.height);

}

function vectron_translate(x, y) {
    
}

function vectron_scale(x, y) {

}

function vectron_rotate(angle){

}

function vectron_setTransform(m_00, m_01, m_10, m_11, m_20, m_21){

}

function vectron_push(){

}

function vectron_pop(){

}

function vectron_setWrapMode(mode){

}

function vectron_getInput(){

}

function vectron_playTone(frequency, duration){

}


function vectron_toCanvasCoords(x, y){

    //TODO: transfor matrix

    let newx = x*vectron_canvas.width;
    let newy = y*vectron_canvas.height;
    return {x : newx, y: newy};
}