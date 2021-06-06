#using dockcross/web-wasm
#This makefile runs inside the container

CFLAGS = -s EXPORTED_FUNCTIONS='["update", "init"]' -s WASM=1 -s SIDE_MODULE=1 -O2

all: simple line color translation scale rotation transform audio

simple: simple.c
	${CC} ${CFLAGS} -o simple.wasm simple.c

line: line.c vectron.h
	${CC} ${CFLAGS} -o line.wasm line.c

color: color.c vectron.h
	${CC} ${CFLAGS} -o color.wasm color.c

translation: translation.c vectron.h
	${CC} ${CFLAGS} -o translation.wasm translation.c

scale: scale.c vectron.h
	${CC} ${CFLAGS} -o scale.wasm scale.c

rotation: rotation.c vectron.h
	${CC} ${CFLAGS} -o rotation.wasm rotation.c

transform: transform.c vectron.h
	${CC} ${CFLAGS} -o transform.wasm transform.c

audio: audio.c vectron.h
	${CC} ${CFLAGS} -o audio.wasm audio.c