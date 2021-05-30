"use strict"
let vectron_canvas;
let vectron_canvasContext;

let vectron_game_instance;
let vectron_game_exports;

let vectron_lineColor = "#00FF00";

var start = vectron_init;

let vectron_importObject = {
    vectron: {
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

    //WASM
    WebAssembly.compileStreaming(fetch("test.wasm"))
    .then(module => WebAssembly.instantiate(module, vectron_importObject))
    .then((instance)=> {
        window.setInterval(vectron_update, 16);
        vectron_game_instance = instance;
        vectron_game_exports = instance.exports;
    });

}


function vectron_update(){
    vectron_game_instance.exports.update();
}

function vectron_setPosition(x, y) {

}

function vectron_drawLineTo(x, y){

}

function vectron_setColor(color) {
    
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