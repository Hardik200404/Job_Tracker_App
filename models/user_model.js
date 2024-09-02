const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const user_model = sequelize.define('users',{
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    resume:{
        type: Sequelize.STRING,
    },
    cover_letter:{
        type: Sequelize.STRING,
    },
    languages:{
        type: Sequelize.STRING,
    },
    skills:{
        type: Sequelize.STRING,
    },
    current_role:{
        type: Sequelize.STRING,
    },
    experience:{
        type: Sequelize.FLOAT
    }
})

module.exports = user_model