const { Order: db, Product, Supplier } = require('../../models')
const { uniqid, unixTimestamp, randomNumber } = require('../utils')
const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// -----------------------------------------------------------------------------

// get all order data
exports.getOrders = async (req, res) => {
  const keyword = req.query.keyword || ''
  const limit = 50
  const page = req.query.page || 0
  const offset = limit * page

  try {
    const data = await db.findAndCountAll({
      where: {
        [Op.or]: [
          { invoice: { [Op.iLike]: `%${keyword}%` } },
          { '$product.name$': { [Op.iLike]: `%${keyword}%` } },
          { '$supplier.name$': { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] },
      ],
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

// get order detail by id
exports.getOrder = async (req, res) => {
  try {
    const data = await db.findOne({
      where: { invoice: req.query.id },
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
      ],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({
      message: error.message,
    })
  }
}

// create new order data
exports.createOrder = async (req, res) => {
  // change value from req.body.date (2022-10-09) to (20221009)
  const invoiceDate = moment(req.body.date, 'Y-m-DD').format('YmDD')
  // result INV / 20221009 / W / randomNUmber
  const invoice = `INV/${invoiceDate}/W/${randomNumber(6)}`

  const time = unixTimestamp()

  try {
    await db.create({
      id: uniqid(6),
      productId: req.body.productId,
      supplierId: req.body.supplierId,
      invoice: invoice,
      quantity: req.body.quantity,
      status: req.body.status,
      date: moment(req.body.date).unix(),
      createdAt: time,
      updatedAt: time,
    })

    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get order detail by id
exports.editOrder = async (req, res) => {
  try {
    const data = await db.findOne({
      where: { id: req.params.id },
      include: [
        { model: Product, as: 'product' },
        { model: Supplier, as: 'supplier' },
      ],
    })
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update order data by id
exports.updateOrder = async (req, res) => {
  // change value from req.body.date (2022-10-09) to (20221009)
  const invoiceDate = moment(req.body.date, 'Y-m-DD').format('YmDD')
  // result INV / 20221009 / W / randomNUmber
  const invoice = `INV/${invoiceDate}/W/${randomNumber(6)}`

  try {
    await db.update(
      {
        productId: req.body.productId,
        supplierId: req.body.supplierId,
        invoice: invoice,
        quantity: req.body.quantity,
        status: req.body.status,
        date: moment(req.body.date).unix(),
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

// delete order data by id
exports.deleteOrder = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
