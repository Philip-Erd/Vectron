"use strict"
//config
let gameFile = "wrapping.wasm"
let updateTime = 16;
let audioWaveType = "sine";

//runtime
let vectron_canvas;
let vectron_canvasContext;

let vectron_audioContext = new (window.AudioContext || window.webkitAudioContext)();
let vectron_mainGain = null;

let vectron_game_instance;



//machine values
let vectron_lineColor = "rgba(0, 255, 0, 255)";
let vectron_position = vectron_createVector(0, 0, 1);
let vectron_currentMatrix;
let vectron_matrixStack = [];
let vectron_wrapMode = 0;
let vectron_input = {
    a: false,
    b: false,
    start: false,
    select: false,
    up: false,
    down: false,
    left: false,
    right: false
};

var vectron_start = vectron_intern_init;

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
        setWrapMode: vectron_setWrapMode,
        getInput: vectron_getInput,
        playTone: vectron_playTone
    }
}

//not really working
function vectron_resize() {

    vectron_canvasContext.strokeStyle = vectron_lineColor;
}

function vectron_intern_init() {

    //canvas
    vectron_canvas = document.getElementById("canvas");
    vectron_canvasContext = vectron_canvas.getContext("2d");
    vectron_canvasContext.strokeStyle = vectron_lineColor;

    //matrix stack
    vectron_matrixStack.push(vectron_createMatrix(1, 0, 0, 0, 1, 0, 0, 0, 1));
    vectron_currentMatrix = vectron_matrixStack.pop();

    //audio
    vectron_mainGain = vectron_audioContext.createGain();
    vectron_mainGain.connect(vectron_audioContext.destination);
    vectron_mainGain.gain.value = 0.5;

    //input
    document.addEventListener("keydown", (event) => {
        vectron_keyInput(event.code, vectron_input, true);
    });

    document.addEventListener("keyup", (event) => {
        vectron_keyInput(event.code, vectron_input, false);
    });

    //WASM

    fetch(gameFile).then(response => response.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes, vectron_importObject))
        .then((result) => {

            if (typeof result != "undefined") {

                vectron_game_instance = result.instance;

                if (typeof vectron_game_instance.exports.init != "undefined") {
                    vectron_game_instance.exports.init();
                }

                if (typeof vectron_game_instance.exports.update != "undefined") {
                    window.setInterval(vectron_update, updateTime);
                }
            }else{
                window.alert("could not compile WASM file");
            }
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

    //wrapping
    let lines = vectron_wrapLine(newPosCoords, newCoords);

    vectron_canvasContext.beginPath();
    for (let l of lines) {

        vectron_canvasContext.moveTo(l.start.x, l.start.y);
        vectron_canvasContext.lineTo(l.end.x, l.end.y);

    }
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
    let translation = vectron_createMatrix(1, 0, 0, 0, 1, 0, x, y, 1);
    vectron_currentMatrix = vectron_matrixMultiply(translation, vectron_currentMatrix);
}

function vectron_scale(x, y) {
    let scale = vectron_createMatrix(x, 0, 0, 0, y, 0, 0, 0, 1);
    vectron_currentMatrix = vectron_matrixMultiply(scale, vectron_currentMatrix);
}

function vectron_rotate(angle) {
    let rotation = vectron_createMatrix(Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
    vectron_currentMatrix = vectron_matrixMultiply(rotation, vectron_currentMatrix);
}

function vectron_setTransform(m_00, m_01, m_10, m_11, m_20, m_21) {
    vectron_currentMatrix = vectron_createMatrix(m_00, m_01, 0, m_10, m_11, 0, m_20, m_21, 1);
}

function vectron_push() {
    vectron_matrixStack.push(vectron_currentMatrix);
}

function vectron_pop() {
    if (vectron_matrixStack.length > 0) {
        vectron_currentMatrix = vectron_matrixStack.pop();
    } else {
        console.error("[VECTRON] matrix_stack is empty");
    }
}

function vectron_setWrapMode(mode) {
    if (mode <= 3 && mode >= 0) {
        vectron_wrapMode = mode;
    } else {
        console.error("[VECTRON] wrap mode " + mode + "is not valid");
    }
}

function vectron_getInput() {
    return vectron_inputToNumber(vectron_input);
}

function vectron_playTone(frequency, duration) {
    let osc = vectron_audioContext.createOscillator();
    osc.connect(vectron_mainGain);

    osc.type = audioWaveType;
    osc.frequency.value = frequency;
    osc.start();

    setTimeout(() => {
        osc.stop();
    }, duration);

}

//transforms the given vector and converts the coordinates to the screen space
function vectron_toCanvasCoords(vector) {

    //transform matrix
    let newVector = vectron_vectorMultiply(vectron_currentMatrix, vector);

    //to screen coordinates
    newVector.x = newVector.x * vectron_canvas.width;
    newVector.y = newVector.y * vectron_canvas.height;

    return newVector;
}

//converts a 32bit integer to an rgba-string
function vectron_toColor(num) {
    num >>>= 0;
    var a = num & 0xFF,
        b = (num & 0xFF00) >>> 8,
        g = (num & 0xFF0000) >>> 16,
        r = (num & 0xFF000000) >>> 24;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

//creates a 3x3 matrix (column major)
function vectron_createMatrix(m_00, m_01, m_02, m_10, m_11, m_12, m_20, m_21, m_22) {
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

//creates a 3d vector
function vectron_createVector(x, y, z) {
    return {
        x: x,
        y: y,
        z: z
    };
}

//multiplies the to given matrices
function vectron_matrixMultiply(a, b) {
    return {
        m_00: (a.m_00 * b.m_00) + (a.m_10 * b.m_01) + (a.m_20 * b.m_02),
        m_01: (a.m_01 * b.m_00) + (a.m_11 * b.m_01) + (a.m_21 * b.m_02),
        m_02: (a.m_02 * b.m_00) + (a.m_12 * b.m_01) + (a.m_22 * b.m_02),

        m_10: (a.m_00 * b.m_10) + (a.m_10 * b.m_11) + (a.m_20 * b.m_12),
        m_11: (a.m_01 * b.m_10) + (a.m_11 * b.m_11) + (a.m_21 * b.m_12),
        m_12: (a.m_02 * b.m_10) + (a.m_12 * b.m_11) + (a.m_22 * b.m_12),

        m_20: (a.m_00 * b.m_20) + (a.m_10 * b.m_21) + (a.m_20 * b.m_22),
        m_21: (a.m_01 * b.m_20) + (a.m_11 * b.m_21) + (a.m_21 * b.m_22),
        m_22: (a.m_02 * b.m_20) + (a.m_12 * b.m_21) + (a.m_22 * b.m_22)
    };
}



function vectron_wrapLine(start, end) {
    let lines = [];

    let offsetX;
    let offsetY;

    switch (vectron_wrapMode) {
        //no wrapping
        case 0:
            lines.push({
                start: vectron_createVector(start.x, start.y, start.z),
                end: vectron_createVector(end.x, end.y, end.z)
            });
            break;

        //horizontal wrapping
        case 1:

            offsetX = Math.max((Math.floor(start.x / vectron_canvas.width) * vectron_canvas.width),
                (Math.floor(end.x / vectron_canvas.width) * vectron_canvas.width));
            start.x -= offsetX;
            end.x -= offsetX;

            while (start.x < vectron_canvas.width || end.x < vectron_canvas.width) {
                lines.push({
                    start: vectron_createVector(start.x, start.y, start.z),
                    end: vectron_createVector(end.x, end.y, end.z)
                });
                start.x += vectron_canvas.width;
                end.x += vectron_canvas.width;
            }

            break;

        //vertical wrapping
        case 2:


            offsetY = Math.max((Math.floor(start.y / vectron_canvas.height) * vectron_canvas.height),
                (Math.floor(end.y / vectron_canvas.height) * vectron_canvas.height));

            start.y -= offsetY;
            end.y -= offsetY;

            while (start.y < vectron_canvas.height || end.y < vectron_canvas.height) {
                lines.push({
                    start: vectron_createVector(start.x, start.y, start.z),
                    end: vectron_createVector(end.x, end.y, end.z)
                });
                start.y += vectron_canvas.height;
                end.y += vectron_canvas.height;
            }

            break;

        //horizontal and vertical wrapping
        case 3:


            //offsets
            offsetX = Math.max((Math.floor(start.x / vectron_canvas.width) * vectron_canvas.width),
                (Math.floor(end.x / vectron_canvas.width) * vectron_canvas.width));

            offsetY = Math.max((Math.floor(start.y / vectron_canvas.height) * vectron_canvas.height),
                (Math.floor(end.y / vectron_canvas.height) * vectron_canvas.height));

            start.x -= offsetX;
            end.x -= offsetX;

            start.y -= offsetY;
            end.y -= offsetY;

            let startX = start.x;
            let endX = end.x;

            while (start.y < vectron_canvas.height || end.y < vectron_canvas.height) {
                while (start.x < vectron_canvas.width || end.x < vectron_canvas.width) {
                    lines.push({
                        start: vectron_createVector(start.x, start.y, start.z),
                        end: vectron_createVector(end.x, end.y, end.z)
                    });

                    start.x += vectron_canvas.width;
                    end.x += vectron_canvas.width;
                }

                //reset x coordinates
                start.x = startX;
                end.x = endX


                start.y += vectron_canvas.height;
                end.y += vectron_canvas.height;
            }

            break;
    }

    return lines;
}

//multiplies the given vector with the given matrix
function vectron_vectorMultiply(matrix, vector) {
    return {
        x: (matrix.m_00 * vector.x) + (matrix.m_10 * vector.y) + (matrix.m_20 * vector.z),
        y: (matrix.m_01 * vector.x) + (matrix.m_11 * vector.y) + (matrix.m_21 * vector.z),
        z: (matrix.m_02 * vector.x) + (matrix.m_12 * vector.y) + (matrix.m_22 * vector.z)
    };
}

//Converts the input object in to a 32bit integer, which is required by the input function.
function vectron_inputToNumber(input) {
    let res = 0;

    if (input.a) { res += 1 }
    if (input.b) { res += 2 }
    if (input.start) { res += 4 }
    if (input.select) { res += 8 }
    if (input.up) { res += 16 }
    if (input.down) { res += 32 }
    if (input.left) { res += 64 }
    if (input.right) { res += 128 }

    return res;
}




//maps the keycode on to the given input object. value is if the key is pressed
function vectron_keyInput(keycode, inputObject, value) {
    switch (keycode) {
        case "KeyW":
            inputObject.up = value;
            break;
        case "ArrowUp":
            inputObject.up = value;
            break;

        case "KeyS":
            inputObject.down = value;
            break;
        case "ArrowDown":
            inputObject.down = value;
            break;

        case "KeyA":
            inputObject.left = value;
            break;
        case "ArrowLeft":
            inputObject.left = value;
            break;

        case "KeyD":
            inputObject.right = value;
            break;
        case "ArrowRight":
            inputObject.right = value;
            break;

        case "KeyJ":
            inputObject.a = value;
            break;
        case "KeyK":
            inputObject.b = value;
            break;


        case "KeyU":
            inputObject.start = value;
            break;
        case "KeyI":
            inputObject.select = value;
            break;

        default:
            break;
    }
}