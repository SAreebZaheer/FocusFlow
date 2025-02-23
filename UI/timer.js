let timer;
let timeLeft = 25 * 60;
let pomodorosCount = 0;
let isRunning = false;
let treeImages = ['tree1.jpg', 'tree2.jpg', 'Tree3.jpg'];
let currentTreeIndex = 0;
let currentMusicTrack = null;

const countdownElement = document.getElementById('countdown');
const treeElement = document.getElementById('tree');
const startButton = document.getElementById('startButton');
const pomodorosCountElement = document.getElementById('pomodorosCount');
const musicSelect = document.getElementById('musicSelect');
const lofiMusic = document.getElementById('lofiMusic');
const pomodoroHashes = document.getElementById('pomodoroHashes');

function startPauseTimer() {
    isRunning = !isRunning;

    if (isRunning) {
        startButton.textContent = "Pause";
        if (currentMusicTrack) { // Only play if a track is selected
            lofiMusic.play();
        }
        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                pomodorosCount++;
                pomodorosCountElement.textContent = pomodorosCount;
                updatePomodoroDisplay();
                resetTimer();
                return;
            }

            timeLeft--;
            updateCountdown();
            growTree();

        }, 1000);

    } else {
        startButton.textContent = "Start";
        clearInterval(timer);
        lofiMusic.pause();
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "Start";
    timeLeft = 25 * 60;
    updateCountdown();
    currentTreeIndex = 0;
    treeElement.src = treeImages[currentTreeIndex];
    updatePomodoroDisplay();
}

function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function growTree() {
    const totalTime = 25 * 60;
    const growthPercentage = 1 - (timeLeft / totalTime);

    const nextTreeIndex = Math.floor(growthPercentage * (treeImages.length - 1));

    if (nextTreeIndex > currentTreeIndex && nextTreeIndex < treeImages.length) {
        currentTreeIndex = nextTreeIndex;
        treeElement.src = treeImages[currentTreeIndex];
    }
}

function updatePomodoroDisplay() {
    pomodorosCountElement.textContent = "# " + pomodorosCount; // Hash before count
}

musicSelect.addEventListener('change', () => {
    const selectedTrack = musicSelect.value;

    if (currentMusicTrack) {
        lofiMusic.pause();
        lofiMusic.src = "";
        currentMusicTrack = null;
    }

    if (selectedTrack) {
        lofiMusic.src = selectedTrack;
        lofiMusic.play();
        currentMusicTrack = selectedTrack;
    }
});

startButton.addEventListener('click', startPauseTimer);

lofiMusic.src = ""; // Initialize with no source

updateCountdown();
updatePomodoroDisplay();