const { register, login, get_profile, update_profile,
    get_applications, post_application, get_application,
    edit_application, delete_application } = require('../controllers/user_controller')

const { verify_user } = require('../middlewares/user_auth')

module.exports = function(app){
    app.post('/user/register', verify_user, register),
    app.post('/user/login', login),
    app.get('/get-profile', get_profile),
    app.put('/update-profile', update_profile),
    app.get('/get-applications', get_applications),
    app.post('/post-application', post_application),
    app.get('/get-application', get_application),
    app.put('/edit-application', edit_application),
    app.delete('/delete-application', delete_application)
}