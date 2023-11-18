
CFLAGS=-std=c++14 -O2

marchingsquares: marchingsquares.cpp
	g++ $(CFLAGS) -DEXECUTABLE marchingsquares.cpp -o marchingsquares

marchingsquares.o: marchingsquares.cpp
	em++ $(CFLAGS) -DWASM -c marchingsquares.cpp -o marchingsquares.o

marchingsquares.js: marchingsquares.o
	em++ -lembind marchingsquares.o -o marchingsquares.js -sENVIRONMENT=web -sMODULARIZE=1 -sALLOW_MEMORY_GROWTH -sNO_DISABLE_EXCEPTION_CATCHING --embind-emit-tsd marchingsquares_embind.d.ts
	mv marchingsquares.wasm ../../public/.

lib: marchingsquares.js
all: marchingsquares
clean:
	rm marchingsquares marchingsquares_embind.d.ts marchingsquares.o ../../public/marchingsquares.wasm