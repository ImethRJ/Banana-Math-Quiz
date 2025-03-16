document.addEventListener("DOMContentLoaded", function () {
    const easyButton = document.querySelector(".level-btn.easy");

    easyButton.addEventListener("click", function () {
        window.location.href = "easyquiz.html"; 
    });
});

document.addEventListener("DOMContentLoaded", function () {

    const easyButton = document.querySelector(".level-btn.mid");

    easyButton.addEventListener("click", function () {
        window.location.href = "midquiz.html"; 
    });
});

document.addEventListener("DOMContentLoaded", function () {
   
    const easyButton = document.querySelector(".level-btn.hard");

    easyButton.addEventListener("click", function () {
        window.location.href = "hardquiz.html"; 
    });
});

document.addEventListener("DOMContentLoaded", function () {

    const easyButton = document.querySelector(".level-btn.insane");

    easyButton.addEventListener("click", function () {
        window.location.href = "insanequiz.html";
    });
});