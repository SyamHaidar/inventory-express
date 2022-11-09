const { User: db, UserRole, Log } = require('../../models')
const { uniqid, randomNumber, unixTimestamp } = require('../utils')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// -----------------------------------------------------------------------------

// get all user data
exports.getUsers = async (req, res) => {
  const keyword = req.query.keyword || ''
  const limit = 50
  const page = req.query.page || 0
  const offset = limit * page

  try {
    const data = await db.findAndCountAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${keyword}%` } },
          { username: { [Op.iLike]: `%${keyword}%` } },
          { '$role.name$': { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      attributes: { exclude: ['password', 'token'] },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    })

    const totalPages = Math.ceil(data.count / limit)
    const startIndex = data.count ? offset + 1 : 0
    const endIndex = startIndex > 0 ? startIndex + data.rows.length - 1 : 0

    res.status(200).json({
      totalRecords: data.count,
      totalPages: totalPages,
      startIndex: startIndex,
      endIndex: endIndex,
      data: data.rows,
    })
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get user detail by username
exports.getUser = async (req, res) => {
  const keyword = req.query.keyword || ''
  const limit = 50
  const page = req.query.page || 0
  const offset = limit * page

  const id = req.params.id

  try {
    const user = await db.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ['password', 'token'] },
      include: [{ model: UserRole, as: 'role', attributes: ['id', 'name'] }],
    })

    const log = await Log.findAndCountAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset,
    })

    const totalPages = Math.ceil(log.count / limit)
    const startIndex = log.count ? offset + 1 : 0
    const endIndex = startIndex > 0 ? startIndex + log.rows.length - 1 : 0

    res.status(200).json({
      user: user,
      log: {
        totalRecords: log.count,
        totalPages: totalPages,
        startIndex: startIndex,
        endIndex: endIndex,
        data: log.rows,
      },
    })
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

    await db.create({
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

    res.status(200).json({ message: 'success' })
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
    await db.update(
      {
        status: req.body.status,
        updatedAt: unixTimestamp(),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json({ message: 'success' })
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
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
