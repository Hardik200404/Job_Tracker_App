const user_model = require('../models/user_model')
const sequelize = require('../util/database')

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



module.exports = { register_service, login_service,
    get_profile_service, update_profile_service }