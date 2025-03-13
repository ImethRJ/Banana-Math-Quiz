document.addEventListener("DOMContentLoaded", function () {
    // Select the Easy button
    const easyButton = document.querySelector(".level-btn.easy");

    // Add event listener for click
    easyButton.addEventListener("click", function () {
        window.location.href = "easyquiz.html"; // Redirect to quiz.html
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Select the Easy button
    const easyButton = document.querySelector(".level-btn.mid");

    // Add event listener for click
    easyButton.addEventListener("click", function () {
        window.location.href = "midquiz.html"; // Redirect to quiz.html
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Select the Easy button
    const easyButton = document.querySelector(".level-btn.hard");

    // Add event listener for click
    easyButton.addEventListener("click", function () {
        window.location.href = "hardquiz.html"; // Redirect to quiz.html
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Select the Easy button
    const easyButton = document.querySelector(".level-btn.insane");

    // Add event listener for click
    easyButton.addEventListener("click", function () {
        window.location.href = "insanequiz.html"; // Redirect to quiz.html
    });
});