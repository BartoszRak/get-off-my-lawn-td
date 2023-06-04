import React from "react";
import logo from "./logo.svg";
import "./App.css";
// import { game } from "./game/Game";
// import HelloWorldScene from "./game/scenes/HelloWorld";
import { GameParentId } from "./game/GameParentId";

// const handleClick = () => {
//   const scene = game.scene.keys.helloworld as HelloWorldScene;
//   scene.createEmitter();
// };

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* <button className="App-button" onClick={handleClick}>
          Or click me
        </button> */}
      </header>
    </div>
  );
}

export default App;
