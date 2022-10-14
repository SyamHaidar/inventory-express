const { Order: db } = require('../../models')

// -----------------------------------------------------------------------------

exports.getOrders = async (req, res) => {
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

exports.getOrder = async (req, res) => {
  try {
    const data = await db.findAll({
      where: {
        id: req.params.id,
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

exports.createOrder = async (req, res) => {
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

exports.updateOrder = async (req, res) => {
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

exports.deleteOrder = async (req, res) => {
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
