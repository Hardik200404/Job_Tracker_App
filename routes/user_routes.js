const { register, login, get_profile, update_profile } = require('../controllers/user_controller')

const upload = require('../middlewares/file_upload')
const { verify_user } = require('../middlewares/user_auth')

module.exports = function(app){
    app.post('/user/register', verify_user, register),
    app.post('/user/login', login),
    app.get('/get-profile', get_profile),
    app.put('/update-profile', upload.single('resume'), update_profile)
}