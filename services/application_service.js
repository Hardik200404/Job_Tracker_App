const company_model = require('../models/company_model')
const sequelize = require('../util/database')

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

module.exports = { get_company_service, edit_company_service }