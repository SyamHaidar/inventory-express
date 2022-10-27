const { Order: db, Product, Supplier } = require('../../models')
const { uniqid, unixTimestamp, randomNumber } = require('../utils')
const moment = require('moment')
const Sequelize = require('sequelize')

// -----------------------------------------------------------------------------

// get all order data
exports.getOrders = async (req, res) => {
  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name'],
        },
      ],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get order detail by id
exports.getOrder = async (req, res) => {
  try {
    const data = await db.findOne({
      where: {
        invoice: req.query.id,
      },
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: Supplier,
          as: 'supplier',
        },
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
  const time = unixTimestamp()
  const invoiceDate = moment(req.body.date, 'Y-m-DD').format('YmDD')
  const invoiceNumber = randomNumber(6)
  const invoice = `INV/${invoiceDate}/W/${invoiceNumber}`

  try {
    const data = await db.create({
      id: uniqid(6),
      productId: req.body.productId,
      supplierId: req.body.supplierId,
      // clientId: req.body.client,
      invoice: invoice,
      quantity: req.body.quantity,
      status: true,
      date: moment(req.body.date).unix(),
      createdAt: time,
      updatedAt: time,
    })

    // find newly created data
    const findData = await db.findOne({
      where: { id: data.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name'],
        },
      ],
    })
    res.status(200).json(findData)
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
        {
          model: Product,
          as: 'product',
        },
        {
          model: Supplier,
          as: 'supplier',
        },
      ],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update order data by id
exports.updateOrder = async (req, res) => {
  try {
    const data = await db.update(
      {
        productId: req.body.productId,
        supplierId: req.body.supplierId,
        quantity: req.body.quantity,
        status: true,
        date: moment(req.body.date).unix(),
        updatedAt: unixTimestamp(),
      },
      {
        where: {
          id: req.params.id,
        },

        returning: true,
        plain: true,
      }
    )

    // find newly updated data
    const findData = await db.findOne({
      where: { id: data[1].id },
      include: [
        {
          model: Product,
          as: 'product',
        },
        {
          model: Supplier,
          as: 'supplier',
        },
      ],
    })

    res.status(200).json(findData)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// delete order data by id
exports.deleteOrder = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
