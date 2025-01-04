const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');
const sendMessageBtn = document.getElementById('sendMessage');
const resetMessageBtn = document.getElementById('resetMessage');

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


function resetPage() {
    Swal.fire({
        title: 'Êtes-vous sûr de vouloir réinitialiser le timer?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, réinitialiser',
        cancelButtonText: 'Non, annuler'
    }).then((result) => {
        if (result.value) {
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
    });
}

function startTimer() {
    Swal.fire({
        title: 'Êtes-vous sûr de vouloir démarrer le timer?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, démarrer',
        cancelButtonText: 'Non, annuler'
    }).then((result) => {
        if (result.value) {
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


function resetMessage() {
    msg = document.getElementById('message');
    msg.value = '';
    sendMessage();
}
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetPage);
sendMessageBtn.addEventListener('click', sendMessage);
resetMessageBtn.addEventListener('click', resetMessage);
