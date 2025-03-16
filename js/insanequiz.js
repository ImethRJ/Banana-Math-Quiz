function exitGame() {
            window.location.href = 'home.html';
        }

let correctAnswer = null;
let score = 0;
let lives = 1;
let timeLeft = 15;
let timer;

const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const questionImg = document.getElementById("question-img");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit-btn");
const resultElement = document.getElementById("result");

async function fetchQuestion() {
    try {
        questionImg.src = ""; 
        questionImg.alt = "Loading puzzle...";
        resultElement.innerText = "";
        resultElement.classList.remove("fade-in", "correct", "incorrect");
        answerInput.value = "";
        answerInput.focus();
        
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
        answerInput.classList.add("shake");
        setTimeout(() => answerInput.classList.remove("shake"), 500);
        return;
    }
    
    if (parseInt(userAnswer) === correctAnswer) {
        resultElement.innerText = "Correct! 🎉";
        resultElement.className = "fade-in correct";
        score += 20;
        scoreElement.innerText = score;
        
        questionImg.style.filter = "brightness(1.1)";
        setTimeout(() => {
            questionImg.style.filter = "none";
            fetchQuestion();
        }, 1500);
    } else {
        resultElement.innerText = "Incorrect! Try again ❌";
        resultElement.className = "fade-in incorrect";
        
        questionImg.style.filter = "grayscale(0.5)";
        setTimeout(() => {
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
    let hearts = lives > 0 ? "❤️" : "💔";
    livesElement.innerHTML = hearts;
    
    if (lives === 1) {
        livesElement.style.color = "#F44336";
        livesElement.style.animation = "pulse 0.8s infinite alternate";
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.innerText = `${timeLeft}s`;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `${timeLeft}s`;
        
        if (timeLeft <= 5) {
            timerElement.style.color = timeLeft % 2 === 0 ? "#FF5722" : "white";
        } else {
            timerElement.style.color = "white";
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultElement.innerText = "Time's up! ⏰";
            resultElement.className = "fade-in incorrect";
            reduceLife();
            setTimeout(fetchQuestion, 1500);
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
        color: white;
        text-align: center;
        padding: 20px;
    `;
    
    overlay.innerHTML = `
        <h2 style="font-size: 2.5rem; margin-bottom: 15px;">Game Over!</h2>
        <p style="font-size: 1.5rem; margin-bottom: 20px;">Your final score: ${score}</p>
        <div style="display: flex; gap: 15px; margin-top: 20px;">
            <button id="restart-btn" style="
                padding: 12px 25px;
                font-size: 1.2rem;
                background: linear-gradient(to right, #FF9A00, #FF6D00);
                border: none;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-weight: 700;
            ">Play Again</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("restart-btn").addEventListener("click", restartGame);
}

function restartGame() {
    score = 0;
    lives = 1;
    scoreElement.innerText = score;
    updateLives();
    document.querySelector("div[style*='z-index: 999']").remove();
    fetchQuestion();
}

submitBtn.addEventListener("click", checkAnswer);
answerInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

fetchQuestion();