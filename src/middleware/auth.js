const db = require('../../models')
const Role = db.userrole
const User = db.user

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Username is already in use!',
      })
      return
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: 'Failed! Email is already in use!',
        })
        return
      }

      next()
    })
  })
}

checkRoleExisted = (req, res, next) => {
  if (req.body.role) {
    for (let i = 0; i < req.body.role.length; i++) {
      if (!Role.includes(req.body.role[i])) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + req.body.role[i],
        })
        return
      }
    }
  }

  next()
}

const authenticate = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
}

module.exports = authenticate
