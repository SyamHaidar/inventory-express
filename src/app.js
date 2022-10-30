const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const morgan = require('morgan')
const { Sequelize } = require('sequelize')
// log
const morgaLog = require('./middleware/morgan')
// route
const router = require('./routes')

// -----------------------------------------------------------------------------

const app = express()
const port = 5000

// connection
const sequelize = new Sequelize('inventory', 'postgres', 'SyamHaidar', {
  host: 'localhost',
  dialect: 'postgres',
})

try {
  sequelize.authenticate()
  console.log('Database connected...')
} catch (error) {
  console.error('Connection error: ', error)
}

// cors config
const corsOptions = {
  // origin: 'http://localhost:3000',
  origin: 'http://192.168.43.228:3000',
  credentials: true,
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(
  cookieSession({
    name: '_session',
    secret: '1Tambah1SamaDengan2', // should use as secret environment variable
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

// morgan log
app.use(morgaLog)

// router
app.use('/api', router)

// port for request
app.listen(port, '192.168.43.228', () => console.log(`Server running at port ${port}`))
// app.listen(port, () => console.log(`Server running at port ${port}`))

const db = require('../models')
const Role = db.role

// force drop and create table
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db')
//   initial()
// })

const initial = () => {
  Role.create({
    id: '1',
    name: 'Super Admin',
  })

  Role.create({
    id: '2',
    name: 'Admin',
  })
}
