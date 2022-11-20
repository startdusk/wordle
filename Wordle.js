import { useState, useContext, useRef, useEffect, useMemo } from "react";
import { KeyContext } from "./context.js";

const BLACK = "#111";
const GREY = "#212121";
const LIGHT_GREY = "#888";
const MIDDLE_GREY = "#666";
const GREEN = "#538d4e";
const YELLOW = "#b59f3b";

export default function wordle() {
  const [history, setHistory] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const loadedRef = useRef(false);

  const getBetterColor = (a, b) => {
    if (a === GREEN || b === GREEN) {
      return GREEN;
    }
    if (a === YELLOW || b === YELLOW) {
      return YELLOW;
    }
    return GREY;
  };
  const bestColors = useMemo(() => {
    const map = new Map();
    for (let attempt of history) {
      for (let i = 0; i < attempt.length; i++) {
        const color = getBgColor(attempt, i);
        const key = attempt[i];
        const bestColor = map.get(key);
        map.set(key, getBetterColor(color, bestColor));
      }
    }
    return map;
  }, [history]);
  useEffect(() => {
    if (loadedRef.current) {
      return;
    }
    loadedRef.current = true;
    const savedHistory = loadHistory();
    if (savedHistory) {
      setHistory(savedHistory);
    }
  });
  useEffect(() => {
    saveHistory(history);
  }, [history]);

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
      const newHistory = [...history, currentAttempt];
      setHistory(newHistory);
      setCurrentAttempt("");
      // TODO: parseInput();
    } else if (letter === "backspace") {
      setCurrentAttempt(currentAttempt.slice(0, currentAttempt.length - 1));
    } else if (/^[a-z]$/.test(letter)) {
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + letter);
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
      <KeyContext.Provider value={{ handleKey, bestColors }}>
        <h1>Wordle</h1>
        <Grid history={history} currentAttempt={currentAttempt} />
        <Keyboard />
      </KeyContext.Provider>
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

function Cell({ index, attempt, solved, isCurrent }) {
  let content;
  const hasLetter = attempt[index] !== undefined;
  if (hasLetter) {
    content = attempt[index];
  } else {
    content = <div style={{ opacity: 0 }}>X</div>;
  }
  const color = getBgColor(attempt, index);
  return (
    <div
      className={
        "cell " + (solved ? "solved" : "") + (hasLetter ? " filled" : "")
      }
    >
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

function Keyboard() {
  return (
    <div id="keyboard">
      <KeyboardRow letters={"qwertyuiop"} isLast={false} />
      <KeyboardRow letters={"asdfghjkl"} isLast={false} />
      <KeyboardRow letters={"zxcvbnm"} isLast={true} />
    </div>
  );
}

function KeyboardRow({ letters, isLast }) {
  const { bestColors } = useContext(KeyContext);
  return (
    <div>
      {isLast ? <Button buttonKey={"enter"} children={"Enter"} /> : null}
      {Array.from(letters).map((letter) => {
        return (
          <Button
            buttonKey={letter}
            children={letter}
            color={bestColors.get(letter)}
          />
        );
      })}
      {isLast ? (
        <Button buttonKey={"backspace"} children={"Backspace"} />
      ) : null}
    </div>
  );
}

function Button({ buttonKey, children, color = LIGHT_GREY }) {
  const { handleKey } = useContext(KeyContext);
  return (
    <button
      className="button"
      onClick={() => {
        handleKey(buttonKey);
      }}
      style={{
        backgroundColor: color,
        borderColor: color,
      }}
    >
      {children}
    </button>
  );
}

function loadHistory() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (error) {}
  if (data != null) {
    return data.history;
  }
}

function saveHistory(history) {
  const data = JSON.stringify({
    secret,
    history,
  });
  try {
    localStorage.setItem("data", data);
  } catch (error) {}
}
