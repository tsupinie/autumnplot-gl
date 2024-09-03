
CFLAGS=-std=c++17

marchingsquares.exe: marchingsquares.cpp
	g++ $(CFLAGS) -g -O0 -DEXECUTABLE marchingsquares.cpp -o marchingsquares.exe

marchingsquares.o: marchingsquares.cpp
	em++ $(CFLAGS) -O3 -DWASM -c marchingsquares.cpp -o marchingsquares.o

marchingsquares.js: marchingsquares.o
	em++ -lembind marchingsquares.o -o marchingsquares.js -sENVIRONMENT=web -sMODULARIZE=1 -sALLOW_MEMORY_GROWTH -sNO_DISABLE_EXCEPTION_CATCHING --emit-tsd marchingsquares_embind.d.ts

exe: marchingsquares.exe
lib: marchingsquares.js
all: lib
clean:
	rm marchingsquares.exe marchingsquares_embind.d.ts marchingsquares.o marchingsquares.wasm