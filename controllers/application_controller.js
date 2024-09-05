const { get_applications_service, post_application_service, 
    get_application_service, edit_application_service, 
    delete_application_service, get_company_service, 
    edit_company_service } = require('../services/application_service')

const { verify_jwt_token } = require('../util/jwt')

async function get_applications(req,res){
    const userId = verify_jwt_token(req.query.userId)
    
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const start_date = req.query.start_date ? new Date(req.query.start_date) : null
    const end_date = req.query.end_date ? new Date(req.query.end_date) : null
    
    try{
        const response = await get_applications_service(userId, page, limit, start_date, end_date)

        if(response.error){
            res.status(500).send(JSON.stringify(response.error))
        }else{
            response.db_res = response.db_res.map(app => app.dataValues) // Extract the dataValues from each item
            res.status(200).json(response)
        }
    }catch(err){
        res.status(500).send(JSON.stringify(err))
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

async function get_company(req,res){
    const appId = req.query.appId
    const response = await get_company_service(appId)
    if(response){
        if(response.error){
            res.status(500).send(JSON.stringify(response.error))
        }else{
            res.status(200).send(JSON.stringify(response))
        }
    }else{
        res.status(200).send(JSON.stringify(response))
    }
}

async function edit_company(req,res){
    const data_to_insert = req.body
    
    const response = await edit_company_service(data_to_insert)
    if(response.error){
        res.status(500).send(JSON.stringify(response.error))
    }else{
        res.status(201).send(JSON.stringify(response.message))
    }
}

module.exports = { get_applications, post_application, get_application,
    edit_application, delete_application, get_company, edit_company }
