const board = document.querySelector(".board");
const movesElement = document.querySelector("#moves");
const matchesElement = document.querySelector("#matches");
const scoreElement = document.querySelector("#score");
const movesTextElement = movesElement.parentElement;
const matchesTextElement = matchesElement.parentElement;
const scoreTextElement = scoreElement.parentElement;
const winScoreElement = document.querySelector("#win-score");
const gameElement = document.querySelector(".game");
const restartButton = document.querySelector(".game-button");
const winRestartButton = document.querySelector(".win-button");
const toastElement = document.querySelector("#toast");
const winNotificationElement = document.querySelector("#win-notification");

const symbols = ["python", "c#", "c++", "cobol", "lisp", "java", "ruby", "go"];

let first = null;
let second = null;
let lock = false;
let moves = 0;
let matches = 0;
let score = 0;
let streak = 0;
let toastTimeoutId = null;
let scoreFlashTimeoutId = null;
let movesFlashTimeoutId = null;

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
}

function createBoard() {
  const pairedSymbols = shuffle([...symbols, ...symbols]);

  board.innerHTML = "";

  pairedSymbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.symbol = symbol;

    card.innerHTML = `
      <div class="inner">
        <div class="front"><span class="question-mark">?</span></div>
        <div class="back">${symbol}</div>
      </div>
    `;

    card.addEventListener("click", () => handleCardClick(card));
    board.appendChild(card);
  });
}

function handleCardClick(card) {
  if (lock || card === first || card.classList.contains("match")) return;

  card.classList.add("flipped");

  if (!first) {
    first = card;
    return;
  }

  second = card;
  lock = true;
  moves += 1;
  movesElement.textContent = moves;

  if (first.dataset.symbol === second.dataset.symbol) {
    first.classList.add("match");
    second.classList.add("match");
    matches += 1;
    streak += 1;
    score += 10 + (streak - 1) * 5;
    matchesElement.textContent = matches;
    updateScoreUI();
    flashMatchStats();
    if (matches === symbols.length) {
      showWinNotification();
    }
    resetTurn();
    return;
  }

  streak = 0;
  flashWrongMove();
  first.classList.add("wrong");
  second.classList.add("wrong");

  setTimeout(() => {
    first.classList.remove("flipped", "wrong");
    second.classList.remove("flipped", "wrong");
    resetTurn();
  }, 800);
}

function resetTurn() {
  first = null;
  second = null;
  lock = false;
}

function updateScoreUI() {
  scoreElement.textContent = score;
  gameElement.style.setProperty("--matches", matches);
}

function flashMatchStats() {
  matchesTextElement.classList.add("stat-flash");
  scoreTextElement.classList.add("stat-flash");

  if (scoreFlashTimeoutId) {
    clearTimeout(scoreFlashTimeoutId);
  }

  scoreFlashTimeoutId = setTimeout(() => {
    matchesTextElement.classList.remove("stat-flash");
    scoreTextElement.classList.remove("stat-flash");
  }, 650);
}

function flashWrongMove() {
  movesTextElement.classList.add("move-flash");

  if (movesFlashTimeoutId) {
    clearTimeout(movesFlashTimeoutId);
  }

  movesFlashTimeoutId = setTimeout(() => {
    movesTextElement.classList.remove("move-flash");
  }, 650);
}

function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 1800);
}

function showWinNotification() {
  winScoreElement.textContent = score;
  winNotificationElement.classList.add("show");
}

function restartGame() {
  moves = 0;
  matches = 0;
  score = 0;
  streak = 0;
  movesElement.textContent = moves;
  matchesElement.textContent = matches;
  winScoreElement.textContent = score;
  updateScoreUI();
  resetTurn();
  winNotificationElement.classList.remove("show");
  createBoard();
  showToast("Juego reiniciado");
}

restartButton.addEventListener("click", restartGame);
winRestartButton.addEventListener("click", restartGame);

createBoard();
updateScoreUI();
