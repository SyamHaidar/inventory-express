const { Category: db } = require('../../models')

// -----------------------------------------------------------------------------

exports.getCategories = async (req, res) => {
  try {
    const data = await db.findAll()
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.getCategory = async (req, res) => {
  const value = req.params.name.replace(/-/g, ' ')

  try {
    const data = await db.findOne({
      where: {
        name: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('name')), // case sensitive
          value
        ),
      },
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.createCategory = async (req, res) => {
  const time = unixTimestamp()
  try {
    const data = await db.create({
      productId: req.body.productId,
      name: req.body.name,
      createdAt: time,
      updatedAt: time,
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    await db.update(req.body, { where: { id: req.params.id } })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
