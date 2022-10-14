const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User: db } = require('../../models')
const config = require('../../config/auth')

// -----------------------------------------------------------------------------

exports.login = async (req, res) => {
  try {
    const user = await db.findOne({
      where: {
        username: req.body.username,
      },
    })

    // // check user not exist
    if (!user) {
      return res.status(404).send({
        status: 'error',
        message: 'User Not found.',
      })
    }

    // load and check hash from your password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      })
    }

    // generate token
    const token = jwt.sign({ username: user.username }, config.secret, {
      expiresIn: 86400, // 24 hours
    })

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          accessToken: token,
        },
      },
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}

exports.signup = async (req, res) => {
  // // Save User to Database
  // User.create({
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: bcrypt.hashSync(req.body.password, 8),
  // })
  //   .then((user) => {
  //     if (req.body.roles) {
  //       Role.findAll({
  //         where: {
  //           name: {
  //             [Op.or]: req.body.roles,
  //           },
  //         },
  //       }).then((roles) => {
  //         user.setRoles(roles).then(() => {
  //           res.send({ message: 'User was registered successfully!' })
  //         })
  //       })
  //     } else {
  //       // user role = 1
  //       user.setRoles([1]).then(() => {
  //         res.send({ message: 'User was registered successfully!' })
  //       })
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: err.message })
  //   })

  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const user = await db.findOne({
      where: {
        username: req.body.username,
      },
    })

    if (!user) await db.create(req.body)
    res.json({ status: !user ? 'success' : 'error' })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}