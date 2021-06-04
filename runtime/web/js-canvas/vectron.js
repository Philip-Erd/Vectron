"use strict"
//config
const updateTime = 1000;

//runtime
let vectron_canvas;
let vectron_canvasContext;

let vectron_game_instance;
let vectron_game_exports;
let vectron_game_memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

//machine values
let vectron_lineColor = "rgba(0, 255, 0, 255)";
let vectron_position = { x: 0.0, y: 0.0 };

var start = vectron_init;

let vectron_importObject = {
    //emscripten style
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
        playTone: vectron_playTone,

        __memory_base: 0,
        memory: vectron_game_memory
    }
}

function vectron_init() {

    //canvas
    vectron_canvas = document.getElementById("canvas");
    vectron_canvasContext = vectron_canvas.getContext("2d");
    vectron_canvasContext.strokeStyle = vectron_lineColor;

    //WASM
    WebAssembly.compileStreaming(fetch("color.wasm"))
        .then(module => WebAssembly.instantiate(module, vectron_importObject))
        .then((instance) => {
            window.setInterval(vectron_update, updateTime);
            vectron_game_instance = instance;
            vectron_game_exports = instance.exports;
        });

}


function vectron_update() {
    vectron_game_instance.exports.update();

}

function vectron_setPosition(x, y) {
    vectron_position.x = x;
    vectron_position.y = y;
}

function vectron_drawLineTo(x, y) {

    let newCoords = vectron_toCanvasCoords(x, y);
    let newPosCoords = vectron_toCanvasCoords(vectron_position.x, vectron_position.y);

    vectron_canvasContext.beginPath();
    vectron_canvasContext.moveTo(newPosCoords.x, newPosCoords.y);
    vectron_canvasContext.lineTo(newCoords.x, newCoords.y);
    vectron_canvasContext.stroke();

    vectron_position.x = x;
    vectron_position.y = y;

}

function vectron_setColor(color) {
    vectron_lineColor = vectron_toColor(color);
    vectron_canvasContext.strokeStyle = vectron_lineColor;
    ;
}

function vectron_clear(color) {
    vectron_canvasContext.fillStyle = vectron_toColor(color);
    vectron_canvasContext.fillRect(0, 0, vectron_canvas.width, vectron_canvas.height);

}

function vectron_translate(x, y) {

}

function vectron_scale(x, y) {

}

function vectron_rotate(angle) {

}

function vectron_setTransform(m_00, m_01, m_10, m_11, m_20, m_21) {

}

function vectron_push() {

}

function vectron_pop() {

}

function vectron_setWrapMode(mode) {

}

function vectron_getInput() {

}

function vectron_playTone(frequency, duration) {

}


function vectron_toCanvasCoords(x, y) {

    //TODO: transform matrix

    let newx = x * vectron_canvas.width;
    let newy = y * vectron_canvas.height;
    return { x: newx, y: newy };
}

function vectron_toColor(num) {
    num >>>= 0;
    var a = num & 0xFF,
        b = (num & 0xFF00) >>> 8,
        g = (num & 0xFF0000) >>> 16,
        r = (num & 0xFF000000) >>> 24;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}