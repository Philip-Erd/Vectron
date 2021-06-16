# To compile this you only need zig.
# You can, of course, use the zig build system
# but I dont't know how to use it, so I used make.


ZIGFLAGS = -target wasm32-freestanding -dynamic
CC = zig


all: main

clean:
	rm ./*.wasm
	rm ./*.wat

main: main.zig
	${CC} build-lib ${ZIGFLAGS} main.zig 