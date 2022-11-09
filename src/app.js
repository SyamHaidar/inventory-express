const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const morgaLog = require('./middleware/morgan')
const router = require('./routes')
const { Sequelize } = require('sequelize')

// -----------------------------------------------------------------------------

const app = express()
const port = 5000

// connection
const sequelize = new Sequelize('inventory', 'postgres', 'SyamHaidar', {
  host: 'localhost',
  dialect: 'postgres',
})

// cors config
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://192.168.43.228:3000', 'http://10.10.101.64:3000'],
//   credentials: true,
// }

try {
  sequelize.authenticate()
  console.log('Database connected...')
} catch (error) {
  console.error('Connection error: ', error)
}

app.use(
  cookieSession({
    name: '_session',
    secret: '1Tambah1SamaDengan2',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.43.228:3000', 'http://10.10.101.64:3000'],
    credentials: true,
  })
)
app.use(express.json()) // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })) // parse requests of content-type - application/x-www-form-urlencoded
app.use(morgaLog) // morgan log
app.use('/api', router) // router

app.listen(port, '192.168.43.228', () => console.log(`Server running at port ${port}`))
// app.listen(port, () => console.log(`Server running at port ${port}`))

// force drop and create table
const db = require('../models')
const Role = db.role

// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db')
//   initial()
// })

const initial = () => {
  Role.create({ id: '1', name: 'Super Admin' })
  Role.create({ id: '2', name: 'Admin' })
}
