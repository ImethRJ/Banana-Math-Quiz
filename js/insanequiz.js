// Firebase configuration - Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyA7js4aE8oDH9HPlQMJawxyDP3DwiY7xHc",
    authDomain: "banana-quiz-6bf99.firebaseapp.com",
    projectId: "banana-quiz-6bf99",
    storageBucket: "banana-quiz-6bf99.firebasestorage.app",
    messagingSenderId: "18102598554",
    appId: "1:18102598554:web:cac2591308e3b466d59823"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase auth and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state and handle UI accordingly
let currentUser = null;

auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        console.log("User logged in:", user.email);
      
        // Show save button if user is logged in
        const saveBtn = document.getElementById("save-btn");
        if (saveBtn) {
            saveBtn.style.display = "block";
        }
    } else {
        // User is signed out
        currentUser = null;
        console.log("No user logged in");
      
        // Hide save button if no user is logged in
        const saveBtn = document.getElementById("save-btn");
        if (saveBtn) {
            saveBtn.style.display = "none";
        }
    }
});

function exitGame() {
    window.location.href = 'home.html';
}

let correctAnswer = null;
let score = 0;
let lives = 1; // Insane level has only 1 life
let timeLeft = 15; // Insane level has only 15 seconds
let timer;
let consecutiveCorrect = 0; // Track consecutive correct answers for bonus

const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const questionImg = document.getElementById("question-img");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit-btn");
const resultElement = document.getElementById("result");

async function fetchQuestion() {
    try {
        // Show loading animation
        questionImg.src = ""; // Clear previous image
        questionImg.alt = "Loading puzzle...";
        
        // Reset UI
        resultElement.innerText = "";
        resultElement.classList.remove("fade-in", "correct", "incorrect");
        answerInput.value = "";
        answerInput.focus();
        
        // Add dramatic effect to the timer for insane mode
        timerElement.style.fontSize = "1.5rem";
        setTimeout(() => {
            timerElement.style.fontSize = "1rem";
        }, 300);
        
        const response = await fetch("https://marcconrad.com/uob/banana/api.php");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        questionImg.src = data.question;
        questionImg.alt = "Math puzzle";
        correctAnswer = data.solution;
        console.log("Solution:", correctAnswer);
        
        resetTimer();
    } catch (error) {
        console.error("Error fetching question:", error);
        questionImg.alt = "Error loading puzzle. Please try again.";
        setTimeout(fetchQuestion, 3000);
    }
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    
    if (userAnswer === "") {
        // Shake input to indicate it's required
        answerInput.classList.add("shake");
        setTimeout(() => answerInput.classList.remove("shake"), 500);
        return;
    }
    
    if (parseInt(userAnswer) === correctAnswer) {
        // Correct answer
        // Increment consecutive correct counter for bonus
        consecutiveCorrect++;
        
        // Calculate score with bonus for consecutive correct answers
        let pointsEarned = 35;
        let bonusPoints = 0;
        
        if (consecutiveCorrect >= 3) {
            bonusPoints = Math.min(25 * (consecutiveCorrect - 2), 100); 
        }
        
        const totalPoints = pointsEarned + bonusPoints;
        
        resultElement.innerHTML = `Correct! 🎉 <span style="color: #FFD700">+${pointsEarned}</span>`;
        
        if (bonusPoints > 0) {
            resultElement.innerHTML += ` <span style="color: #FF0055">COMBO BONUS: +${bonusPoints}</span>`;
        }
        
        resultElement.className = "fade-in correct";
        score += totalPoints;
        scoreElement.innerText = score;
        
        // Add intense visual feedback for insane mode
        document.body.style.animation = "flash 0.3s";
        setTimeout(() => {
            document.body.style.animation = "";
        }, 300);
        
        questionImg.style.filter = "brightness(1.2) hue-rotate(45deg)";
        setTimeout(() => {
            questionImg.style.filter = "none";
            fetchQuestion();
        }, 1500);
    } else {
        // Wrong answer
        resultElement.innerText = "Incorrect! ❌";
        resultElement.className = "fade-in incorrect";
        
        // Reset consecutive correct counter
        consecutiveCorrect = 0;
        
        // Add negative visual feedback with shaking for insane mode
        document.body.classList.add("shake-hard");
        questionImg.style.filter = "grayscale(1) brightness(0.5)";
        setTimeout(() => {
            document.body.classList.remove("shake-hard");
            questionImg.style.filter = "none";
        }, 800);
        
        reduceLife();
    }
}

function reduceLife() {
    lives--;
    updateLives();
    
    if (lives <= 0) {
        endGame();
    }
}

function updateLives() {
    let hearts = "";
    for (let i = 0; i < 1; i++) { // Insane level has only 1 heart
        hearts += i < lives ? "❤️" : "💔";
    }
    livesElement.innerHTML = hearts;
    
    // Visual indication for the single life
    if (lives === 1) {
        livesElement.style.color = "#FF0055";
        livesElement.style.animation = "pulse 0.5s infinite alternate";
    } else {
        livesElement.style.color = "#F44336";
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 15; // Insane level has 15 seconds
    timerElement.innerText = `${timeLeft}s`;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `${timeLeft}s`;
        
        // More intense visual warning when time is running low for insane mode
        if (timeLeft <= 10) {
            timerElement.style.color = timeLeft % 2 === 0 ? "#FF0055" : "white";
            timerElement.style.fontWeight = "bold";
            
            // Make the timer pulse faster as time runs out
            if (timeLeft <= 5) {
                timerElement.style.animation = "pulse 0.3s infinite alternate";
            }
        } else {
            timerElement.style.color = "white";
            timerElement.style.fontWeight = "normal";
            timerElement.style.animation = "";
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultElement.innerText = "Time's up! ⏰";
            resultElement.className = "fade-in incorrect";
            
            reduceLife();
            if (lives > 0) {
                setTimeout(fetchQuestion, 1500);
            }
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    
    // Create more dramatic game over overlay for insane mode
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
        color: white;
        text-align: center;
        padding: 20px;
        animation: pulseDark 2s infinite alternate;
    `;
    
    // Add CSS for the pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseDark {
            from { background: rgba(0,0,0,0.9); }
            to { background: rgba(30,0,10,0.95); }
        }
        
        @keyframes glowText {
            from { text-shadow: 0 0 5px #FF0055, 0 0 10px #FF0055; }
            to { text-shadow: 0 0 15px #FF0055, 0 0 30px #FF0055; }
        }
        
        .insane-title {
            color: #FF0055;
            animation: glowText 1.5s infinite alternate;
        }
        
        .insane-button {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .insane-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(255, 0, 85, 0.7);
        }
    `;
    document.head.appendChild(style);
    
    // More dramatic game over screen for insane mode
    overlay.innerHTML = `
        <h2 class="insane-title" style="font-size: 3rem; margin-bottom: 15px;">GAME OVER</h2>
        <p style="font-size: 1.5rem; margin-bottom: 10px;">Your final score:</p>
        <p style="font-size: 3rem; color: #FF0055; margin-bottom: 20px;">${score}</p>
        
        ${score > 300 ? `<p style="font-size: 1.2rem; margin-bottom: 20px; color: #FFD700;">IMPRESSIVE! You've mastered the INSANE difficulty!</p>` : ''}
        
        <div style="display: flex; gap: 15px; margin-top: 20px;">
            <button id="restart-btn" class="insane-button" style="
                padding: 12px 25px;
                font-size: 1.2rem;
                background: linear-gradient(to right, #FF0055, #800080);
                border: none;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-weight: 700;
            ">Try Again</button>
            ${currentUser ? `
            <button id="save-score-btn" class="insane-button" style="
                padding: 12px 25px;
                font-size: 1.2rem;
                background: linear-gradient(to right, #800080, #4B0082);
                border: none;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-weight: 700;
            ">Save Score</button>
            ` : ''}
            <button id="home-btn" class="insane-button" style="
                padding: 12px 25px;
                font-size: 1.2rem;
                background: linear-gradient(to right, #4B0082, #000000);
                border: none;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-weight: 700;
            ">Home</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners to buttons
    document.getElementById("restart-btn").addEventListener("click", restartGame);
    
    if (currentUser) {
        document.getElementById("save-score-btn").addEventListener("click", () => {
            saveScore();
            document.getElementById("save-score-btn").textContent = "Saved!";
            document.getElementById("save-score-btn").style.background = "#888";
            document.getElementById("save-score-btn").disabled = true;
        });
    }
    
    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = 'home.html';
    });
}

function restartGame() {
    score = 0;
    lives = 1; // Reset to 1 life for insane level
    consecutiveCorrect = 0; // Reset combo counter
    scoreElement.innerText = score;
    updateLives();
    document.querySelector("div[style*='z-index: 999']").remove();
    fetchQuestion();
}

function saveScore() {
    if (!currentUser) {
        // If no user is logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Only proceed if the score hasn't been saved yet or is not zero
    if (score === 0) {
        resultElement.innerText = "No score to save.";
        resultElement.className = "fade-in incorrect";
        return;
    }
    
    // Get current date/time
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
    // Store the current score value before resetting
    const currentScore = score;
    
    // Create score data object for individual game score
    const scoreData = {
        userEmail: currentUser.email,
        userId: currentUser.uid,
        score: currentScore,
        timestamp: timestamp,
        lives: lives,
        timeLeft: timeLeft,
        difficulty: "insane", // Add difficulty level for filtering in leaderboards
        consecutiveCorrect: consecutiveCorrect // Track max combo
    };
    
    // Disable the save button immediately to prevent multiple clicks
    const saveBtn = document.getElementById("save-btn");
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Saving...';
    saveBtn.disabled = true;
    
    // Create a batch to perform multiple operations atomically
    const batch = db.batch();
    
    // Reference to the individual score document
    const gameScoreRef = db.collection("scores").doc();
    
    // Reference to the user's total score document
    const userTotalRef = db.collection("userTotals").doc(currentUser.uid);
    
    // Add the individual game score
    batch.set(gameScoreRef, scoreData);
    
    // Update the user's total score using a transaction for data consistency
    db.runTransaction(async (transaction) => {
        // Get the current user total document
        const userTotalDoc = await transaction.get(userTotalRef);
        
        if (!userTotalDoc.exists) {
            // If this is the user's first game, create a new total document
            transaction.set(userTotalRef, {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                totalScore: currentScore,
                gamesPlayed: 1,
                highestScore: currentScore,
                lastPlayed: timestamp
            });
        } else {
            // Update existing total document
            const userData = userTotalDoc.data();
            const newTotalScore = userData.totalScore + currentScore;
            const newGamesPlayed = userData.gamesPlayed + 1;
            const newHighestScore = Math.max(userData.highestScore, currentScore);
            
            transaction.update(userTotalRef, {
                totalScore: newTotalScore,
                gamesPlayed: newGamesPlayed,
                highestScore: newHighestScore,
                lastPlayed: timestamp
            });
        }
        
        return Promise.resolve();
    })
    .then(() => {
        console.log("Score and user totals updated successfully");
        
        // Reset the score to prevent saving the same score multiple times
        score = 0;
        
        // Update the score display in the UI
        scoreElement.innerText = score;
        
        // Show success message to user
        resultElement.innerText = "Score saved successfully! 📊";
        resultElement.className = "fade-in correct";
        
        // Visual feedback
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Saved';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> SAVE';
            saveBtn.disabled = false;
        }, 3000);
    })
    .catch((error) => {
        console.error("Error updating score and totals: ", error);
        
        // Fallback to just saving the individual score if the transaction fails
        db.collection("scores").add(scoreData)
            .then((docRef) => {
                console.log("Individual score saved with ID: ", docRef.id);
                resultElement.innerText = "Score saved (but total not updated). Try again.";
                resultElement.className = "fade-in correct";
                
                // Still reset the score to prevent double-saving
                score = 0;
                scoreElement.innerText = score;
                
                // Re-enable the save button
                saveBtn.innerHTML = '<i class="fas fa-save"></i> SAVE';
                saveBtn.disabled = false;
            })
            .catch((secondError) => {
                console.error("Complete save failure: ", secondError);
                resultElement.innerText = "Failed to save score. Check permissions.";
                resultElement.className = "fade-in incorrect";
                
                // Re-enable the save button
                saveBtn.innerHTML = '<i class="fas fa-save"></i> SAVE';
                saveBtn.disabled = false;
            });
    });
}

submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

// Initialize the game
window.onload = function() {
    // Add event listener for the save button
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveScore);
        
        // Hide save button initially (will be shown if user is logged in)
        saveBtn.style.display = "none";
    }
    
    fetchQuestion();
};