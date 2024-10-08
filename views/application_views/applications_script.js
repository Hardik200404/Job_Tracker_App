document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('application_form')
    form.addEventListener('submit', handle_application_submit)

    const search_form = document.getElementById('search_form')
    search_form.addEventListener('submit', handle_search_submit)

    const date_filter_form = document.getElementById('date_filter_form')
    date_filter_form.addEventListener('submit', handle_date_filter_submit)
    
    window.current_page = 1
    window.total_pages = 1

    // Add event listeners for pagination buttons
    document.getElementById('prev_page').addEventListener('click', ()=>{
        if(window.current_page > 1){
            window.current_page--
            fetch_applications()
        }
    })

    document.getElementById('next_page').addEventListener('click', ()=>{
        if(window.current_page < window.total_pages){
            window.current_page++
            fetch_applications()
        }
    })

    fetch_applications()
})

function fetch_applications(){
    const token = localStorage.getItem('token')

    const start_date = document.getElementById('start_date').value
    const end_date = document.getElementById('end_date').value

    fetch(`http://localhost:3000/get-applications?userId=${token}&page=${window.current_page}&limit=5&start_date=${start_date}&end_date=${end_date}`,{
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

        window.total_pages = data.total_pages || 1
        update_pagination_controls()
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
        const row = document.createElement('tr')

        let date_time = item.createdAt
        date_time = new Date(date_time)
        date_time = date_time.toLocaleDateString() + date_time.toLocaleTimeString()

        row.innerHTML = `
            <td>
                ${item.company ? item.company : 'N/A'}
                <button class='details-btn' title='Details' onclick="get_details(${item.id})">Details</button>
            </td>
            <td>${item.location ? item.location : 'N/A'}</td>
            <td>${item.url ? item.url : 'N/A'}</td>
            <td>${item.role ? item.role : 'N/A'}</td>
            <td>${item.salary ? item.salary : 'N/A'}</td>
            <td>${item.status ? item.status : 'N/A'}</td>
            <td>${item.resume ? item.resume : 'N/A'}</td>
            <td>${item.cover_letter ? item.cover_letter : 'N/A'}</td>
            <td>${item.notes ? item.notes : 'N/A'}</td>
            <td>${date_time}</td>
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

function get_details(appId){
    localStorage.setItem('appId', appId)
    window.location.href = 'company_details.html'
}

function update_pagination_controls(){
    const prev_button = document.getElementById('prev_page')
    const next_button = document.getElementById('next_page')

    // Enable or disable buttons based on the current page
    prev_button.disabled = window.current_page <= 1
    next_button.disabled = window.current_page >= window.total_pages
}

function handle_date_filter_submit(event){
    event.preventDefault()
    window.current_page = 1 // Reset to first page on new filter
    fetch_applications()
}