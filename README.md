# Vectron

A fantasy cosole with vector graphics, similar to vector arcade games. This is my first attempt to program
a game engine and is kept very simple on purpose. If this project works well I might make a more feature rich
engine.

It is indented to have a runtime for various systems/consoles. The games are [WASM](https://webassembly.org/) files
with maybe some additional information. To interact with the runtime, the game must export some functions (update, 
maybe draw) and can import functions (getInput, drawShape, etc ).

## Specs

The console has a square screen (resolution depends on the runtime) with RGB color. It can draw with straight 
lines with a fixed with and and a specified color. Single player NES-style input 
(D-Pad, 2 action buttons, 2 menu buttons). It can do simple tones with a fixed frequncy and fixed length.


## importable functions

| **function name** | function |
|------------------------------------------------|---------------------------------------------------|
| **setPosition(f32 x, f32 y)** | Sets the pointer/cursor/electron beam to the given position. |
| **drawLineTo(f32 x, f32 y)** | Draws a line between the current position and the gven position. The current position is set to the given position. |
| **setColor(i32)** | Sets the current color to the given value (RGBA). |
| **clear(i32)** | Clears the screen with the given color (RGBA). Usually called before any drawing for the current frame is done. |
| **translate(f32 x, f32 y)** | Translates the screen transform by the given amount. |
| **scale(f32 x, f32 y)** | Scales the screen transform by the given amount. |
| **rotate(f32 angle)** | Rotates the screen transform by the given amount (angle is in radiants).
| **setTransform(f32 m_00, f32 m_01, f32 m_10, f32 m_11, f32 m_20, f32 m_21)** | Sets the screen transform to the given values. The screen transform is a 3x3 column major matrix. **NOTE:** In this function only the top two rows can be set. The bottom one is by default (0, 0, 1).
| **push()** | Pushes the current screen transform on a stack, so it can be restored later. |
| **pop()** | Pops the last added transform from the stack and sets it as the current screen transform |
| **setWrapMode(i32 mode)** | Sets the wrap mode of the screen. (0: none, 1: horizontal, 2: vertical, 3: horizontal and vertical). No wraping is the default.
| **getInput()** | Gets the input as an i32 where each bit represents if a button is pressed or not. |
| **playTone(f32 frequency, f32 duration)** | Plays a tone withe the given frequncy for the given duration (in ms). |


## exportable function

| **function name** | function |
|---|---|
| **init()** | This function is called once at the beginning. (before the first call of update) |
| **update()** | This function is called 60 times per second by the runtime. |
