function Heading() {
    const title = "Prisoner's Dilemma: Simulation";
    return <h1>{title}</h1>
}

function App() {
    const [runs, setRuns] = React.useState(1000);
    const [strats, setStrats] = React.useState([0]);
    const [rewards, setRewards] = React.useState({r: -1, p: -2, t: 0, s: -3})

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

    function onRewardsChange(event) {
      //this.setState({value: event.target.value});
      //console.log(event.target.parentNode, event.target.value);

      let rewards = {r: 0, p: 0, t: 0, s: 0};
      for(let child of event.target.parentNode.children) {
        if(child.getAttribute("name") == "rewards-r") rewards.r = child.value;
        else if(child.getAttribute("name") == "rewards-p") rewards.p = child.value;
        else if(child.getAttribute("name") == "rewards-t") rewards.t = child.value;
        else if(child.getAttribute("name") == "rewards-s") rewards.s = child.value;
      }
      
      console.log(rewards);
      setRewards(rewards);
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

          /*const scores = new Array(dilemma.scores.size()).fill().map((_, score) => {
            return dilemma.scores.get(score);
          });
          console.log(JSON.stringify(scores, null, 2), scores.length);*/
      });
    }  

    return (
      <main>
        <Heading/>
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
              <button>Select All</button>

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
              <input type="submit" value="Submit" />
            </div>
          </form>
        </section>

        <section className="results">
          <h2>Results</h2>
          <div>Progress Bar</div>

          <div>text field</div>

          <div>Results</div>
        </section>
      </main>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);