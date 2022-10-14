const { Product: db } = require('../../models')

// -----------------------------------------------------------------------------

exports.getProducts = async (req, res) => {
  try {
    const data = await db.findAll()
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.getProduct = async (req, res) => {
  try {
    const data = await db.findAll({ where: { id: req.params.id } })
    res.status(200).json(data[0])
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const data = await db.create(req.body)
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    await db.update(req.body, {
      where: { id: req.params.id },
    })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    await db.destroy({
      where: { id: req.params.id },
    })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
