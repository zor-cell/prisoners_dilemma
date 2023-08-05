start python localhost, run in root directory:
python -m http.server

compile cpp files to wasm, run in directory dir/emsdk:
.\emsdk activate latest
em++ -I. -o ../../dilemma.js -Oz -s MODULARIZE=1 -s EXPORT_NAME=createModule --bind ../../src/dilemma.cpp ../../src/bindings.cpp