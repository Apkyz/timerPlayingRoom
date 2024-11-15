let timerInterval;
let time = 45 * 60;
let remainingTime = time; // 45 minutes in seconds
let finished = false;

const data = document.currentScript.dataset;
let launch_time = data.launch_time;

const timerElement = document.getElementById('timer');
const progressBar = document.querySelector('.progress-bar');

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

function startTimer() {

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

}


function updateTimer() {
    remainingTime = time - Math.floor((new Date().getTime() - launch_time) / 1000);

    let display_time = formatTime(remainingTime);

    document.getElementById("timer").textContent = display_time;
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

function formatTime(t) {
    minutes = (t > 0) ? Math.floor(t / 60) : Math.ceil(t / 60);
    minutes = (minutes == 0 && t < 0) ? '-' + minutes : minutes;
    seconds = Math.abs(t % 60);
    seconds = (seconds < 10 && seconds >= 0) ? '0' + seconds : seconds;
    return `${minutes}:${seconds}`;
}

function resetPage() {

    window.location.reload();


}

var ws_url = 'ws://' + window.location.host + '/ws/ticks/';
function connect() {
    var ws = new WebSocket(ws_url);

    ws.onmessage = function (event) {
        var data_ws = JSON.parse(event.data);

        if (data_ws['type'] === 'reset') {
            resetPage();
        }

        else if (data_ws['type'] === 'start') {
            launch_time =  parseFloat(data_ws['time'], 10);
            finished = false;

            startTimer();
        }

    }

    ws.onclose = function (event) {
        console.log('Connection closed');
        connect();

    }

    ws.onerror = function (event) {
        console.log('Error');
        ws.close();
    }
}


if (launch_time !== "None") {
    timerInterval = setInterval(updateTimer, 1000);
}

connect();
