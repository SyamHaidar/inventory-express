const { Category: db } = require('../../models')

// -----------------------------------------------------------------------------

exports.getCategories = async (req, res) => {
  try {
    const data = await db.findAll()
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

exports.getCategory = async (req, res) => {
  try {
    const data = await db.findAll({
      where: {
        id: req.params.id,
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

exports.createCategory = async (req, res) => {
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

exports.updateCategory = async (req, res) => {
  try {
    await db.update(req.body, {
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

exports.deleteCategory = async (req, res) => {
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
