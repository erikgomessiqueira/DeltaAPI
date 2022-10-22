require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000

//Define Timezone
process.env.TZ = 'America/Sao_Paulo'

const temperatureRoutes = require('./routes/temperature')
const temperaturesRoutes = require('./routes/temperatures')
const deviceRoutes = require('./routes/device')
const devicesRoutes = require('./routes/devices')
const authRoutes = require('./routes/auth')
const xlsxFile = require('./routes/xlsxFile')


//Data sensitive of Database
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbPermission = process.env.DB_PERMISSON

//config cors
app.use(cors())

// Config middleware read JSON
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// config temperature routes.
app.use('/temperature', temperatureRoutes)

// config temperatures routes.
app.use('/temperatures', temperaturesRoutes)

//config devices routes.
app.use('/device', deviceRoutes)
//config device routes.
app.use('/devices', devicesRoutes)

//config registers routes.
app.use('/auth', authRoutes)

// config download data.
app.use('/download', xlsxFile)

app.get('/', (req, res) =>{
    res.status(200).json({message: "Bem vindo"})
})

// mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.29fyyuk.mongodb.net/?retryWrites=true&w=majority`) 
    mongoose.connect(`mongodb://${dbUser}:${dbPassword}@localhost:27017/Ra?authSource=${dbPermission}`)
    .then(()=>{
        console.log("Conectado ao Banco")
        app.listen(port, () => console.log(`A API esta rodando na porta ${port}!`))
    })
    .catch((err)=>{
        console.log(`${err}`)
    })