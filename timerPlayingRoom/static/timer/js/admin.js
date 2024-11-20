const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');
const sendMessageBtn = document.getElementById('sendMessage');

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


function resetPage() {
    fetch('/api/timer/reset_timer/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    }).then(() => {

    }).catch(error => {
        console.error('Error:', error);
    });

}


function startTimer() {

    fetch('/api/timer/start_timer/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
    }).then(response => response.json())
        .then(data => {

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function sendMessage() {
    fetch('/api/message/send_message/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            content: document.getElementById('message').value
        })
    }).then(response => response.json())
        .then(data => {

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetPage);
sendMessageBtn.addEventListener('click', sendMessage);
