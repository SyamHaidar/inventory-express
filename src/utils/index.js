const crypto = require('crypto')

// -----------------------------------------------------------------------------

exports.uniqid = (length) => {
  return crypto.randomBytes(length).toString('hex')
}

exports.randomNumber = (length) => {
  var result = ''
  var chars = '0123456789'
  var charsLength = chars.length
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return result
}

exports.unixTimestamp = () => {
  return Math.floor(Date.now() / 1000)
}
