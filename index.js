"use strict";

let wordList = [
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

// let randomIndex = Math.floor(Math.random() * wordList.length);
// let secret = wordList[randomIndex];
let secret = wordList[0];

let currentAttempt = "";
let history = [];

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  handleKey(e.key);
}

function handleKey(key) {
  if (history.length === 6) {
    return;
  }
  const letter = key.toLowerCase();
  if (letter === "enter") {
    if (currentAttempt.length < 5) {
      return;
    }
    if (!wordList.includes(currentAttempt)) {
      alert("Not in my thesaurus");
      reurn;
    }
    if (history.length === 5 && currentAttempt !== secret) {
      alert(secret);
    }
    history.push(currentAttempt);
    currentAttempt = "";
    updateKeybord();
    saveGame();
  } else if (letter === "backspace") {
    currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1);
  } else if (/^[a-z]$/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
    }
  }
  updateGrid();
}

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement("div");
    for (let j = 0; j < 5; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = "";
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function updateGrid() {
  let row = grid.firstChild;
  for (let attempt of history) {
    drawAttempt(row, attempt, false);
    row = row.nextSibling;
  }
  drawAttempt(row, currentAttempt, true);
}

function drawAttempt(row, attempt, isCurrent) {
  for (let i = 0; i < 5; i++) {
    let cell = row.children[i];
    if (attempt[i] !== undefined) {
      cell.textContent = attempt[i];
    } else {
      cell.innerHTML = '<div style="opacity: 0;">X</div>';
    }
    if (isCurrent) {
      cell.style.backgroundColor = BLACK;
      cell.style.borderColor = "";
      if (attempt[i] !== undefined) {
        cell.style.borderColor = MIDDLE_GREY;
      }
    } else {
      cell.style.backgroundColor = getBgColor(attempt, i);
      cell.style.borderColor = getBgColor(attempt, i);
    }
  }
}

const BLACK = "#111";
const GREY = "#212121";
const LIGHT_GREY = "#888";
const MIDDLE_GREY = "#666";
const GREEN = "#538d4e";
const YELLOW = "#b59f3b";

function getBgColor(attempt, i) {
  let correctLetter = secret[i];
  let attemptLetter = attempt[i];
  if (attemptLetter === undefined || secret.indexOf(attemptLetter) === -1) {
    return GREY;
  }

  if (correctLetter === attemptLetter) {
    return GREEN;
  }
  return YELLOW;
}

function buildKeybord() {
  buildKeybordRow("qwertyuiop", false);
  buildKeybordRow("asdfghjkl", false);
  buildKeybordRow("zxcvbnm", true);
}

function buildKeybordRow(letters, isLastRow) {
  let row = document.createElement("div");
  if (isLastRow) {
    const button = document.createElement("button");
    button.textContent = "Enter";
    button.className = "button";
    button.style.backgroundColor = LIGHT_GREY;
    button.onclick = () => {
      handleKey("enter");
    };
    row.appendChild(button);
  }
  for (let letter of letters) {
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "button";
    button.style.backgroundColor = LIGHT_GREY;
    button.onclick = () => {
      handleKey(letter);
    };
    row.appendChild(button);
    keybordButtons.set(letter, button);
  }
  if (isLastRow) {
    const button = document.createElement("button");
    button.textContent = "Backspace";
    button.className = "button";
    button.style.backgroundColor = LIGHT_GREY;
    button.onclick = () => {
      handleKey("backspace");
    };
    row.appendChild(button);
  }
  keybord.appendChild(row);
}

function getBetterColor(a, b) {
  if (a === GREEN || b === GREEN) {
    return GREEN;
  }
  if (a === YELLOW || b === YELLOW) {
    return YELLOW;
  }
  return GREY;
}

function updateKeybord() {
  const bestColors = new Map();
  for (let attempt of history) {
    for (let i = 0; i < attempt.length; i++) {
      const color = getBgColor(attempt, i);
      const key = attempt[i];
      const bestColor = bestColors.get(key);
      bestColors.set(key, getBetterColor(color, bestColor));
    }
  }

  for (let [key, button] of keybordButtons) {
    button.style.backgroundColor = bestColors.get(key);
    button.style.borderColor = bestColors.get(key);
  }
}

function loadGame() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem("data"));
  } catch (error) {}
  if (data != null) {
    history = data.history;
  }
}

function saveGame() {
  const data = JSON.stringify({
    secret,
    history,
  });
  try {
    localStorage.setItem("data", data);
  } catch (error) {}
}

let grid = document.getElementById("grid");
let keybord = document.getElementById("keybord");
let keybordButtons = new Map();

loadGame();
buildGrid();
buildKeybord();
updateGrid();
updateKeybord();
window.addEventListener("keydown", handleKeyDown);
