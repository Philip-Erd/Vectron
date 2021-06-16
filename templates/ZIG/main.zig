
//import
extern fn setPosition(f32, f32) void;
extern fn drawLineTo(f32, f32) void;
extern fn setColor(i32) void;
extern fn clear(i32) void;
extern fn translate(f32, f32) void;
extern fn scale(f32, f32) void;
extern fn rotate(f32) void;
extern fn setTransform(f32, f32, f32, f32, f32, f32, ) void;
extern fn push() void;
extern fn pop() void;
extern fn setWrapMode(i32) void;
extern fn getInput() i32;
extern fn playTone(f32, f32) void;

//colors
const color_red = 0xFF0000FF;
const color_green = 0x00FF00FF;
const color_blue = 0x0000FFFF;
const color_yellow = 0xFFFF00FF;
const color_grey = 0xAAAAAAFF;
const color_black = 0x000000FF;
const color_white = 0xFFFFFFFF;

//input
const input_a = 1;
const input_b = 2;
const input_start = 4;
const input_select = 8;
const input_up = 16;
const input_down = 32;
const input_left = 64;
const input_right = 128;

//wrap modes
const wrap_off = 0;
const wrap_horizontal = 1;
const wrap_vertical = 2;
const wrap_horizontal_vertical = 3;


//your game

export fn init() void {
    //called once at the beginning
}

export fn update() void {
    //called 60 times a second
}
