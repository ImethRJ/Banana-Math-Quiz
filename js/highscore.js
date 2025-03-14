document.addEventListener("DOMContentLoaded", () => {
    const scores = JSON.parse(localStorage.getItem("highscores")) || [];
    const list = document.getElementById("highscore-list");
    
    scores.sort((a, b) => b.score - a.score);
    
    scores.forEach(score => {
        const li = document.createElement("li");
        li.innerText = `${score.username}: ${score.score}`;
        list.appendChild(li);
    });
});

function clearScores() {
    localStorage.removeItem("highscores");
    location.reload();
}