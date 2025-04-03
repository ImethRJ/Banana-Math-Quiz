        // Game configuration
        const cardEmojis = {
            fruits: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥭', '🍊', '🥝', '🥥', '🍋'],
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸'],
            objects: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🏸', '🥊', '🎯', '🎮']
        };

        // Game state
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let timer = 0;
        let score = 0;
        let moves = 0;
        let hintsRemaining = 3;
        let cardTheme = 'fruits';
        let isPaused = false;
        let interval;

        // Get random theme
        function getRandomTheme() {
            const themes = Object.keys(cardEmojis);
            return themes[Math.floor(Math.random() * themes.length)];
        }

        // Shuffle array
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Create game board
        function createBoard() {
            const gameBoard = document.querySelector('.memory-game');
            gameBoard.innerHTML = '';
            
            // Set fixed grid columns (4x3 grid)
            const columns = 4;
            gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
            
            // Fixed number of pairs (6 pairs)
            const pairs = 6;
            
            // Select random theme
            cardTheme = getRandomTheme();
            
            // Get the emoji set from the selected theme
            const themeEmojis = cardEmojis[cardTheme];
            
            // Select 6 random emojis from the theme for the pairs
            const selectedEmojis = themeEmojis.slice(0, pairs);
            
            // Create pairs array
            cards = [];
            selectedEmojis.forEach(emoji => {
                cards.push(emoji);
                cards.push(emoji);
            });
            
            shuffle(cards);
            
            cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('memory-card');
                cardElement.dataset.card = card;
                cardElement.dataset.index = index;
                
                // Create card front (back facing)
                const cardFront = document.createElement('div');
                cardFront.classList.add('card-front');
                cardFront.textContent = '?';
                
                // Create card back (with emoji)
                const cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                cardBack.textContent = card;
                
                cardElement.appendChild(cardFront);
                cardElement.appendChild(cardBack);
                
                cardElement.addEventListener('click', flipCard);
                gameBoard.appendChild(cardElement);
            });
            
            // Reset game state
            matchedPairs = 0;
            updateHintButton();
            updateUI();
        }

        // Flip card
        function flipCard() {
            if (isPaused) return;
            if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
                this.classList.add('flipped');
                flippedCards.push(this);
                
                if (flippedCards.length === 2) {
                    moves++;
                    updateUI();
                    checkMatch();
                }
            }
        }

        // Check if cards match
        function checkMatch() {
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.card === card2.dataset.card) {
                // Match found
                matchedPairs++;
                const matchScore = calculateMatchScore();
                score += matchScore;
                
                // Show quick animation
                displayScoreAnimation(card1, matchScore);
                
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    flippedCards = [];
                    
                    // Check if game is complete
                    if (matchedPairs === cards.length / 2) {
                        clearInterval(interval);
                        showCompletionMessage();
                        createConfetti();
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
            
            updateUI();
        }

        // Calculate score based on time
        function calculateMatchScore() {
            // Base score: faster matches = higher score
            const timeBonus = Math.max(100 - timer, 10);
            const movesPenalty = Math.max(20 - moves, 5);
            
            return Math.floor(timeBonus + movesPenalty);
        }

        // Display score animation
        function displayScoreAnimation(card, points) {
            const animation = document.createElement('div');
            animation.textContent = `+${points}`;
            animation.style.position = 'absolute';
            animation.style.color = '#7cfc00';
            animation.style.fontSize = '24px';
            animation.style.fontWeight = 'bold';
            animation.style.zIndex = '100';
            
            // Position near the card
            const rect = card.getBoundingClientRect();
            animation.style.left = `${rect.left + rect.width/2}px`;
            animation.style.top = `${rect.top}px`;
            
            // Animate
            animation.style.transition = 'all 1s ease-out';
            animation.style.opacity = '0';
            animation.style.transform = 'translateY(-30px)';
            
            document.body.appendChild(animation);
            
            // Force reflow
            animation.offsetHeight;
            
            // Start animation
            setTimeout(() => {
                document.body.removeChild(animation);
            }, 1000);
        }

        // Start timer
        function startTimer() {
            clearInterval(interval);
            
            interval = setInterval(() => {
                if (!isPaused) {
                    timer++;
                    updateUI();
                }
            }, 1000);
        }

        // Show completion message
        function showCompletionMessage() {
            const message = document.getElementById('completion-message');
            document.getElementById('final-time').textContent = timer;
            document.getElementById('final-moves').textContent = moves;
            document.getElementById('final-score').textContent = score;
            
            // Set stars based on performance
            const starsCount = calculateStars();
            const starsContainer = document.getElementById('final-stars');
            starsContainer.innerHTML = '';
            
            for (let i = 0; i < 3; i++) {
                const star = document.createElement('span');
                star.textContent = i < starsCount ? '★' : '☆';
                star.style.color = 'gold';
                star.style.fontSize = '28px';
                starsContainer.appendChild(star);
            }
            
            message.style.display = 'block';
            setTimeout(() => {
                message.style.opacity = '1';
            }, 100);
            
            // Redirect to levels.html after 5 seconds
            setTimeout(() => {
                window.location.href = 'levels.html';
            }, 5000);
        }

        // Calculate stars based on performance
        function calculateStars() {
            const pairCount = cards.length / 2;
            
            // Perfect game: few moves compared to pairs
            if (moves <= pairCount * 1.5) return 3;
            
            // Good game: reasonable number of moves
            if (moves <= pairCount * 2.5) return 2;
            
            // Completed but with many moves
            return 1;
        }

        // Update UI elements
        function updateUI() {
            document.getElementById('timer').textContent = `Time: ${timer}`;
            document.getElementById('score').textContent = `Score: ${score}`;
            document.getElementById('moves').textContent = `Moves: ${moves}`;
            
            // Update stars display
            const stars = document.querySelectorAll('.stars-container:not(#final-stars) .star');
            const starCount = calculateStars();
            
            stars.forEach((star, index) => {
                star.style.opacity = index < starCount ? '1' : '0.3';
            });
        }

        // Restart game
        function restartGame() {
            if (confirm("Are you sure you want to restart? Your current progress will be lost.")) {
                clearInterval(interval);
                timer = 0;
                score = 0;
                moves = 0;
                flippedCards = [];
                hintsRemaining = 3;
                
                document.getElementById('completion-message').style.display = 'none';
                document.getElementById('completion-message').style.opacity = '0';
                
                createBoard();
                startTimer();
            }
        }

        // Show hint
        function showHint() {
            if (hintsRemaining > 0 && !isPaused) {
                hintsRemaining--;
                updateHintButton();
                
                // Find unmatched cards
                const unmatchedCards = Array.from(document.querySelectorAll('.memory-card:not(.matched):not(.flipped)'));
                
                if (unmatchedCards.length >= 2) {
                    // Find a matching pair
                    const cardValues = {};
                    unmatchedCards.forEach(card => {
                        const value = card.dataset.card;
                        if (!cardValues[value]) {
                            cardValues[value] = [];
                        }
                        cardValues[value].push(card);
                    });
                    
                    // Find first pair
                    let hintPair = null;
                    Object.values(cardValues).forEach(cards => {
                        if (cards.length >= 2 && !hintPair) {
                            hintPair = [cards[0], cards[1]];
                        }
                    });
                    
                    if (hintPair) {
                        // Flash the hint
                        hintPair.forEach(card => {
                            card.classList.add('flipped');
                            setTimeout(() => {
                                card.classList.remove('flipped');
                            }, 1000);
                        });
                    }
                }
            }
        }

        // Update hint button
        function updateHintButton() {
            document.getElementById('hint-btn').textContent = `Hint (${hintsRemaining})`;
            document.getElementById('hint-btn').disabled = hintsRemaining === 0;
        }

        // Toggle pause
        function togglePause() {
            isPaused = !isPaused;
            const pauseModal = document.getElementById('pause-modal');
            
            if (isPaused) {
                pauseModal.style.display = 'flex';
                document.getElementById('pause-btn').textContent = 'Resume';
            } else {
                pauseModal.style.display = 'none';
                document.getElementById('pause-btn').textContent = 'Pause';
            }
        }

        // Confirm exit
        function confirmExit() {
            document.getElementById('exit-modal').style.display = 'flex';
            isPaused = true;
        }

        // Close modal
        function closeModal() {
            document.getElementById('exit-modal').style.display = 'none';
            isPaused = false;
        }

        // Exit game
        function exitGame() {
            window.location.href = 'home.html';
        }

        // Create confetti effect
        function createConfetti() {
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
            const confettiCount = 100;
            
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                
                // Random position
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = `-10px`;
                
                // Random color
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Random size
                const size = Math.random() * 10 + 5;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                
                // Random animation duration
                confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
                
                document.body.appendChild(confetti);
                
                // Remove after animation
                setTimeout(() => {
                    document.body.removeChild(confetti);
                }, 5000);
            }
        }

        // Initialize game
        document.addEventListener('DOMContentLoaded', () => {
            createBoard();
            startTimer();
        });