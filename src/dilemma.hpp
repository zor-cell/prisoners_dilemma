#ifndef H_PRISONERSDILEMMA_HPP
#define H_PRISONERSDILEMMA_HPP

#include "stdafx.hpp"

struct Strategy {
    bool (*f)(bool);
    std::string name;

    void print(int length = 25) {
        std::cout << name;

        int d = length - name.size();
        for(int i = 0;i < d;i++) {
            std::cout << " ";
        }
    }
};

struct Score {
    double a = 0, b = 0, total = 0;

    void print() {
        std::cout << std::fixed << std::setprecision(6) << "a: " << a << " b: " << b << " t: " << total << "\n";
    }

    Score operator +(Score& other) {
        Score res;
        res.a = a + other.a;
        res.b = b + other.b;
        res.total = total + other.total;

        return res;
    }

    Score operator /(double other) {
        Score res;
        res.a = a / other;
        res.b = b / other;
        res.total = total / other;
        
        return res;
    }
};

struct Reward {
    //cooperation reward (if both cooperate)
    int r;
    //deflection punishment (if both defect)
    int p;
    //temptation payoff (if defects and other cooperates)
    int t;
    //suckers payoff (if cooperates and other defects)
    int s;
};

struct Data {
    //decision made until now
    std::vector<bool> decisionsA, decisionsB;
    //true if player has told
    bool hasToldA, hasToldB;
    //how often player trusted
    int numTrustA, numTrustB;

    void reset() {
        decisionsA.clear();
        decisionsB.clear();

        hasToldA = false;
        hasToldB = false;

        numTrustA = 0;
        numTrustB = 0;
    }
};

//data required for some strategies to be efficient
extern Data data;

class PrisonersDilemma {
    private:
        //how often every stragey play against every other
        int runs;
        //strategy functions and their name
        std::vector<Strategy> strategies;
        //reward or penalties
        Reward rewards;

    public:
        PrisonersDilemma(int _runs);

        void addStrategy(int strategy);
        Score calculateRun(bool (*strat1)(bool), bool (*strat2)(bool));
        void simulate();
};
#endif

//strategies
//always trust
bool s1(bool a);
//always tell
bool s2(bool a);
//50% chance of trusting
bool s3(bool a);
//tit for tat, start with trusting
bool s4(bool a);
//tit for tat, start with telling
bool s5(bool a);
//tit for tat, start with trusting, if other told only 10% chance of telling
bool s6(bool a);
//start by trusting, as soon as other tells always tell
bool s7(bool a);
//periodically repeat: tell, tell, trust
bool s8(bool a);
//periodically repeat: trust, trust, tell
bool s9(bool a);
//start with trusting, pick the choice other picked more often, tie = trust
bool s10(bool a);