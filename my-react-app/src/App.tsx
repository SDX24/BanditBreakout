import { useState, useEffect } from "react";
import cmdZLogo from "./assets/CMD Z Logo.svg";
import banditLogo from "./assets/Bandit Logo Circle.svg";
import titleBackground from "./assets/title background.png";
import pole from "./assets/pole.png";
import quit from "./assets/quit.png";
import start from "./assets/start.png";
import titleCard from "./assets/title card.png";
import options from "./assets/options.png";

import "./App.css";

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentScreen(2), 3000); // Change to screen 2 after 3s
    const timer2 = setTimeout(() => setCurrentScreen(3), 4000); // Change to screen 3 after 4s
    const timer3 = setTimeout(() => setCurrentScreen(4), 6000); // Change back to screen 1 after 4s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      className={`loading-screen ${
        currentScreen === 2 ? "white-bg" : "black-bg"
      }`}
    >
      {currentScreen === 1 && (
        <div></div> // Empty black screen
      )}

      {currentScreen === 2 && (
        <img src={cmdZLogo} className="logo" alt="CMD Z Logo" />
      )}

      {currentScreen === 3 && (
        <img src={banditLogo} className="logo" alt="Bandit Logo" />
      )}

      {currentScreen === 4 && (
        <div className="title-containter">
          <img
            src={titleBackground}
            className="title-background"
            alt="Title Background"
          />

          <img src={pole} className="pole" alt="Pole" />

          <img src={titleCard} className="title-card" alt="Title Card" />
          <p className="titlecard-text">Bandit Breakout</p>

          <img src={start} className="start" alt="Start" />
          <a href="" className="clickable">
            <p className="start-text">Start</p>
          </a>

          <img src={options} className="options" alt="Options" />
          <a href="" className="clickable">
            <p className="options-text">Settings</p>
          </a>

          <img src={quit} className="quit" alt="Quit" />
          <a href="" className="clickable">
            <p className="quit-text">Quit</p>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
