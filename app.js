function App() {
    const [runs, setRuns] = React.useState(1000);
    const [strats, setStrats] = React.useState([]);
    const [rewards, setRewards] = React.useState({r: -1, p: -2, t: 0, s: -3})
    const [scores, setScores] = React.useState([{name: "-", score: {a: 0, b: 0, total: 0}}]);

    function onRunsChange(event) {
      setRuns(Number(event.target.value));
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
      let tempRewards = {r: 0, p: 0, t: 0, s: 0};
      for(let child of event.target.parentNode.children) {
        if(child.getAttribute("name") == "rewards-r") tempRewards.r = child.value;
        else if(child.getAttribute("name") == "rewards-p") tempRewards.p = child.value;
        else if(child.getAttribute("name") == "rewards-t") tempRewards.t = child.value;
        else if(child.getAttribute("name") == "rewards-s") tempRewards.s = child.value;
      }
      
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
      //Wait for module to initialize,
      createModule().then(({PrisonersDilemma}) => {
          // Perform computation
          const dilemma = new PrisonersDilemma(runs); //pass rewards
          for(let x of strats) {
            dilemma.addStrategy(x);
          }
          dilemma.simulate();

          let results = new Array(dilemma.scores.size()).fill().map((_, score) => {
            return dilemma.scores.get(score);
          });
          /*let prettyResults = "";
          for(let result of results) {
            prettyResults += result.name + " ";
            prettyResults += result.score.a.toFixed(6) + " ";
            prettyResults += result.score.b.toFixed(6) + " ";
            prettyResults += result.score.total.toFixed(6) + "\n";
          }*/
          results.sort((l, r) => {
            l.name < r.name ? 1 : -1;
          });
          setScores(results);
          //console.log(results, scores);
          //document.getElementById("results").innerHTML = prettyResults;
      });
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
              <span>R: "Rewarding Payoff" for both denying, P: "Punising Payoff" for both confessing, T: "Tempting Payoff" for 
                confessing while the companion receives S: "Suckers's Payoff" for denying. For the prisoner's dilemma 
                in the classical sense, the following must apply: <code>T &gt; R &gt; P &gt; S</code>. The following table presents
                the definition of each letter visually.
              </span>
              <img src="assets/payoff_table.PNG"></img>
              <div id="rewards">
                <span>R</span>
                <input name="rewards-r" type="range" min="-10" max="10" value="{rewards.r}" onChange={onRewardsChange}></input>
                <span>P</span>
                <input name="rewards-p" type="range" min="-10" max="10" value="{rewards.p}" onChange={onRewardsChange}></input>
                <span>T</span>
                <input name="rewards-t" type="range" min="-10" max="10" value="{rewards.t}" onChange={onRewardsChange}></input>
                <span>S</span>
                <input name="rewards-s" type="range" min="-10" max="10" value="{rewards.s}" onChange={onRewardsChange}></input>
              </div>
              <input type="submit" value="Run Simulation" />
            </div>
          </form>
        </section>

        <section className="results">
          <div>Computing results...</div>

          <table className="results-table">
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
            {console.log("render", scores)}
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