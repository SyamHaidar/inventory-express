const { User: db } = require('../../models')

// -----------------------------------------------------------------------------

exports.getUsers = async (req, res) => {
  try {
    const data = await db.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    })
    res.json({
      status: 'success',
      data: {
        user: data,
      },
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}

exports.getUser = async (req, res) => {
  try {
    const data = await db.findAll({
      where: {
        username: req.params.username,
      },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    })
    res.json({
      status: 'success',
      data: {
        user: data[0],
      },
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    await db.create(req.body)
    res.json({
      status: 'success',
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    await db.update(req.body, {
      where: {
        username: req.params.username,
      },
    })
    res.json({
      status: 'success',
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await db.destroy({
      where: {
        id: req.params.id,
      },
    })
    res.json({
      status: 'success',
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    })
  }
}
