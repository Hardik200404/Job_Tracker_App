const user_model = require('../models/user_model')
const application_model = require('../models/application_model')
const sequelize = require('../util/database')

require('dotenv').config()

async function register_service(user){
    try{
        await sequelize.transaction(async(t)=>{
            await user_model.create(user, { transaction: t })
        })
        return { message: 'User Registered Successfully' }
    }catch(err){
        console.log(err)
        return { error:err }
    }
}

async function login_service(user){
    try{
        let db_res = await user_model.findOne({ where: { email: user.email }})
        return db_res
    }catch(err){
        console.log(err)
        return { error: err }
    }
}

async function get_profile_service(userId){
    try{
        let db_res = await user_model.findByPk(userId)
        return db_res
    }catch(err){
        console.log(err)
        return { error: err }
    }
}

async function update_profile_service(userId, data_to_insert){
    userId = +userId
    data_to_insert.experience = data_to_insert.experience == '' ? '' : +data_to_insert.experience 
    try{
        await sequelize.transaction(async(t)=>{
            await user_model.update(
                data_to_insert,
                {where: { id: userId }, transaction: t}
            )
        })
        return { message: 'Profile Updated Successfully' }
    }catch(err){
        console.error(err)
        return { error: err }
    }
}

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
            await application_model.create(data_to_insert, { transaction: t })
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

module.exports = { register_service, login_service,
    get_profile_service, update_profile_service,
    get_applications_service, post_application_service, get_application_service,
    edit_application_service, delete_application_service }