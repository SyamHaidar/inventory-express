const { Product: db, Order, Category, Supplier } = require('../../models')
const { uniqid, unixTimestamp } = require('../utils')
const { Sequelize } = require('sequelize')

// -----------------------------------------------------------------------------

// get all product data
exports.getProducts = async (req, res) => {
  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
      attributes: {
        include: [[Sequelize.fn('SUM', Sequelize.col('order.quantity')), 'quantity']],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['productId', 'name'],
          separate: true,
          limit: 1,
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name'],
        },
        {
          model: Order,
          as: 'order',
          attributes: [],
          include: [
            {
              model: db,
              as: 'product',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      group: ['Product.id', 'supplier.id', 'order->product.id'],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get product detail by name
exports.getProduct = async (req, res) => {
  try {
    const data = await db.findAll({
      where: { slug: req.params.slug },
      attributes: {
        include: [[Sequelize.fn('SUM', Sequelize.col('order.quantity')), 'quantity']],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['productId', 'name'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'mobile'],
        },
        {
          model: Order,
          as: 'order',
          attributes: [],
          include: [
            {
              model: db,
              as: 'product',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      group: ['Product.id', 'supplier.id', 'order->product.id', 'category.id'],
    })

    res.status(200).json(data[0])
  } catch (error) {
    res.json({ message: error.message })
  }
}

// create new product data
exports.createProduct = async (req, res) => {
  const id = uniqid(6)
  const time = unixTimestamp()

  try {
    const data = await db.create(
      {
        id: id,
        supplierId: req.body.supplierId,
        name: req.body.name,
        slug: req.body.name.replace(/ /g, '-').toLowerCase() + '-' + id,
        picture: req.body.picture,
        createdAt: time,
        updatedAt: time,
        category: req.body.category.map((category) => ({
          productId: id,
          name: category,
          createdAt: time,
          updatedAt: time,
        })),
      },
      { include: [{ model: Category, as: 'category' }] }
    )

    // find newly created data
    const findData = await db.findOne({
      where: { name: data.name },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['productId', 'name'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name', 'mobile'],
        },
      ],
    })

    res.status(200).json(findData)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get product detail by id
exports.editProduct = async (req, res) => {
  try {
    const data = await db.findOne({ where: { id: req.params.id } })
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update product data by id
exports.updateProduct = async (req, res) => {
  const id = req.params.id

  try {
    await db.update(
      {
        supplierId: req.body.supplier,
        name: req.body.name,
        slug: req.body.name.replace(/ /g, '-').toLowerCase() + '-' + id,
        picture: req.body.picture,
        updatedAt: unixTimestamp(),
      },
      {
        where: { id: id },
        returning: true,
        plain: true,
      }
    )

    res.status(200).json(data[1])
  } catch (error) {
    res.json({ message: error.message })
  }
}

// delete product data by id
exports.deleteProduct = async (req, res) => {
  try {
    await db.destroy({
      where: { id: req.params.id },
      include: [{ model: Category }, { model: Order }],
    })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
