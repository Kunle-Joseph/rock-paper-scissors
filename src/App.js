import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./images/logo.svg";
import rulesImg from "./images/image-rules.svg";
import closeIcon from "./images/icon-close.svg";
import triangle from "./images/bg-triangle.svg";
import iconRock from "./images/icon-rock.svg";
import iconPaper from "./images/icon-paper.svg";
import iconScissors from "./images/icon-scissors.svg";

function App() {
  const [showRules, setShowRules] = useState(false);
  const [play, setPlay] = useState("none");
  const [houseMove, setHouseMove] = useState("none");
  const [score, setScore] = useState(0);
  const [showHousePick, setShowHousePick] = useState(false);
  const [winner, setWinner] = useState("none");
  const [showWinner, setShowWinner] = useState(false);

  // getrieve score from sessionStorage on component mount
  useEffect(() => {
    const storedValue = sessionStorage.getItem("score");
    if (storedValue) {
      setScore(Number(storedValue)); // Parse as number
    }
  }, []);

  // update sessionStorage whenever score changes
  useEffect(() => {
    if (score > 0) { // Ensure score is non-negative
    sessionStorage.setItem("score", score);}
  }, [score]);

  //when play changes, house plays a new move
  useEffect(() => {
    housePick();
  }, [play]);

  //when house plays, we see that move after a delay
  useEffect(() => {
    if (play !== "none") {
      setShowHousePick(false);
      setShowWinner(false);
      let timeout = setTimeout(() => {
        setShowHousePick(true);
        getWinner(play, houseMove);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [play, houseMove]);

  //when winner is determined, we update the score and show the winner
  useEffect(() => {
    if (winner === "player") setScore((prev) => prev + 1);
    let timeout;
    if (winner === "player" || winner === "house" || winner === "draw") {
      timeout = setTimeout(() => {
        setShowWinner(true);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [winner]);

  const getPickProps = (pick) => {
    switch (pick) {
      case "rock":
        return { icon: iconRock, className: "picked-btn rock" };
      case "paper":
        return { icon: iconPaper, className: "picked-btn paper" };
      case "scissors":
        return { icon: iconScissors, className: "picked-btn scissors" };
      default:
        return {};
    }
  };

  const housePick = () => {
    if (play === "none") return;
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    switch (randomNumber) {
      case 1:
        setHouseMove("rock");
        break;
      case 2:
        setHouseMove("paper");
        break;
      case 3:
        setHouseMove("scissors");
        break;
      default:
        break;
    }
  };

  const getWinner = (play, houseMove) => {
    if (play === houseMove) {
      setWinner("draw");
      return;
    }
    if (
      (play === "rock" && houseMove === "scissors") ||
      (play === "paper" && houseMove === "rock") ||
      (play === "scissors" && houseMove === "paper")
    ) {
      setWinner("player");
      return;
    }
    setWinner("house");
  };

  const handlePlayAgain = () => {
    setPlay("none");
    setHouseMove("none");
    setWinner("none");
    setShowHousePick(false);
    setShowWinner(false);
  };

  // Winner text and color
  const getWinnerText = () => {
    if (winner === "player") return "YOU WIN";
    if (winner === "house") return "YOU LOSE";
    if (winner === "draw") return "DRAW";
    return "";
  };

  return (
    <div>
      <div className="head">
        <div className="logo">
          <img src={logo} alt="logo" />
          <div className="score-box">
            <span>SCORE</span>
            <div className="score-value">{score}</div>
          </div>
        </div>
      </div>
      {play === "none" ? (
        <div className="game-board">
          <img src={triangle} alt="triangle" className="triangle-bg" />
          <button className="game-btn paper" onClick={() => setPlay("paper")}>
            <img src={iconPaper} alt="Paper" />
          </button>
          <button
            className="game-btn scissors"
            onClick={() => setPlay("scissors")}
          >
            <img src={iconScissors} alt="Scissors" />
          </button>
          <button className="game-btn rock" onClick={() => setPlay("rock")}>
            <img src={iconRock} alt="Rock" />
          </button>
        </div>
      ) : (
        <div className="picked-screen">
          <div className="picked-col">
            <div className="picked-label">YOU PICKED</div>
            <div
              className={`picked-btn-wrapper${
                showWinner && winner === "player" ? " winner-glow" : ""
              }`}
            >
              <button className={getPickProps(play).className}>
                <img src={getPickProps(play).icon} alt={play} />
              </button>
            </div>
          </div>
          <div className="picked-center">
            {showWinner && (
              <>
                <div className="result-text">{getWinnerText()}</div>
                <button className="play-again-btn" onClick={handlePlayAgain}>
                  PLAY AGAIN
                </button>
              </>
            )}
          </div>
          <div className="picked-col">
            <div className="picked-label">THE HOUSE PICKED</div>
            <div
              className={`picked-btn-wrapper${
                showWinner && winner === "house" ? " winner-glow" : ""
              }`}
            >
              {!showHousePick ? (
                <div className="picked-placeholder"></div>
              ) : (
                <button className={getPickProps(houseMove).className}>
                  <img src={getPickProps(houseMove).icon} alt={houseMove} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <button className="rule-btn" onClick={() => setShowRules(true)}>
        Rules
      </button>

      {/*Modal*/}
      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div
            className="rules-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="rules-modal-header">
              <span>RULES</span>
              <button
                className="close-btn"
                onClick={() => setShowRules(false)}
                aria-label="Close"
              >
                <img src={closeIcon} alt="close" />
              </button>
            </div>
            <img src={rulesImg} alt="rules" className="rules-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
