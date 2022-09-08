#include <emscripten/bind.h>
#include "dilemma.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(prisonersdilemma) {
   class_<PrisonersDilemma>("PrisonersDilemma")
   .constructor<int>()
   .function("simulate", &PrisonersDilemma::simulate)
   .function("addStrategy", &PrisonersDilemma::addStrategy);
}