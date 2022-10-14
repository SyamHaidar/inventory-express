const { Supplier: db } = require('../../models')

// -----------------------------------------------------------------------------

exports.getSuppliers = async (req, res) => {
  try {
    const data = await db.findAll()
    res.json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.getSupplier = async (req, res) => {
  try {
    const data = await db.findAll({ where: { id: req.params.id } })
    res.status(200).json(data[0])
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.createSupplier = async (req, res) => {
  try {
    const data = await db.create(req.body)
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.updateSupplier = async (req, res) => {
  try {
    await db.update(req.body, { where: { id: req.params.id } })
    res.json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.deleteSupplier = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
