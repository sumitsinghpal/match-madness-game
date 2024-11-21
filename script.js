const wordPairs = [
    { en: 'hello', de: 'hallo' },
    { en: 'goodbye', de: 'auf Wiedersehen' },
    { en: 'dog', de: 'Hund' },
    { en: 'cat', de: 'Katze' },
    { en: 'apple', de: 'Apfel' },
    { en: 'water', de: 'Wasser' },
    { en: 'book', de: 'Buch' },
    { en: 'house', de: 'Haus' },
    { en: 'car', de: 'Auto' },
    { en: 'school', de: 'Schule' },
];

let flippedCards = [];
let score = 0;

function shuffleAndDisplayCards() {
    const cards = [...wordPairs, ...wordPairs]; // Double the word pairs
    cards.sort(() => Math.random() - 0.5);

    const container = document.querySelector('.cards-container');
    container.innerHTML = '';

    cards.forEach((pair, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.innerHTML = `
            <div class="front">?</div>
            <div class="back">${Math.random() > 0.5 ? pair.en : pair.de}</div>
        `;
        card.addEventListener('click', () => flipCard(card, pair));

        container.appendChild(card);
    });
}

function flipCard(card, pair) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch(pair);
        }
    }
}

function checkMatch(pair) {
    const [card1, card2] = flippedCards;

    if (card1.querySelector('.back').innerText === card2.querySelector('.back').innerText) {
        // Correct match
        score++;
        flippedCards = [];

        if (score === wordPairs.length) {
            setTimeout(() => {
                document.querySelector('.game-over').style.display = 'block';
            }, 500);
        }
    } else {
        // Incorrect match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

document.getElementById('retry-btn').addEventListener('click', () => {
    score = 0;
    flippedCards = [];
    document.querySelector('.game-over').style.display = 'none';
    shuffleAndDisplayCards();
});

shuffleAndDisplayCards();
