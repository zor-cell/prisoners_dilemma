#include <iostream>
#include <iomanip>

#include <algorithm>
#include <random>
#include <time.h>

#include <vector>
#include <string>

const int RUNS = 5e5;
#define TRUST false
#define TELL true

//indicates what was made on the last move, -1 means its the first move
int lastA = -1, lastB = -1;
//indicates if a player has told on the other one
bool hasToldA = false, hasToldB = false;
//the decision each player has made (gets reset after RUNS)
std::vector<bool> decisionsA, decisionsB;
//indicates how often each player trusted so far
int numTrustA = 0, numTrustB = 0;

void resetParameters() {
    lastA = -1; lastB = -1;
    hasToldA = false; hasToldB = false;
    decisionsA.resize(0); decisionsB.resize(0);
    numTrustA = 0; numTrustB = 0;
}

void setParameters(bool a, bool b) {
    lastA = a;
    lastB = b;

    if(a) hasToldA = true;
    if(b) hasToldB = true;

    decisionsA.push_back(a);
    decisionsB.push_back(b);

    if(!a) numTrustA++;
    if(!b) numTrustB++;
}

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

bool alwaysTell(bool a) {
    return TELL;
}

bool alwaysTrust(bool a) {
    return TRUST;
}

bool randomTrust(bool a) {
    return rand() % 2;
}

bool titForTatTrust(bool a) {
    if(a) return (lastB == -1 ? TRUST : lastB);
    else return (lastA == -1 ? TRUST : lastA);
}

bool titForTatTell(bool a) {
    if(a) return (lastB == -1 ? TELL: lastB);
    else return (lastA == -1 ? TELL : lastA);
}

bool titForTatMercy(bool a) {
    if(a) return (lastB == -1 ? TRUST : (rand() % 2 ? lastB : TRUST));
    else return (lastA == -1 ? TRUST : (rand() % 2 ? lastA : TRUST));
}

bool repeatingTrust(bool a) {
    int x;
    if(a) x = decisionsA.size() % 3;
    else x = decisionsB.size() % 3;

    return ((x == 0 || x == 1) ? TRUST : TELL);
}

bool repeatingTraitor(bool a) {
    int x;
    if(a) x = decisionsA.size() % 3;
    else x = decisionsB.size() % 3;

    return ((x == 0 || x == 1) ? TELL : TRUST);
}

bool resentfulTrust(bool a) {
    if(a) return (hasToldB ? TELL : TRUST);
    else return (hasToldA ? TELL: TRUST);
}

bool majorityMatters(bool a) {
    if(a) return (decisionsB.size() - numTrustB > numTrustB ? TELL : TRUST);
}

Score calculateScore(bool (*strat1)(bool), bool (*strat2)(bool)) {
    Score score;

    //if true telling, if false trusting
    bool a = strat1(true);
    bool b = strat2(false);

    if(!a && !b) {
        score.a -= 2;
        score.b -= 2;
        score.total -= 4;
    } else if(!a && b) {
        score.a -= 6;
        score.b -= 1;
        score.total -= 7;
    } else if(a && !b) {
        score.a -= 1;
        score.b -= 6;
        score.total -= 7;
    }  else if(a && b) {
        score.a -= 4;
        score.b -= 4;
        score.total -= 8;
    }

    setParameters(a, b);

    return score;
}

int main() {
    srand(time(NULL));
    std::vector<Strategy> strategies;
    std::vector<std::pair<Strategy, Score>> scores;

    strategies.push_back({alwaysTrust, "Trusty Teammate"});
    strategies.push_back({alwaysTell, "Tattletale"});
    strategies.push_back({randomTrust, "Lucky Fluke"});
    strategies.push_back({titForTatTrust, "Trusty Tit For Tat"});
    strategies.push_back({titForTatTell, "Traitorous Tit For Tat"});
    strategies.push_back({resentfulTrust, "Resentful Companion"});
    strategies.push_back({repeatingTrust, "Repeating Trust"});
    strategies.push_back({repeatingTraitor, "Repeating Traitor"});
    strategies.push_back({majorityMatters, "Majority Matters"});
    strategies.push_back({titForTatMercy, "Merciful Tit For Tat"});

    for(int i = 0;i < strategies.size();i++) {
        //average score of scores with every other strategy
        double averageScore = 0;
        Score average;

        for(int j = 0;j < strategies.size();j++) {
            if(strategies[i].f == strategies[j].f) continue;

            resetParameters();

            Score currentScore;
            for(int run = 0;run < RUNS;run++) {
                Score score = calculateScore(strategies[i].f, strategies[j].f);
                currentScore = currentScore + score;
            }

            currentScore = currentScore / static_cast<double>(RUNS);
            average = average + currentScore;

            strategies[i].print();
            strategies[j].print();
            currentScore.print();
        }
        
        average = average / static_cast<double>(strategies.size());
        scores.push_back(std::make_pair(strategies[i], average));
    }

    std::cout << "\nSCORES\n";

    std::sort(scores.begin(), scores.end(), [](const auto l, const auto r) {
        return l.second.total > r.second.total;
    });
    std::cout << "Sorted by total:\n";
    for(auto s : scores) {
        s.first.print(25);
        s.second.print();
    }

    std::sort(scores.begin(), scores.end(), [](const auto l, const auto r) {
        return l.second.a > r.second.a;
    });
    std::cout << "Sorted by individiual:\n";
    for(auto s : scores) {
        s.first.print(25);
        s.second.print();
    }
}