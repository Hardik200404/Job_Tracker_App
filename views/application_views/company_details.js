document.addEventListener('DOMContentLoaded', () => {
    // Fetch company details on page load
    fetch_company()
})

function fetch_company() {
    // Fetch company details from the server
    const appId = localStorage.getItem('appId')

    fetch(`http://localhost:3000/get-company?appId=${appId}`)
        .then(response => response.json())
        .then(data => {
            if(data){
                // Populate form fields with company details
                document.getElementById('company').value = data.company || ''
                document.getElementById('description').value = data.description || ''
                document.getElementById('location').value = data.location || ''
                document.getElementById('size').value = data.size || ''
                document.getElementById('phone').value = data.phone || ''
                document.getElementById('job_listing').value = data.job_listing || ''
                document.getElementById('email').value = data.email || ''
                document.getElementById('hr_email').value = data.hr_email || ''
                document.getElementById('notes').value = data.notes || ''
            }
        })
        .catch(error => {
            console.error(error)
            alert('Error Fetching Company')
        })
}

function handle_company_submit(event) {
    event.preventDefault()

    const appId = localStorage.getItem('appId')
    const form = document.getElementById('company_form')

    // Collect form data into an object
    const company_details = {
        company: form.company.value,
        description: form.description.value,
        location: form.location.value,
        size: form.size.value,
        phone: form.phone.value,
        job_listing: form.job_listing.value,
        email: form.email.value,
        hr_email: form.hr_email.value,
        notes: form.notes.value,
        appId: appId
    }
    // console.log(company_details)

    fetch('http://localhost:3000/edit-company', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(company_details)
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then(error => {
                throw { status: response.status, ...error } // Throw an error with status code and message
            })
        }
    }).then(data => {
        alert('Company Updated Successfully')
        fetch_company()
    }).catch(err => {
        if (err.status === 500) {
            alert("Server Error, Error Code: " + err.status)
        } else {
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
}