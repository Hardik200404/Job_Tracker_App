const express = require('express')
const cors = require('cors')
const path = require('path')
const sequelize = require('./util/database')
const user_model = require('./models/user_model.js')
const application_model = require('./models/application_model.js')

const app = express()

// Middleware
app.use(express.static(path.join(__dirname, 'views')))
app.use(cors())
app.use(express.json())
app.use(express.static('views/user_views'))

require('./routes/user_routes')(app)

app.get('/',(req,res)=>{
    // console.log("hello")
    res.sendFile(path.join(__dirname, 'views/user_views', 'index.html'))
})

user_model.hasMany(application_model)
application_model.belongsTo(user_model)

let PORT = process.env.PORT || 3000

sequelize.sync()
.then(result => {
    app.listen(PORT)
    console.log("Synced with DB and app runing on port: ",PORT)
}).catch(err => console.log(err))