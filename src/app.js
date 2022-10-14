const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { Sequelize } = require('sequelize')
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

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/api', router)

app.listen(port, () => console.log(`Server running at port ${port}`))

const db = require('../models')
const Role = db.role

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db')
  initial()
})

const initial = () => {
  Role.create({
    id: '1dlfx6',
    name: 'super admin',
  })

  Role.create({
    id: '1gluio',
    name: 'admin',
  })

  Role.create({
    id: '8nocn7',
    name: 'user',
  })
}

// const randomId = (length) => {
//   var result = ''
//   var chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
//   var charsLength = chars.length
//   for (var i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * charsLength))
//   }
//   return result
// }

// console.log(randomId(6));
