#using dockcross/web-wasm
#This makefile runs inside the container

CFLAGS = -s EXPORTED_FUNCTIONS='["update"]' -s WASM=1 -s SIDE_MODULE=1 -O2

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