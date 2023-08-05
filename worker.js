importScripts('dilemma.js');

onmessage = function(message) {
    if(message.data.type == 'CALCULATE') {
        createModule().then(({PrisonersDilemma}) => {
            const runs = message.data.payload.runs;
            const rewards = message.data.payload.rewards;
            const strats = message.data.payload.strats;

            const dilemma = new PrisonersDilemma(runs, rewards.r, rewards.p, rewards.t, rewards.s);
            for(let x of strats) {
              dilemma.addStrategy(x);
            }
            dilemma.simulate();

            let results = new Array(dilemma.scores.size()).fill().map((_, score) => {
                return dilemma.scores.get(score);
            });

            //post message containing a result
            postMessage({
                type: 'RESULT',
                payload: {result: results}
            })
        });
    }
}