const application_model = require('../models/application_model')
const company_model = require('../models/company_model')
const sequelize = require('../util/database')

async function get_applications_service(userId, page = 1, limit = 5, start_date = null, end_date = null){
    const offset = (page - 1) * limit

    const query_conditions = { userId: userId }
    if(start_date && end_date){
        // Set start_date to beginning of the day
        const start = new Date(start_date)
        start.setHours(0, 0, 0, 0)

        // Set end_date to end of the day
        const end = new Date(end_date)
        end.setHours(23, 59, 59, 999)

        query_conditions.createdAt = {
            [Op.between]: [start, end]
        }
    }else if(start_date){
        const start = new Date(start_date)
        start.setHours(0, 0, 0, 0)
        
        query_conditions.createdAt = {
            [Op.gte]: start
        }
    }else if(end_date){
        const end = new Date(end_date)
        end.setHours(23, 59, 59, 999)
        
        query_conditions.createdAt = {
            [Op.lte]: end
        }
    }
        

    try{
        let db_res = await application_model.findAndCountAll({
            where: query_conditions,
            limit: limit,
            offset: offset
        })
        
        // Calculate statistics
        const stats = db_res.rows.reduce((acc, app)=>{
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
        
        const total_pages = Math.ceil(db_res.count / limit)

        return { db_res: db_res.rows, stats: stats, total_pages: total_pages }
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