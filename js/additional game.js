const cards = [
    '🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉', '🍓', '🍓', '🍒', '🍒'
];
let flippedCards = [];
let matchedPairs = 0;
let timer = 0;
let interval;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const gameBoard = document.querySelector('.memory-game');
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.card = card;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (flippedCards.length < 2) {
        this.classList.add('flipped');
        this.textContent = this.dataset.card;
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.card === card2.dataset.card) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cards.length / 2) {
            clearInterval(interval);
            document.getElementById('start-quiz').style.display = 'block';
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card1.textContent = '';
            card2.classList.remove('flipped');
            card2.textContent = '';
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    interval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = `Time: ${timer}`;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    startTimer();
    document.getElementById('start-quiz').addEventListener('click', () => {
        window.location.href = 'levels.html';
    });
});