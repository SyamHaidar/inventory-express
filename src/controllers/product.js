const { Product: db, Order, Category, Supplier } = require('../../models')
const { uniqid, unixTimestamp } = require('../utils')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// -----------------------------------------------------------------------------

// search all product data
exports.searchProducts = async (req, res) => {
  const value = req.query.name?.toLowerCase() || ''

  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${value}%` } },
          { '$category.name$': { [Op.iLike]: `%${value}%` } },
          { '$supplier.name$': { [Op.iLike]: `%${value}%` } },
        ],
      },
      attributes: { include: [[Sequelize.fn('SUM', Sequelize.col('order.quantity')), 'quantity']] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'productId', 'name'],
          order: [['id', 'ASC']],
        },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name', 'mobile'] },
        {
          model: Order,
          as: 'order',
          attributes: [],
          include: [{ model: db, as: 'product', attributes: ['id', 'name'] }],
        },
      ],
      group: ['Product.id', 'category.id', 'supplier.id', 'order->product.id'],
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get all product data
exports.getProducts = async (req, res) => {
  const keyword = req.query.keyword || ''
  const limit = 50
  const page = req.query.page || 0
  const offset = limit * page

  try {
    const data = await db.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } },
          { '$category.name$': { [Op.iLike]: `%${keyword}%` } },
          { '$supplier.name$': { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
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

// get product detail by name
exports.getProduct = async (req, res) => {
  try {
    const data = await db.findAll({
      where: { id: req.params.id },
      attributes: { include: [[Sequelize.fn('SUM', Sequelize.col('order.quantity')), 'quantity']] },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name', 'mobile'] },
        { model: Order, as: 'order', attributes: [] },
      ],
      group: ['Product.id', 'category.id', 'supplier.id'],
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
  const category = req.body.category
  const categoryFilter = category.filter(Boolean)

  try {
    await db.create({
      id: id,
      supplierId: req.body.supplierId,
      name: req.body.name,
      slug: req.body.name.replace(/ /g, '-').toLowerCase() + '-' + id,
      picture: req.body.picture,
      createdAt: time,
      updatedAt: time,
      category: categoryFilter.map((category) => ({
        productId: id,
        name: category.trim(),
        createdAt: time,
        updatedAt: time,
      })),
    })

    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get product detail by id
exports.editProduct = async (req, res) => {
  try {
    const data = await db.findOne({
      where: { id: req.params.id },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name'] },
      ],
    })
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update product data by id
exports.updateProduct = async (req, res) => {
  const id = req.params.id
  const time = unixTimestamp()
  const category = req.body.category
  const categoryFilter = category.filter(Boolean)

  try {
    await db.update(
      {
        supplierId: req.body.supplierId,
        name: req.body.name,
        slug: req.body.name.replace(/ /g, '-').toLowerCase() + '-' + id,
        picture: req.body.picture,
        updatedAt: unixTimestamp(),
        category: categoryFilter.map((category) => ({
          productId: id,
          name: category.trim(),
          updatedAt: time,
        })),
      },
      {
        where: {
          id: id,
        },
      }
    )

    res.status(200).json({ message: 'success' })
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
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
