
CFLAGS=-std=c++14 -O2

marchingsquares: marchingsquares.cpp
	g++ $(CFLAGS) -DEXECUTABLE marchingsquares.cpp -o marchingsquares

marchingsquares.o: marchingsquares.cpp
	em++ $(CFLAGS) -c marchingsquares.cpp -o marchingsquares.o

marchingsquares.js: marchingsquares.o
	em++ marchingsquares.o -o marchingsquares.js -sENVIRONMENT=web -sMODULARIZE=1 -sALLOW_MEMORY_GROWTH \
		-sEXPORTED_FUNCTIONS="['_makeContoursFloat32']"

lib: marchingsquares.js
all: marchingsquares