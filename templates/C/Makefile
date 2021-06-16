# To compile this you need clang and wasm-ld (lld package).
# The file 'undefined.txt' includes all undefined symboles, so the linker knows what to do.

CFLAGS = --target=wasm32 -O2 --no-standard-libraries -Wl,--no-entry -Wl,--export=update -Wl,--export=init\
		 -Wl,--allow-undefined-file=undefined.txt

CC = clang

all: main

clean:
	rm ./*.wasm
	rm ./*.wat

main: main.c vectron.h
	${CC} ${CFLAGS} -o main.wasm main.c
