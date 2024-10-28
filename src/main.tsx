import React from "react";
import ReactDOM from "react-dom";

function App() {
  const [state, setState] = React.useState(0);

  return (
    <div>
      <h1>Hello, Cordova com React e Vite! {state}</h1>
      <button onClick={() => setState(state + 1)}>Increment</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
