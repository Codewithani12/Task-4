const statusEl = document.getElementById("status");
const currentPlayerEl = document.getElementById("currentPlayer");
const boardEl = document.getElementById("board");
const restartBtn = document.getElementById("restartBtn");

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let boardState = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

function createBoard() {
  boardEl.innerHTML = "";
  boardState = Array(9).fill("");
  gameOver = false;
  currentPlayer = "X";
  updateStatus();

  for (let i = 0; i < 9; i += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = i;
    cell.setAttribute("aria-label", `Cell ${i + 1}`);
    cell.addEventListener("click", handleCellClick);
    cell.addEventListener("keydown", handleCellKeyDown);
    boardEl.appendChild(cell);
  }
}

function updateStatus(message) {
  if (message) {
    statusEl.textContent = message;
    return;
  }

  currentPlayerEl.textContent = currentPlayer;
  statusEl.innerHTML = `Player <span id="currentPlayer">${currentPlayer}</span>'s turn`;
}

function playClickSound() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 260 + (currentPlayer === "X" ? 40 : -40);

  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(0.20, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.15);
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (gameOver || boardState[index]) {
    return;
  }

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("filled");

  playClickSound();

  const winningInfo = getWinningInfo();

  if (winningInfo) {
    endGame(`${currentPlayer} wins!`, winningInfo);
    return;
  }

  if (boardState.every((cell) => cell)) {
    endGame("It's a draw!", []);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function handleCellKeyDown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
  }
}

function getWinningInfo() {
  return WINNING_COMBINATIONS.map((combo) => {
    const [a, b, c] = combo;
    return {
      combo,
      winner: boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c] ? boardState[a] : null,
    };
  }).find((info) => info.winner);
}

function endGame(message, winningInfo) {
  gameOver = true;
  if (winningInfo && winningInfo.combo) {
    highlightWinningCells(winningInfo.combo);
  }
  updateStatus(message);
}

function highlightWinningCells(combo) {
  combo.forEach((index) => {
    const cell = boardEl.querySelector(`[data-index="${index}"]`);
    if (cell) {
      cell.classList.add("win");
    }
  });
}

restartBtn.addEventListener("click", () => {
  createBoard();
  boardEl.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("win"));
});

createBoard();
