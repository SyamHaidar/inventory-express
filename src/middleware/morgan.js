const { Log: db } = require('../../models')
const config = require('../../config/auth')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const { unixTimestamp } = require('../utils')

// -----------------------------------------------------------------------------

const stream = {
  write: async (message) => {
    const data = message.substring(0, message.lastIndexOf('\n')).split(' ')
    const time = unixTimestamp()
    try {
      await db.create({
        userId: data[6],
        remoteAddress: data[0],
        requestMethod: data[1],
        requestUrl: data[2],
        statusCode: data[3],
        contentLength: data[4],
        responseTime: data[5],
        createdAt: time,
        updatedAt: time,
      })
    } catch (error) {
      console.log(error.message)
    }
  },
}

morgan.token('user', (req, res) => {
  const token = req.session?.token || ''
  const user = []

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      user.push(decoded.id)
    })
  }

  return user
})

const morganLog = morgan(
  ':remote-addr :method :url :status :res[content-length] :response-time :user',
  { stream }
)

module.exports = morganLog
