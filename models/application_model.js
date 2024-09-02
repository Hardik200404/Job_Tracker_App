const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const application_model = sequelize.define('applications',{
    company:{
        type: Sequelize.STRING,
        allowNull: false
    },
    location:{
        type: Sequelize.STRING
    },
    url:{
        type: Sequelize.STRING,
    },
    role:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    salary:{
        type: Sequelize.INTEGER,
    },
    resume:{
        type: Sequelize.STRING,
    },
    cover_letter:{
        type: Sequelize.STRING,
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    },
    notes:{
        type: Sequelize.STRING,
    }
})

module.exports = application_model