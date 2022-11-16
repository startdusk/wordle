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

let randomIndex = Math.floor(Math.random() * wordList.length);
let secret = wordList[randomIndex];

let currentAttempt = "";
let history = [];

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  const letter = e.key.toLowerCase();
  if (letter === "enter") {
    if (currentAttempt.length < 5) {
      reurn;
    }
    if (!wordList.includes(currentAttempt)) {
      alert("Not in my thesaurus");
      reurn;
    }
    history.push(currentAttempt);
    currentAttempt = "";
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
    } else {
      cell.style.backgroundColor = getBgColor(attempt, i);
    }
  }
}

const BLACK = "#111";
const GREY = "#212121";
const LIGHT_GREY = "#888";
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
    let button = document.createElement("button");
    button.textContent = "Enter";
    button.className = "button";
    button.style.backgroundColor = LIGHT_GREY;
    button.onclick = () => {
      // TODO:
    };
    row.appendChild(button);
  }
  for (let letter of letters) {
    let button = document.createElement("button");
    button.textContent = letter;
    button.className = "button";
    button.style.backgroundColor = LIGHT_GREY;
    button.onclick = () => {
      // TODO:
    };
    row.appendChild(button);
  }
  if (isLastRow) {
    let button = document.createElement("button");
    button.textContent = "Backspace";
    button.className = "button";
    button.style.backgroundColor = LIGHT_GREY;
    button.onclick = () => {
      // TODO:
    };
    row.appendChild(button);
  }
  keybord.appendChild(row);
}

let grid = document.getElementById("grid");
let keybord = document.getElementById("keybord");

buildGrid();
buildKeybord();
updateGrid();
window.addEventListener("keydown", handleKeyDown);
