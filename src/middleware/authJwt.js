const config = require('../../config/auth')
const jwt = require('jsonwebtoken')

// -----------------------------------------------------------------------------

verifyToken = (req, res, next) => {
  let token = req.session.token

  if (!token) return res.status(403).send({ message: 'error' })

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'error' })
    req.userId = decoded.id
    next()
  })
}

const authJwt = { verifyToken }

module.exports = authJwt
