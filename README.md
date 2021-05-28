# Vectron

A fantasy cosole with vector graphics, similar to vector arcade games. This is my first attempt to program
a game engine and is kept very simple on purpose. If this project works well I might make a more feature rich
engine.

It is indented to have a runtime for various systems/consoles. The games are [WASM](https://webassembly.org/) files
with maybe some additional information. To interact with the runtime, the game must export some functions (update, 
maybe draw) and can import functions (getInput, drawShape, etc ).

## Specs

The console has a square screen (reswolution depends on the runtime) with RGB color. It can draw with straight 
lines with a fixed with and and a specified color. Single player NES-style input 
(D-Pad, 2 action buttons, 2 menu buttons). It can do simple tones with a fixed frequncy and fixed length.
