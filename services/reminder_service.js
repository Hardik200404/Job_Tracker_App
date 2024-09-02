const Sib = require('sib-api-v3-sdk')
const schedule = require('node-schedule')

async function send_email(email, subject, body, date_time) {
    //configure email
    const client = Sib.ApiClient.instance
    const api_key_obj = client.authentications['api-key']
    api_key_obj.apiKey = process.env.SIB_API_KEY
    
    const sender = {
        email: process.env.EMAIL,
        name: 'Hardik'
    }
    const receivers = [{ email: email }]

    try{
        const email_api = new Sib.TransactionalEmailsApi()
        await email_api.sendTransacEmail({
            sender,
            to: receivers,
            subject: subject,
            htmlContent: body
        })
        console.log(`Reminder Email Sent To ${email} At ${new Date(date_time)}`)
    }catch(err){
        console.log(err)
        return err
    }
}

function set_reminder_service(data) {
    try{ 
        const job_function = () => send_email(data.email, data.subject, data.body, data.datetime)

        schedule.scheduleJob(new Date(data.datetime), job_function)

        return { message: 'Reminder Set' }
    }catch(err){
        console.log(err)
        return { error: err }
    }
}

module.exports = set_reminder_service 