import { useState, useEffect } from "react";
import cmdZLogo from "./assets/CMD Z Logo.svg";
import banditLogo from "./assets/Bandit Logo Circle.svg";
import titleBackground from "./assets/title background.png";

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
        <img
          src={titleBackground}
          className="title-background"
          alt="Title Background"
        />
      )}
    </div>
  );
}

export default App;
