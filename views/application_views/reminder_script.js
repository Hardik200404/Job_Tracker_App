document.getElementById('reminder_form').addEventListener('submit', function(event) {
    event.preventDefault()

    const formData = new FormData(this)
    const data = {
        email: formData.get('email'),
        subject: formData.get('subject'),
        body: formData.get('body'),
        datetime: formData.get('datetime')
    }

    fetch('http://localhost:3000/set-reminder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then(error => {
                throw { status: response.status, ...error } // Throw an error with status code and message
            })
        }
    }).then(data => {
        alert('Reminder Set Successfully')
        window.location.href = 'applications.html'
    }).catch(err => {
        if (err.status === 500) {
            alert("Server Error, Error Code: " + err.status)
        } else {
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
})
