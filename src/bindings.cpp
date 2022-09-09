#include <emscripten/bind.h>
#include "dilemma.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(prisonersdilemma) {
   class_<PrisonersDilemma>("PrisonersDilemma")
   .constructor<int>()
   .function("simulate", &PrisonersDilemma::simulate)
   .function("addStrategy", &PrisonersDilemma::addStrategy)
   .property("scores", &PrisonersDilemma::scores)
   ;

   value_object<Score>("Score")
   .field("a", &Score::a)
   .field("b", &Score::b)
   .field("total", &Score::total)
   ;

   register_vector<Score>("vector<Score>");
}