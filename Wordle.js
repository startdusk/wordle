import { useState, useEffect } from "react";

const BLACK = "#111";
const GREY = "#212121";
const LIGHT_GREY = "#888";
const MIDDLE_GREY = "#666";
const GREEN = "#538d4e";
const YELLOW = "#b59f3b";

export default function wordle() {
  const [history, setHistory] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const handleKey = (key) => {
    if (history.length === 6) {
      return;
    }
    // TODO: isAnimating check
    const letter = key.toLowerCase();
    if (letter === "enter") {
      if (currentAttempt.length < 5) {
        return;
      }
      if (!wordList.includes(currentAttempt)) {
        alert("Not in my thesaurus");
        return;
      }
      if (history.length === 5 && currentAttempt !== secret) {
        alert(secret);
      }
      setHistory([...history, currentAttempt]);
      setCurrentAttempt("");
      // TODO: saveGame();
      // TODO: parseInput();
    } else if (letter === "backspace") {
      setCurrentAttempt(currentAttempt.slice(0, currentAttempt.length - 1));
    } else if (/^[a-z]$/.test(letter)) {
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + letter);
        // TODO: animatePress(currentAttempt.length - 1);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    handleKey(e.key);
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
  return (
    <div id="screen">
      <h1>Wordle</h1>
      <Grid history={history} currentAttempt={currentAttempt} />
      <Keyboard onKey={handleKey} />
    </div>
  );
}

const wordList = [
  "patio",
  "darts",
  "piano",
  "horse",
  "hello",
  "water",
  "pizza",
  "sushi",
  "crabs",
];

let secret = wordList[0];
// let history = ["piano", "horse"];
// let currentAttempt = "wat";

function Grid({ history, currentAttempt }) {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    if (i < history.length) {
      rows.push(<Attempt key={i} attempt={history[i]} solved={true} />);
    } else if (i === history.length) {
      rows.push(<Attempt key={i} attempt={currentAttempt} solved={false} />);
    } else {
      rows.push(<Attempt key={i} attempt="" solved={false} />);
    }
  }
  return <div id="grid">{rows}</div>;
}

function Attempt({ attempt, solved }) {
  const cells = [];
  for (let i = 0; i < 5; i++) {
    cells.push(<Cell key={i} index={i} attempt={attempt} solved={solved} />);
  }
  return <div>{cells}</div>;
}

function Cell({ index, attempt, solved }) {
  let content;
  const hasLetter = attempt[index] !== undefined;
  if (hasLetter) {
    content = attempt[index];
  } else {
    content = <div style={{ opacity: 0 }}>X</div>;
    // TODO: clearAnimation(cell)
  }
  const color = getBgColor(attempt, index);
  return (
    <div className={"cell " + (solved ? "solved" : "")}>
      <div
        className="surface"
        style={{
          transitionDelay: index * 300 + "ms",
        }}
      >
        <div
          className="front"
          style={{
            backgroundColor: BLACK,
            borderColor: hasLetter ? MIDDLE_GREY : "",
          }}
        >
          {content}
        </div>
        <div
          className="back"
          style={{
            backgroundColor: color,
            borderColor: color,
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

function getBgColor(attempt, index) {
  const correctLetter = secret[index];
  const attemptLetter = attempt[index];
  if (attemptLetter === undefined || secret.indexOf(attemptLetter) === -1) {
    return GREY;
  }

  if (correctLetter === attemptLetter) {
    return GREEN;
  }
  return YELLOW;
}

function Keyboard({ onKey }) {
  return (
    <div id="keyboard">
      <KeyboardRow letters={"qwertyuiop"} onKey={onKey} isLast={false} />
      <KeyboardRow letters={"asdfghjkl"} onKey={onKey} isLast={false} />
      <KeyboardRow letters={"zxcvbnm"} onKey={onKey} isLast={true} />
    </div>
  );
}

function KeyboardRow({ letters, isLast, onKey }) {
  return (
    <div>
      {isLast ? (
        <Button buttonKey={"enter"} onKey={onKey} children={"Enter"} />
      ) : null}
      {Array.from(letters).map((letter) => {
        return <Button buttonKey={letter} onKey={onKey} children={letter} />;
      })}
      {isLast ? (
        <Button buttonKey={"backspace"} onKey={onKey} children={"Backspace"} />
      ) : null}
    </div>
  );
}

function Button({ buttonKey, children, onKey }) {
  return (
    <button
      className="button"
      onClick={() => {
        onKey(buttonKey);
      }}
      style={{
        backgroundColor: LIGHT_GREY,
      }}
    >
      {children}
    </button>
  );
}
