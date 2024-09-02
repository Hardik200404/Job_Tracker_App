document.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token')

    fetch(`http://localhost:3000/get-profile?userId=${token}`,{
        method: 'GET',
    }).then(response=>{
        if(response.ok){
            return response.json()
        }else{
            // Handle different response statuses
            return response.json().then(error=>{
                throw { status: response.status, ...error } // Throw an error with status code and message
            })
        }
    }).then(data=>{
        // console.log(data)
        document.getElementById('username').value = data.username || ''
        document.getElementById('email').value = data.email || ''
        document.getElementById('phone').value = data.phone || ''
        document.getElementById('cover_letter').value = data.cover_letter || ''
        document.getElementById('languages').value = data.languages || ''
        document.getElementById('skills').value = data.skills || ''
        document.getElementById('current_role').value = data.current_role || ''
        document.getElementById('experience').value = data.experience || ''

        let resume_link
        if(data.resume){
            let resume_name = data.resume.split('_')
            resume_name.pop()
            resume_name = resume_name.join(' ')
            resume_link = `<a href="uploads/${data.resume}" target="_blank">${resume_name}</a>`
        }else{
            resume_link = 'None'
        }
        document.getElementById('resume-link').innerHTML = resume_link

    }).catch(err=>{
        if(err.status === 500){
            alert("Server Error, Error Code: " + err.status)
        }else{
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
})

function handle_profile_submit(event){
    event.preventDefault()

    const form = document.getElementById('profile_form')
    const formData = new FormData(form)

    const token = localStorage.getItem('token')

    fetch(`http://localhost:3000/update-profile?userId=${token}`, {
        method: 'PUT',
        body: formData
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            return response.json().then(error => {
                throw { status: response.status, ...error } // Throw an error with status code and message
            })
        }
    }).then(data => {
        alert('Profile Updated Successfully')
    }).catch(err => {
        if (err.status === 500) {
            alert("Server Error, Error Code: " + err.status)
        } else {
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
}
