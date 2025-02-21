const categories = {
    emojis: ['😊', '😊', '😂', '😂', '🤣', '🤣', '👍', '👍', '👌', '👌', '😒', '😒', '😍', '😍', '😁', '😁'],
    flags: ['🇺🇸', '🇺🇸', '🇬🇧', '🇬🇧', '🇮🇳', '🇮🇳', '🇯🇵', '🇯🇵', '🇫🇷', '🇫🇷', '🇩🇪', '🇩🇪', '🇨🇦', '🇨🇦', '🇧🇷', '🇧🇷'],
    fruits: ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉', '🥭', '🥭', '🍓', '🍓', '🍍', '🍍', '🥑', '🥑'],
    animals: ['🐶', '🐶', '🐱', '🐱', '🐰', '🐰', '🐼', '🐼', '🐵', '🐵', '🦊', '🦊', '🦁', '🦁', '🐯', '🐯'],
    planets: ['🌍', '🌍', '🌕', '🌕', '🪐', '🪐', '☀️', '☀️', '🌟', '🌟', '🌙', '🌙', '🚀', '🚀', '🛰️', '🛰️']
};

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let startTime;
let currentCategory = 'emojis'; // Default category

// Function to start or restart the game
function startGame(category) {
    currentCategory = category; // Store selected category
    let gameBoard = document.querySelector('.game');
    gameBoard.innerHTML = ''; // Clear game board
    startTime = Date.now(); // Capture start time

    let shuffledPairs = [...categories[category]]
        .sort(() => Math.random() - 0.5); // Shuffle

    shuffledPairs.forEach(symbol => {
        let box = document.createElement('div');
        box.className = 'item';
        box.dataset.emoji = symbol;
        gameBoard.appendChild(box);

        box.addEventListener('click', function () {
            if (lockBoard || this.classList.contains('boxMatch') || this === firstCard) return;

            this.classList.add('boxOpen');
            this.innerHTML = this.dataset.emoji;

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            lockBoard = true; // Prevent further clicks

            checkMatch();
        });
    });
}

// Check for match
function checkMatch() {
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        firstCard.classList.add('boxMatch');
        secondCard.classList.add('boxMatch');
        resetBoard();

        // Check if the player has won
        if (document.querySelectorAll('.boxMatch').length === 16) {
            let endTime = Date.now();
            let timeTaken = ((endTime - startTime) / 1000).toFixed(2);
            setTimeout(() => alert(`You Win! 🎉 Time taken: ${timeTaken} seconds`), 500);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('boxOpen');
            secondCard.classList.remove('boxOpen');
            firstCard.innerHTML = '';
            secondCard.innerHTML = '';
            resetBoard();
        }, 800);
    }
}

// Reset board state
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Reset game function (keeps the current category)
function resetGame() {
    startGame(currentCategory);
}

// Initialize game with emojis on page load
window.onload = () => startGame('emojis');
