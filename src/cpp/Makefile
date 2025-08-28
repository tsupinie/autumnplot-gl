
CFLAGS=-std=c++17

JS_OBJ_FILES=marchingsquares.o main.o
TEST_OBJ_FILES=marchingsquares-debug.o test-debug.o

test-debug.o: test.cpp
	g++ $(CFLAGS) -g -O0 -c test.cpp -o test-debug.o

marchingsquares-debug.o: marchingsquares.cpp marchingsquares.hpp
	g++ $(CFLAGS) -g -O0 -c marchingsquares.cpp -o marchingsquares-debug.o

main.o: main.cpp
	em++ $(CFLAGS) -O3 -c main.cpp -o main.o

marchingsquares.o: marchingsquares.cpp marchingsquares.hpp
	em++ $(CFLAGS) -O3 -c marchingsquares.cpp -o marchingsquares.o

marchingsquares.exe: $(TEST_OBJ_FILES)
	g++ $(TEST_OBJ_FILES) -o marchingsquares.exe

marchingsquares.js: $(JS_OBJ_FILES)
	em++ -lembind $(JS_OBJ_FILES) -o marchingsquares.js -sENVIRONMENT=web -sMODULARIZE=1 -sALLOW_MEMORY_GROWTH -sNO_DISABLE_EXCEPTION_CATCHING --emit-tsd marchingsquares_embind.d.ts

check: marchingsquares.exe
js: marchingsquares.js
all: lib
clean:
	rm marchingsquares.exe marchingsquares_embind.d.ts $(JS_OBJ_FILES) $(TEST_OBJ_FILES) marchingsquares.wasm