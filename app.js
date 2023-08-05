function App() {
    const [runs, setRuns] = React.useState(1000);
    const [strats, setStrats] = React.useState([]);
    const [rewards, setRewards] = React.useState({r: -2, p: -4, t: -1, s: -6})
    const [scores, setScores] = React.useState([{name: "-", score: {a: 0, b: 0, total: 0}}]);

    function onRunsChange(event) {
      const num = Number(event.target.value);
      setRuns((num <= 1000000 ? num : 1000000));
    }

    function onStratsChange(event) {
      let selected = [];
      for(let option of event.target.options) {
        if(option.selected) selected.push(parseInt(option.value));
      }

      setStrats(selected);
    }
    
    //select every option of strategies select and update strats
    function onSelectAll(event) {
      let s = document.getElementsByName("strategies")[0];

      let selected = [];
      for(let option of s.options) {
        option.selected = true;
        selected.push(parseInt(option.value));
      }

      setStrats(selected);
    }

    function onRewardsChange(event) {
      let tempRewards = {};

      let r = document.getElementById("rewards-r").value;
      tempRewards.r = r;
      let p = document.getElementById("rewards-p").value;
      tempRewards.p = p;
      let t = document.getElementById("rewards-t").value;
      tempRewards.t = t;
      let s = document.getElementById("rewards-s").value;
      tempRewards.s = s;
      
      setRewards(tempRewards);
    }

    function onSortChange(sortBy) {
      let tempScores = scores;
      console.log("sort");

      tempScores.sort((l, r) => {
        if(sortBy == "N") return l.name < r.name ? 1 : -1;
        else if(sortBy == "A") return l.score.a < r.score.a ? 1 : -1;
        else if(sortBy == "B") return l.score.b < r.score.b ? 1 : -1;
        else if(sortBy == "T") return l.score.total < r.score.total ? 1 : -1;
      });

      //console.log(tempScores);
      setScores(tempScores);
    }

    function handleSubmit(event) {
      event.preventDefault();

      document.getElementById("result").innerHTML = "Computing Results...";
      document.getElementById("results-table").style.opacity = 0.15;

      const worker = new Worker('worker.js');
        worker.postMessage({
            type: 'CALCULATE',
            payload: {
                runs: runs,
                rewards: rewards,
                strats: strats,
            }
        });

        //receive result as message from web worker
        worker.onmessage = function(message) {
            if(message.data.type === 'RESULT') {
                const results = message.data.payload.result;
                results.sort((l, r) => {
                  l.name < r.name ? 1 : -1;
                });

                setScores(results);

                document.getElementById("result").innerHTML = "Results Computed!";
                document.getElementById("results-table").style.opacity = 1;
            }
        }
    }

    return (
      <main>
        <h1>Prisoner's Dilemma: Simulation</h1>
        <section className="parameters">
          <h2>Parameters</h2>
          <form onSubmit={handleSubmit}>
            <div className="strategies-main">
              <h3>Runs</h3>
              <input name="runs" type="number" value={runs} onChange={onRunsChange}/>

              <h3>Strategies</h3>
              <span>(Hold down CTRL to select multiple)</span>
              <select className="strategies" name="strategies" multiple onChange={onStratsChange}>
                <option value="0">Trusty Teammate</option>
                <option value="1">Tattletale</option>
                <option value="2">Lucky Fluke</option>
                <option value="3">Trusty Tit For Tat</option>
                <option value="4">Traitorous Tit For Tat</option>
                <option value="5">Merciful Tit For Tat</option>
                <option value="6">Grim Trigger</option>
                <option value="7">Repeated Trust</option>
                <option value="8">Repeated Traitor</option>
                <option value="9">Majority Matters</option>
              </select>
              <input type="button" value="Select All" onClick={onSelectAll}></input>

              <h3>Payoffs</h3>
              <p>R: "Rewarding Payoff" for both denying <br></br>
                    P: "Punising Payoff" for both confessing <br></br> 
                    T: "Tempting Payoff" for confessing while the companion receives S: "Suckers's Payoff" for denying <br></br> 
                    For the prisoner's dilemma 
                in the classical sense, the following must apply: <code>T &gt; R &gt; P &gt; S</code>. The following table presents
                the definition of each letter visually.
              </p>
              <img src="assets/payoff_table.PNG"></img>
              <div id="rewards">
                <span>R</span>
                <input id="rewards-r" type="number" value={rewards.r} onChange={onRewardsChange}></input>
                <span>P</span>
                <input id="rewards-p" type="number" defaultValue={rewards.p} onChange={onRewardsChange}></input>
                <span>T</span>
                <input id="rewards-t" type="number" defaultValue={rewards.t} onChange={onRewardsChange}></input>
                <span>S</span>
                <input id="rewards-s" type="number" defaultValue={rewards.s} onChange={onRewardsChange}></input>
              </div>
              <input type="submit" value="Run Simulation" />
            </div>
          </form>
        </section>

        <section className="results">
          <div id="result">No results...</div>

          <table id="results-table">
            <caption>Results of {runs} runs</caption>
            <thead>
              <tr>
                <th onClick={() => onSortChange("N")}>Name</th>
                <th onClick={() => onSortChange("A")}>A</th>
                <th onClick={() => onSortChange("B")}>B</th>
                <th onClick={() => onSortChange("T")}>Total</th>
              </tr>
          </thead>
          <tbody>
            {
              scores.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.name}</td>
                  <td>{val.score.a.toFixed(6)}</td>
                  <td>{val.score.b.toFixed(6)}</td>
                  <td>{val.score.total.toFixed(6)}</td>
                </tr>
              )
              })
            }
          </tbody>
        </table>
      </section>
      </main>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);