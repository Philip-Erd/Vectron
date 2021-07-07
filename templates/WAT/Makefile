# To compile this you need wabt (https://github.com/WebAssembly/wabt)


all: main

clean:
	rm ./*.wasm

main: main.wat
	wat2wasm main.wat -o main.wasm 
