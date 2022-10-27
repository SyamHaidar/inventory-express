const { User: db, UserRole } = require('../../models')
const { uniqid, randomNumber, unixTimestamp } = require('../utils')
const config = require('../../config/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// -----------------------------------------------------------------------------

// authenticate check
exports.verify = async (req, res) => {
  const token = req.session.token !== undefined ? req.session.token : null

  try {
    const data = await db.findOne({
      where: { token: token },
      attributes: { exclude: ['password', 'token', 'createdAt', 'updatedAt'] },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(
      data === null
        ? {
            user: '',
            auth: false,
          }
        : data.status !== false
        ? {
            user: data,
            auth: true,
          }
        : {
            user: '',
            auth: false,
          }
    )
  } catch (error) {
    res.json({ message: error.message })
  }
}

// sign in account
exports.signin = async (req, res) => {
  try {
    const user = await db.findOne({ where: { username: req.body.username } })

    // check user not exist
    if (!user) return res.status(404).send({ status: 'error' })

    // check password hash
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) return res.status(401).send({ status: 'error' })

    // generate token
    // token will expire after 86400 second / 24 hours
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })

    // set session token
    req.session.token = token

    // update user token
    await db.update({ token: token }, { where: { username: user.username } })

    // find logged in user data
    const data = await db.findOne({ where: { username: user.username } })

    res.status(200).json({ user: data, auth: true })
  } catch (error) {
    res.json({ message: error.message })
  }
}

// sign out account
exports.signout = async (req, res) => {
  try {
    // clear session
    req.session = null
    return res.status(200).send({ message: 'Signed out!' })
  } catch (err) {
    this.next(err)
  }
}

exports.signup = async (req, res) => {
  // split string into array of strings
  const fullName = req.body.fullName?.split(' ').filter(Boolean) || ''

  // create username from full name (The John Doe to thejohn)
  const username = fullName
    .slice(0, 2)
    .join(' ') // returns selected elements in an array, as a new array
    .replace(/ /g, '') // replace white space
    .toLowerCase() // change text to lower case

  const time = unixTimestamp()

  try {
    // password hash
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)

    // check username exist
    const user = await db.findOne({ where: { username: username } })

    const data = await db.create({
      id: uniqid(6),
      roleId: req.body.roleId,
      fullName: req.body.fullName,
      username: !user ? username : username + randomNumber(4), // if username exist, add random number
      password: hash,
      status: true,
      token: '',
      createdAt: time,
      updatedAt: time,
    })

    // find newly created data
    const findData = await db.findOne({
      where: { username: data.username },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(findData)
  } catch (error) {
    res.json({ message: error.message })
  }
}
