const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const company_model = sequelize.define('companies',{
    company:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
    },
    location:{
        type: Sequelize.STRING,
    },
    size:{
        type: Sequelize.STRING,
    },
    phone:{
        type: Sequelize.STRING,
    },
    job_listing:{
        type: Sequelize.STRING,
    },
    email:{
        type: Sequelize.STRING,
    },
    hr_email:{
        type: Sequelize.STRING,
    },
    notes:{
        type: Sequelize.STRING
    },
    appId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = company_model