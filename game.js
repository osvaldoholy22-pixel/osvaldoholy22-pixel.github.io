let isPaused = false;
let gameLoop = null;
let gameStarted = false;

let highscore = localStorage.getItem("highscore") || 0;

const highscoreText = document.getElementById("highscore");
const scoreText = document.getElementById("score");
const bar = document.getElementById("bar");
const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");

const hitSound = new Audio("hit.mp3");
const failSound = new Audio("fail.mp3");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");
const pauseOverlay = document.getElementById("pauseOverlay");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const exitBtn = document.getElementById("exitBtn");

const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreText = document.getElementById("finalScore");
const retryBtn = document.getElementById("retryBtn");

// MENU
const mainMenu = document.getElementById("mainMenu");
const gameContainer = document.getElementById("gameContainer");

highscoreText.innerText = "Record: " + highscore;

let position = 0;
let speed = 4;
let direction = 1;
let score = 0;
let targetWidth = 80;

function startLoop() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(moveBar, 16);
}

function resetGameState() {
    isPaused = false;
    score = 0;
    speed = 4;
    direction = 1;
    targetWidth = 80;
    position = 0;

    scoreText.innerText = "Score: 0";
    pauseOverlay.style.display = "none";
    gameOverOverlay.style.display = "none";

    randomizeTarget();
}

function moveBar() {
    if (isPaused) return;

    position += speed * direction;

    if (position + bar.offsetWidth >= gameArea.offsetWidth || position <= 0) {
        direction *= -1;
    }

    bar.style.left = position + "px";
}

function randomizeTarget() {
    const maxPosition = gameArea.offsetWidth - targetWidth;
    const newPosition = Math.random() * maxPosition;
    target.style.width = targetWidth + "px";
    target.style.left = newPosition + "px";
}

function checkHit() {
    if (isPaused) return;

    const barRect = bar.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const hit =
        barRect.right > targetRect.left &&
        barRect.left < targetRect.right;

    if (hit) {
        hitSound.play();
        score++;
        scoreText.innerText = "Score: " + score;

        speed += 0.5;
        targetWidth -= 5;
        if (targetWidth < 20) targetWidth = 20;

        randomizeTarget();
    } else {
        failSound.play();

        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore);
            highscoreText.innerText = "Record: " + highscore;
        }

        finalScoreText.innerText = "Sua pontuação: " + score;
        gameOverOverlay.style.display = "flex";

        clearInterval(gameLoop);
        gameLoop = null;
    }
}

function pauseGame() {
    if (isPaused) return;
    isPaused = true;
    clearInterval(gameLoop);
    pauseOverlay.style.display = "flex";
}

function resumeGame() {
    if (!isPaused) return;
    isPaused = false;
    startLoop();
    pauseOverlay.style.display = "none";
}

// EVENTOS
startBtn.onclick = () => {
    startScreen.style.display = "none";

    if (!gameStarted) {
        gameArea.addEventListener("click", checkHit);
        gameStarted = true;
    }

    resetGameState();
    startLoop();
};

retryBtn.onclick = () => {
    resetGameState();
    startLoop();
};

pauseBtn.onclick = () => isPaused ? resumeGame() : pauseGame();
resumeBtn.onclick = resumeGame;

restartBtn.onclick = () => {
    pauseOverlay.style.display = "none";
    resetGameState();
    startLoop();
};

exitBtn.onclick = () => {
    clearInterval(gameLoop);
    gameLoop = null;

    pauseOverlay.style.display = "none";
    gameOverOverlay.style.display = "none";
    gameContainer.style.display = "none";
    mainMenu.style.display = "flex";
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        isPaused ? resumeGame() : pauseGame();
    }
});

// MENU
document.getElementById("playBtn").onclick = () => {
    mainMenu.style.display = "none";
    gameContainer.style.display = "block";
};

document.getElementById("helpBtn").onclick = () => {
    document.getElementById("helpOverlay").style.display = "flex";
};

document.getElementById("settingsBtn").onclick = () => {
    document.getElementById("settingsOverlay").style.display = "flex";
};

document.getElementById("aboutBtn").onclick = () => {
    document.getElementById("aboutOverlay").style.display = "flex";
};

function closeOverlay() {
    document.querySelectorAll(".overlay").forEach(o => o.style.display = "none");
}