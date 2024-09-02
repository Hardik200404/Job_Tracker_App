const { get_company_service, edit_company_service } = require('../services/application_service')

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

module.exports = { get_company, edit_company }
