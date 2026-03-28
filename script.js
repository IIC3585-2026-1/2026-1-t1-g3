const board = document.querySelector(".board");
const movesElement = document.querySelector("#moves");
const matchesElement = document.querySelector("#matches");

const symbols = ["python", "c#", "c++", "cobol", "lisp", "java", "ruby", "go"];

let first = null;
let second = null;
let lock = false;
let moves = 0;
let matches = 0;

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
    matchesElement.textContent = matches;
    resetTurn();
    return;
  }

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

createBoard();
