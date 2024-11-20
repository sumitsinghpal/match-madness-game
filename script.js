let words = [
    { word: "apple", translation: "Apfel" },
    { word: "dog", translation: "Hund" },
    { word: "cat", translation: "Katze" },
    { word: "house", translation: "Haus" },
    { word: "book", translation: "Buch" },
    { word: "water", translation: "Wasser" },
    { word: "friend", translation: "Freund" },
    { word: "light", translation: "Licht" },
];

let score = 0;
let flippedCards = [];
let hintCount = 3;

function shuffleCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    let shuffledWords = [...words, ...words];
    shuffledWords = shuffledWords.sort(() => Math.random() - 0.5);

    shuffledWords.forEach((wordObj) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-word', wordObj.word);
        card.setAttribute('data-translation', wordObj.translation);
        card.textContent = wordObj.word;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard(event) {
    const clickedCard = event.target;
    if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped')) {
        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.getAttribute('data-word') === card2.getAttribute('data-translation') || 
        card1.getAttribute('data-translation') === card2.getAttribute('data-word')) {
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function giveHint() {
    if (hintCount > 0) {
        hintCount--;
        const cards = document.querySelectorAll('.card:not(.flipped)');
        const randomCard1 = cards[Math.floor(Math.random() * cards.length)];
        const translation = randomCard1.getAttribute('data-translation');
        const matchingCard = [...cards].find(card => card.getAttribute('data-word') === translation || card.getAttribute('data-translation') === translation);
        if (matchingCard) {
            randomCard1.classList.add('flipped');
            matchingCard.classList.add('flipped');
            setTimeout(() => {
                randomCard1.classList.remove('flipped');
                matchingCard.classList.remove('flipped');
            }, 1000);
        }
        document.getElementById('hint-count').textContent = `Hints Left: ${hintCount}`;
    }
}

document.getElementById('hint-btn').addEventListener('click', giveHint);

function startGame() {
    shuffleCards();
}

startGame();
