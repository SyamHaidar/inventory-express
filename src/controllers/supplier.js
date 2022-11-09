const { Supplier: db, Product } = require('../../models')
const { uniqid, unixTimestamp } = require('../utils')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// -----------------------------------------------------------------------------

// get all supplier data
exports.getSuppliers = async (req, res) => {
  const keyword = req.query.keyword || ''
  const limit = 50
  const page = req.query.page || 0
  const offset = limit * page

  try {
    const data = await db.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { location: { [Op.iLike]: `%${keyword}%` } },
          { address: { [Op.iLike]: `%${keyword}%` } },
          { mobile: { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }],
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

// get supplier detail by suppliername
exports.getSupplier = async (req, res) => {
  const id = req.params.id

  try {
    const data = await db.findOne({
      where: {
        id: id,
      },
      include: [{ model: Product, as: 'product', attributes: ['id', 'supplierId', 'name'] }],
      order: [['createdAt', 'DESC']],
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
    await db.create({
      id: uniqid(6),
      name: req.body.name,
      location: req.body.location,
      address: req.body.address,
      mobile: req.body.mobile,
      createdAt: time,
      updatedAt: time,
    })

    res.status(200).json({ message: 'success' })
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
    await db.update(
      {
        name: req.body.name,
        location: req.body.location,
        address: req.body.address,
        mobile: req.body.mobile,
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
    res.json({ message: error.message })
  }
}

// delete supplier data by id
exports.deleteSupplier = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
