document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('application_form')
    form.addEventListener('submit', handle_application_submit)

    const search_form = document.getElementById('search_form')
    search_form.addEventListener('submit', handle_search_submit)
    
    fetch_applications()
})

function fetch_applications(){
    const token = localStorage.getItem('token')
    fetch(`http://localhost:3000/get-applications?userId=${token}`,{
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
        document.getElementById('total-applications').textContent = `Total Applications: ${data.stats.total}`
        document.getElementById('applications-applied').textContent = `Applied: ${data.stats.applied}`
        document.getElementById('applications-interviewing').textContent = `Interviewing: ${data.stats.interviewing}`
        document.getElementById('applications-interviewed').textContent = `Interviewed: ${data.stats.interviewed}`
        document.getElementById('applications-got_offer').textContent = `Got Offer: ${data.stats.got_offer}`
        
        display_applications(data.db_res)
    }).catch(err=>{
        if(err.status === 500){
            alert("Server Error, Error Code: " + err.status)
        }else{
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
}

function handle_application_submit(event){
    event.preventDefault()
    
    const token = localStorage.getItem('token')

    const application_details = {
        company: event.target.company.value,
        location: event.target.location.value,
        salary: event.target.salary.value,
        role: event.target.role.value,
        resume: event.target.resume.value,
        cover_letter: event.target.coverLetter.value,
        status: event.target.status.value,
        notes: event.target.notes.value,
        userId: token
    }
    // console.log(application_details)

    if(event.target.appId.value){
        fetch(`http://localhost:3000/edit-application?appId=${event.target.appId.value}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(application_details)
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
            alert('Application Updated Successfully')
            fetch_applications()
        }).catch(err=>{
            if(err.status === 500){
                alert("Server Error, Error Code: " + err.status)
            }else{
                alert("An unexpected error occurred")
            }
            console.log(err)
        })
    }else{
        fetch('http://localhost:3000/post-application',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(application_details)
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
            alert('Application Added Successfully')
            fetch_applications()
        }).catch(err=>{
            if(err.status === 500){
                alert("Server Error, Error Code: " + err.status)
            }else{
                alert("An unexpected error occurred")
            }
            console.log(err)
        })
    }
}

function handle_search_submit(event){
    event.preventDefault()

    const search_query = document.getElementById('search_query')
    const query = search_query.value.trim()
    if(query){
        search_query.value = ''// Clear search bar
        
        fetch(`http://localhost:3000/get-application?search=${query}`,{
            method:'GET'
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
            display_applications(data)
        }).catch(errerr=>{
            if(err.status === 500){
                alert("Server Error, Error Code: " + err.status)
            }else{
                alert("An unexpected error occurred")
            }
            console.log(err)
        })
    }
}

function display_applications(data){
    const tbody = document.querySelector('#applications_list tbody')
    tbody.innerHTML = ''

    data.forEach(item=>{
        const item_data = JSON.stringify(item)
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${item.company ? item.company : 'N/A'}</td>
            <td>${item.location ? item.location : 'N/A'}</td>
            <td>${item.url ? item.url : 'N/A'}</td>
            <td>${item.role ? item.role : 'N/A'}</td>
            <td>${item.salary ? item.salary : 'N/A'}</td>
            <td>${item.status ? item.status : 'N/A'}</td>
            <td>${item.resume ? item.resume : 'N/A'}</td>
            <td>${item.cover_letter ? item.cover_letter : 'N/A'}</td>
            <td>${item.notes ? item.notes : 'N/A'}</td>
            <td>
                <button class='edit-btn' title='Edit' onclick="edit_application(${item.id})">Edit</button>
                <button class='delete-btn' title='Delete' onclick="delete_application(${item.id})">Delete</button>
            </td>
        `
        tbody.appendChild(row)

        const edit_btn = row.querySelector('.edit-btn')
        edit_btn.addEventListener('click', () => {
            edit_application(item)
        })

    })
}

function edit_application(item){
    document.getElementById('appId').value = item.id
    document.getElementById('company').value = item.company || ''
    document.getElementById('location').value = item.location || ''
    document.getElementById('salary').value = item.salary || ''
    document.getElementById('role').value = item.role || ''
    document.getElementById('resume').value = item.resume || ''
    document.getElementById('coverLetter').value = item.cover_letter || ''
    document.getElementById('status').value = item.status || 'Applied'
    document.getElementById('notes').value = item.notes || ''

    document.getElementById('application_form').scrollIntoView({ behavior: 'smooth' })
}

function delete_application(appId){
    fetch(`http://localhost:3000/delete-application?appId=${appId}`,{
        method: 'DELETE'
    }).then(response=>{
        alert('Application Removed')
        window.location.reload()
    }).catch(err=>{
        if(err.status === 500){
            alert("Server Error, Error Code: " + err.status)
        }else{
            alert("An unexpected error occurred")
        }
        console.log(err)
    })
}