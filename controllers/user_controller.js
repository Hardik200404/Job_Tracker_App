const { register_service, login_service,
    get_profile_service, update_profile_service } = require('../services/user_service')

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


module.exports = { register, login, get_profile, update_profile }