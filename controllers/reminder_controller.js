const set_reminder_service = require('../services/reminder_service')

function set_reminder(req,res) {
    const response = set_reminder_service(req.body)

    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(201).send(JSON.stringify(response.message))
    }
}

module.exports = set_reminder