const { get_company, edit_company } = require('../controllers/application_controller')
const { get_applications, post_application, get_application,
    edit_application, delete_application } = require('../controllers/user_controller')
const set_reminder = require('../controllers/reminder_controller')

module.exports = function(app){
    app.get('/get-applications', get_applications),
    app.post('/post-application', post_application),
    app.get('/get-application', get_application),
    app.put('/edit-application', edit_application),
    app.delete('/delete-application', delete_application),
    app.get('/get-company', get_company),
    app.put('/edit-company', edit_company),
    app.post('/set-reminder', set_reminder)
}