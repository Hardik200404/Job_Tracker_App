const application_model = require('../models/application_model')
const company_model = require('../models/company_model')
const sequelize = require('../util/database')

async function get_applications_service(userId){
    try{
        let db_res = await application_model.findAll({ where: { userId: userId }})
        
        // Calculate statistics
        const stats = db_res.reduce((acc, app) => {
            acc.total++
            if (app.status === 'applied') acc.applied++
            if (app.status === 'interviewing') acc.interviewing++
            if (app.status === 'interviewed') acc.interviewed++
            if (app.status === 'got_offer') acc.got_offer++
            return acc
        }, {
            total: 0,
            applied: 0,
            interviewing: 0,
            interviewed: 0,
            got_offer: 0
        })
        
        return { db_res: db_res, stats: stats }
    }catch(err){
        console.log(err)
        return { error: err }
    }
}

async function post_application_service(data_to_insert){
    try{
        await sequelize.transaction(async(t)=>{
            const application = await application_model.create(data_to_insert, { transaction: t })

            await company_model.create(
                { 
                    company: data_to_insert.company,
                    appId: application.id
                },
                { transaction: t }
            )
        })
        return { message: 'Application Added Successfully' }
    }catch(err){
        console.log(err)
        return { error:err }
    }
}

const { Op } = require('sequelize')

async function get_application_service(query){
    try{
        let db_res = await application_model.findAll({
            where: {
                [ Op.or ]: [
                    { company: { [Op.like]: `%${query}%` } },
                    { location: { [Op.like]: `%${query}%` } },
                    { role: { [Op.like]: `%${query}%` } },
                    { status: { [Op.like]: `%${query}%` } }
                ]
            }
        })
        return db_res
    }catch(err){
        console.log(err)
        return { error:err }
    }
}

async function edit_application_service(appId, data_to_insert){
    appId = +appId
    try{
        await sequelize.transaction(async(t)=>{
            await application_model.update(
                data_to_insert, 
                { where: { id: appId }}, 
                { transaction: t })
        })
        return { message: 'Application Updated Successfully' }
    }catch(err){
        console.log(err)
        return { error:err }
    }
}

async function delete_application_service(appId){
    appId = +appId
    try{
        await sequelize.transaction(async(t)=>{
            await application_model.destroy(
                { where: { id: appId }},
                { transaction: t }
            )
        })
        return { message: 'Application Removed Successfully' }
    }catch(err){
        console.log(err)
        return { error: err }
    }
}

async function get_company_service(appId){
    appId = +appId
    try{
        let db_res = await company_model.findOne({ where: { appId: appId }})
        return db_res
    }catch(err){
        console.log(err)
        return { error:err }
    }
}

async function edit_company_service(data_to_insert){
    appId = +data_to_insert.appId
    try{
        await sequelize.transaction(async(t)=>{
            await company_model.update(
                data_to_insert, 
                { where: { appId: appId }}, 
                { transaction: t })
        })
        return { message: 'Company Details Updated Successfully' }
    }catch(err){
        console.log(err)
        return { error:err }
    }
}

module.exports = { get_applications_service, post_application_service, 
    get_application_service, edit_application_service, 
    delete_application_service, get_company_service, edit_company_service }