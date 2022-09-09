importScripts('dilemma.js');

onmessage = function(message) {
    if(message.data.type == 'CALCULATE') {
        createModule().then(({PrisonersDilemma}) => {
            const runs = message.data.payload.runs;
            const strats = message.data.payload.strats;

            const dilemma = new PrisonersDilemma(runs); //pass rewards
            for(let x of strats) {
              dilemma.addStrategy(x);
            }
            dilemma.simulate();

            //post message containing a result
            postMessage({
                type: 'RESULT',
                payload: {result: "test"}
            })
        });
    }
}