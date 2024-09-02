const { register_service, login_service,
    get_profile_service, update_profile_service,
    get_applications_service, post_application_service, get_application_service,
    edit_application_service, delete_application_service } = require('../services/user_service')

const { generate_jwt_token, verify_jwt_token } = require('../util/jwt')
const bcrypt = require('bcrypt')

async function register(req,res){
    req.body.password = bcrypt.hashSync(req.body.password,8)
    
    let response = await register_service(req.body)
    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(201).send(JSON.stringify(response.message))
    }
}

async function login(req,res){
    let db_res = await login_service(req.body)
    if(db_res){
        //user found
        if(bcrypt.compareSync(req.body.password, db_res.dataValues.password)){
            //checking password
            let token = generate_jwt_token(db_res.dataValues.id)
            res.status(200).send(JSON.stringify({ message: "Logged In Successfullly", token: token }))
        }else if(db_res.error){
            res.status(500).send(JSON.stringify(db_res.error))
        }
        else{
            res.status(401).send(JSON.stringify({ error: "Bad Credentials" }))
        }
    }else{
        res.status(404).send(JSON.stringify({ error: "User Not Found" }))
    }
}

async function get_profile(req,res){
    const userId = verify_jwt_token(req.query.userId)
    const response = await get_profile_service(userId)

    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(200).send(JSON.stringify(response.dataValues))
    }
}

async function update_profile(req,res){
    const userId = verify_jwt_token(req.query.userId)
    const data_to_insert = req.body
    const resume_file = req.file ? req.file.filename : null // Get the filename of the uploaded resume

    if(resume_file){
        data_to_insert.resume = resume_file // Add resume filename to the data
    }

    const response = await update_profile_service(userId, data_to_insert)
    if (response.error) {
        res.status(500).send(JSON.stringify(response.error))
    } else {
        res.status(201).send(JSON.stringify(response.message))
    }
}

async function get_applications(req,res){
    const userId = verify_jwt_token(req.query.userId)
    const response = await get_applications_service(userId)

    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        response.db_res = response.db_res.map(app => app.dataValues)// Extract the dataValues from each item
        res.status(200).json(response)
    }
}

async function post_application(req,res){
    const data_to_insert = req.body
    data_to_insert.userId = verify_jwt_token(data_to_insert.userId)

    let response = await post_application_service(data_to_insert)
    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(201).send(JSON.stringify(response.message))
    }
}

async function get_application(req,res){
    const query = req.query.search ? req.query.search.toLowerCase() : ''
    const response = await get_application_service(query)

    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        const data = response.map(app => app.dataValues)// Extract the dataValues from each item
        res.status(200).json(data)
    }
}

async function edit_application(req,res){
    const appId = req.query.appId
    const data_to_insert = req.body
    data_to_insert.userId = verify_jwt_token(data_to_insert.userId)

    const response = await edit_application_service(appId, data_to_insert)
    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(201).send(JSON.stringify(response.message))
    }
}

async function delete_application(req,res){
    const appId = req.query.appId

    const response = await delete_application_service(appId)
    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(204).send()
    }    
}

module.exports = { register, login, get_profile, update_profile,
    get_applications, post_application, get_application,
    edit_application, delete_application }