const gameGrid = document.getElementById("game-grid");
const timerDisplay = document.getElementById("timer");
const gameMessage = document.getElementById("game-message");
const leaderboardContainer = document.getElementById("leaderboard");
const difficultyMenu = document.getElementById("difficulty");
const filterDifficulty = document.getElementById("filter-difficulty");
const startButton = document.getElementById("start-button");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

let tiles = [];
let flippedTiles = [];
let matchedCount = 0;
let timer = 30;
let timerInterval;
let currentPage = 1;
let totalPages = 1;
let currentFilter = "";

// Difficulty settings
const difficultySettings = {
  easy: { gridSize: 2, timer: 15 },
  medium: { gridSize: 4, timer: 30 },
  hard: { gridSize: 6, timer: 60 },
};

// Word pairs
const wordPairs = [
  { word: "Cat", match: "https://example.com/cat.png" },
  { word: "Dog", match: "https://example.com/dog.png" },
  { word: "Apple", match: "https://example.com/apple.png" },
  { word: "Car", match: "https://example.com/car.png" },
];

// Start Game
startButton.addEventListener("click", () => {
  const difficulty = difficultyMenu.value;
  const { gridSize, timer: time } = difficultySettings[difficulty];
  timer = time;
  generateGrid(gridSize);
  startGame();
});

// Fetch and Display Leaderboard
function fetchLeaderboard(page = 1, filter = "") {
  fetch(`http://localhost:5000/leaderboard?page=${page}&difficulty=${filter}`)
    .then((response) => response.json())
    .then(({ scores, total }) => {
      displayLeaderboard(scores);
      totalPages = Math.ceil(total / 10);
      updatePagination(page, totalPages);
    })
    .catch((err) => console.error("Error fetching leaderboard:", err));
}

function displayLeaderboard(scores) {
  leaderboardContainer.innerHTML = "";
  scores.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${index + 1}. ${entry.username}</span><span>${entry.score} pts</span>`;
    leaderboardContainer.appendChild(listItem);
  });
}

function updatePagination(page, total) {
  currentPage = page;
  prevPageButton.disabled = page === 1;
  nextPageButton.disabled = page === total;
  pageInfo.textContent = `Page ${page} of ${total}`;
}

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) fetchLeaderboard(currentPage - 1, currentFilter);
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) fetchLeaderboard(currentPage + 1, currentFilter);
});

filterDifficulty.addEventListener("change", (e) => {
  currentFilter = e.target.value;
  fetchLeaderboard(1, currentFilter);
});

// Highlight player and update leaderboard after saving score
function submitScore(username, score, difficulty) {
  fetch("http://localhost:5000/submit-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, score, difficulty }),
  })
    .then(() => fetchLeaderboard(currentPage, currentFilter))
    .catch((err) => console.error("Error submitting score:", err));
}
