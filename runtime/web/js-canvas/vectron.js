"use strict"
//config
const updateTime = 1000;

//runtime
let vectron_canvas;
let vectron_canvasContext;
let vectron_currentMatrix;
let vectron_matrixStack = [];

let vectron_game_instance;
let vectron_game_exports;
let vectron_game_memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

//machine values
let vectron_lineColor = "rgba(0, 255, 0, 255)";
let vectron_position = vectron_createVector(0, 0, 1);

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

    vectron_matrixStack.push(vectron_createMatrix(1, 0, 0, 0, 1, 0, 0, 0, 1));
    vectron_currentMatrix = vectron_matrixStack.pop();

    //WASM
    WebAssembly.compileStreaming(fetch("line.wasm"))
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

    let newCoords = vectron_toCanvasCoords(vectron_createVector(x, y, 1));
    let newPosCoords = vectron_toCanvasCoords(vectron_position);

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
    vectron_currentMatrix = vectron_createMatrix(m_00, m_01, 0, m_10, m_11, 0, m_20, m_21, 1);
}

function vectron_push() {
    vectron_matrixStack.push(vectron_currentMatrix);
}

function vectron_pop() {
    if(vectron_matrixStack.length > 0){
        vectron_currentMatrix = vectron_matrixStack.pop();
    }
}

function vectron_setWrapMode(mode) {

}

function vectron_getInput() {

}

function vectron_playTone(frequency, duration) {

}


function vectron_toCanvasCoords(vector) {

    //TODO: transform matrix
    let newVector = vectron_vectorMultiply(vectron_currentMatrix, vector);

    newVector.x = newVector.x * vectron_canvas.width;
    newVector.y = newVector.y * vectron_canvas.height;

    return newVector;
}

function vectron_toColor(num) {
    num >>>= 0;
    var a = num & 0xFF,
        b = (num & 0xFF00) >>> 8,
        g = (num & 0xFF0000) >>> 16,
        r = (num & 0xFF000000) >>> 24;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

function vectron_createMatrix(m_00, m_01, m_02, m_10, m_11, m_12, m_20, m_21, m_22){
    return {
        m_00: m_00,
        m_01: m_01,
        m_02: m_02,
        m_10: m_10,
        m_11: m_11,
        m_12: m_12,
        m_20: m_20,
        m_21: m_21,
        m_22: m_22
    };
}

function vectron_createVector(x, y, z){
    return {
        x: x,
        y: y,
        z: z
    };
}

function vectron_matrixMultiply(a, b){
    return {
        m_00: (a.m_00 * b.m_00) + (a.m_10 * b.m_01) + (a.m_20 * b.m_02),
        m_01: (a.m_00 * b.m_10) + (a.m_10 * b.m_11) + (a.m_20 * b.m_12),
        m_02: (a.m_00 * b.m_20) + (a.m_10 * b.m_21) + (a.m_20 * b.m_22),
        m_10: (a.m_01 * b.m_00) + (a.m_11 * b.m_01) + (a.m_21 * b.m_02),
        m_11: (a.m_01 * b.m_10) + (a.m_11 * b.m_11) + (a.m_21 * b.m_12),
        m_12: (a.m_01 * b.m_20) + (a.m_11 * b.m_21) + (a.m_21 * b.m_22),
        m_20: (a.m_02 * b.m_00) + (a.m_12 * b.m_01) + (a.m_22 * b.m_02),
        m_21: (a.m_02 * b.m_10) + (a.m_12 * b.m_11) + (a.m_22 * b.m_12),
        m_22: (a.m_02 * b.m_20) + (a.m_12 * b.m_21) + (a.m_22 * b.m_22)
    };
}

function vectron_vectorMultiply(matrix, vector){
    return{
        x: (matrix.m_00 * vector.x) + (matrix.m_10 * vector.y) + (matrix.m_20 * vector.z),
        y: (matrix.m_01 * vector.x) + (matrix.m_11 * vector.y) + (matrix.m_21 * vector.z),
        z: (matrix.m_02 * vector.x) + (matrix.m_12 * vector.y) + (matrix.m_22 * vector.z)
    };
}