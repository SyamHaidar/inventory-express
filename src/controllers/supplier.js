const { Supplier: db, Product } = require('../../models')
const { uniqid, unixTimestamp } = require('../utils')
const sequelize = require('sequelize')

// -----------------------------------------------------------------------------

// get all supplier data
exports.getSuppliers = async (req, res) => {
  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['supplierId', 'name'],
        },
      ],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get supplier detail by suppliername
exports.getSupplier = async (req, res) => {
  const value = req.params.name

  try {
    const data = await db.findOne({
      where: {
        name: sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('replace', sequelize.col('name'), ' ', '')), // case sensitive
          value
        ),
      },
      include: [{ model: Product, as: 'product', attributes: ['id', 'supplierId', 'name'] }],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// create new supplier data
exports.createSupplier = async (req, res) => {
  const time = unixTimestamp()

  try {
    const data = await db.create({
      id: uniqid(6),
      name: req.body.name,
      location: req.body.location,
      address: req.body.address,
      mobile: req.body.mobile,
      createdAt: time,
      updatedAt: time,
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get supplier detail by id
exports.editSupplier = async (req, res) => {
  try {
    const data = await db.findOne({ where: { id: req.params.id } })
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update supplier data by id
exports.updateSupplier = async (req, res) => {
  try {
    const data = await db.update(
      {
        name: req.body.name,
        location: req.body.location,
        address: req.body.address,
        mobile: req.body.mobile,
        updatedAt: unixTimestamp(),
      },
      {
        where: { id: req.params.id },
        returning: true,
        plain: true,
      }
    )

    res.status(200).json(data[1])
  } catch (error) {
    res.json({ message: error.message })
  }
}

// delete supplier data by id
exports.deleteSupplier = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
