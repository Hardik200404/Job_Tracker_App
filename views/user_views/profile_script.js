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
        document.getElementById('resume').value = data.resume || ''
        document.getElementById('cover_letter').value = data.cover_letter || ''
        document.getElementById('languages').value = data.languages || ''
        document.getElementById('skills').value = data.skills || ''
        document.getElementById('current_role').value = data.current_role || ''
        document.getElementById('experience').value = data.experience || ''
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

    const user_details = {
        username: event.target.username.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
        resume: event.target.resume.value,
        cover_letter: event.target.cover_letter.value,
        languages: event.target.languages.value,
        skills: event.target.skills.value,
        current_role: event.target.current_role.value,
        experience: event.target.experience.value,
    }
    // console.log(user_details)

    const token = localStorage.getItem('token')

    fetch(`http://localhost:3000/update-profile?userId=${token}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_details)
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
        alert('Profile Updated Successfully')
    }).catch(err=>{
        if(err.status === 500){
            alert("Server Error, Error Code: " + err.status)
        }else{
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
}
