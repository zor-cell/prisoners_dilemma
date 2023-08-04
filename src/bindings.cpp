#include <emscripten/bind.h>
#include "dilemma.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(prisonersdilemma) {
   class_<PrisonersDilemma>("PrisonersDilemma")
   .constructor<int, int, int, int, int>()
   .function("simulate", &PrisonersDilemma::simulate)
   .function("addStrategy", &PrisonersDilemma::addStrategy)
   .property("scores", &PrisonersDilemma::scores)
   ;

   value_object<Score>("Score")
   .field("a", &Score::a)
   .field("b", &Score::b)
   .field("total", &Score::total)
   ;

   value_object<Result>("Result")
   .field("name", &Result::name)
   .field("score", &Result::score)
   ;

   register_vector<Result>("vector<Result>");
}