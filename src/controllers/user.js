const { User: db, UserRole } = require('../../models')
const { uniqid, randomNumber, unixTimestamp } = require('../utils')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')

// -----------------------------------------------------------------------------

// search all user data
exports.searchUsers = async (req, res) => {
  const value = req.query.name?.toLowerCase() || ''

  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${value}%` } },
          { username: { [Op.iLike]: `%${value}%` } },
          { '$role.name$': { [Op.iLike]: `%${value}%` } },
        ],
      },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get all user data
exports.getUsers = async (req, res) => {
  try {
    const data = await db.findAll({
      attributes: { exclude: ['password', 'token'] },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get user detail by username
exports.getUser = async (req, res) => {
  // username lowercase for case sensitive
  const username = req.params.username?.toLowerCase() || ''

  try {
    const data = await db.findOne({
      where: {
        username: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('username')), // case sensitive
          username
        ),
      },
      attributes: { exclude: ['password', 'token'] },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// create new user data
exports.createUser = async (req, res) => {
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
      status: req.body.status,
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

// get user detail by id
exports.editUser = async (req, res) => {
  try {
    const data = await db.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password', 'token'] },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update user data by id
exports.updateUser = async (req, res) => {
  try {
    const data = await db.update(
      {
        roleId: req.body.roleId,
        fullName: req.body.fullName,
        username: req.body.username,
        status: req.body.status,
        updatedAt: unixTimestamp(),
      },
      { where: { id: req.params.id }, returning: true, plain: true }
    )

    // find newly updated data
    const findData = await db.findOne({
      where: { id: data[1].id },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    res.status(200).json(findData)
  } catch (error) {
    res.json({
      message: error.message,
    })
  }
}

// delete user data by id
exports.deleteUser = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
