#include "dilemma.hpp"

Data data;

PrisonersDilemma::PrisonersDilemma(int _runs) : runs(_runs) {
    srand(time(NULL));

    rewards = {-1, -2, 0, -3};
    data.reset();
}

void PrisonersDilemma::addStrategy(int strategy) {
    if(strategy == 0) strategies.push_back({s1, "Trusty Teammate"});
    else if(strategy == 1) strategies.push_back({s2, "Tattletale"});
    else if(strategy == 2) strategies.push_back({s3, "Lucky Fluke"});
    else if(strategy == 3) strategies.push_back({s4, "Trusty Tit for Tat"});
    else if(strategy == 4) strategies.push_back({s5, "Traitorous Tit for Tat"});
    else if(strategy == 5) strategies.push_back({s6, "Merciful Tit for Tat"});
    else if(strategy == 6) strategies.push_back({s7, "Grim Trigger"});
    else if(strategy == 7) strategies.push_back({s8, "Repeating Trust"});
    else if(strategy == 8) strategies.push_back({s9, "Repeating Traitor"});
    else if(strategy == 9) strategies.push_back({s10, "Majority Matters"});
}

Score PrisonersDilemma::calculateRun(bool (*strat1)(bool), bool (*strat2)(bool)) {
    Score score;

    //if true telling, if false trusting
    bool a = strat1(true);
    bool b = strat2(false);

    if(!a && !b) {
        score.a += rewards.r;
        score.b += rewards.r;
    } else if(!a && b) {
        score.a += rewards.s;
        score.b += rewards.t;
    } else if(a && !b) {
        score.a += rewards.t;
        score.b += rewards.s;
    }  else if(a && b) {
        score.a += rewards.p;
        score.b += rewards.p;
    }
    score.total += score.a + score.b;

    //set data
    data.decisionsA.push_back(a);
    data.decisionsB.push_back(b);

    if(a) data.hasToldA = true;
    if(b) data.hasToldB = true;

    if(!a) data.numTrustA++;
    if(!b) data.numTrustB++;

    return score;
}

void PrisonersDilemma::simulate() {
    for(int i = 0;i < strategies.size();i++) {
        for(int j = 0;j < strategies.size();j++) {
            data.reset();
            //calculate average score of every run
            Score currentScore;
            for(int run = 0;run < runs;run++) {
                Score score = calculateRun(strategies[i].f, strategies[j].f);
                currentScore = currentScore + score;
            }
            currentScore = currentScore / static_cast<double>(runs);

            //print scores
            strategies[i].print();
            strategies[j].print();
            currentScore.print();
        }
    }
}

//strategies

bool s1(bool a) {
    return TRUST;
}
bool s2(bool a) {
    return TELL;
}
bool s3(bool a) {
    return rand() % 2;
}
bool s4(bool a) {
    std::vector<bool> decisions = (a ? data.decisionsB : data.decisionsA);

    return (decisions.size() == 0 ? TRUST : decisions[decisions.size() - 1]);
}
bool s5(bool a) {
    std::vector<bool> decisions = (a ? data.decisionsB : data.decisionsA);

    return (decisions.size() == 0 ? TELL : decisions[decisions.size() - 1]);
}
bool s6(bool a) {
    std::vector<bool> decisions = (a ? data.decisionsB : data.decisionsA);

    return (decisions.size() == 0 ? TRUST : (decisions[decisions.size() - 1] ? (rand() % 10) : TRUST));
}
bool s7(bool a) {
    bool hasTold = (a ? data.hasToldB : data.hasToldA);
    
    return hasTold;
}
bool s8(bool a) {
    int s = (a ? data.decisionsB.size() % 3 : data.decisionsA.size() % 3);

    return (s == 2 ? TELL : TRUST);
}
bool s9(bool a) {
    int s = (a ? data.decisionsB.size() % 3 : data.decisionsA.size() % 3);

    return (s == 2 ? TRUST : TELL);
}
bool s10(bool a) {
    int numTrust = (a ? data.numTrustB : data.numTrustA);
    std::vector<bool> decisions = (a ? data.decisionsB : data.decisionsA);

    return (decisions.size() - numTrust > numTrust ? TELL : TRUST);
}