let timerInterval;
let time = 45*60;
let launch_time;
let remainingTime = time; // 45 minutes in seconds
let finished = false;

const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const progressBar = document.querySelector('.progress-bar');

function startTimer() {
    launch_time = new Date().getTime();
    finished = false;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}


function updateTimer() {
    remainingTime = time - Math.floor((new Date().getTime() - launch_time) / 1000);
    minutes = (remainingTime > 0) ? Math.floor(remainingTime / 60) : Math.ceil(remainingTime / 60);
    minutes = (minutes == 0 && remainingTime < 0 ) ? '-'+minutes : minutes;
    seconds = Math.abs(remainingTime % 60);
    seconds = (seconds < 10 && seconds >= 0) ? '0'+seconds : seconds;

    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
    updateProgressBar();

    if (remainingTime <= 0 && !finished) {
        finished = true;
        timerElement.textContent = 'TIME !';
        
    }
}

function updateProgressBar() {
    const percentage = (remainingTime / time) * 100;
    progressBar.style.width = `${percentage}%`;

    if (percentage < 50 && percentage > 25) {
      progressBar.className = "progress-bar bg-warning";
    }
    else if (percentage < 25 && percentage > 0) {
      progressBar.className = "progress-bar bg-danger";
    }
  }

function resetPage(){
    location.reload();
  }
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetPage);