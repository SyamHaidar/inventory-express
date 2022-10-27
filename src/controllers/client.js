const { Client: db, Product } = require('../../models')
const { uniqid, unixTimestamp } = require('../utils')
const sequelize = require('sequelize')

// -----------------------------------------------------------------------------

// get all client data
exports.getClients = async (req, res) => {
  try {
    const data = await db.findAll()
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get client detail by clientname
exports.getClient = async (req, res) => {
  const value = req.params.name

  try {
    const data = await db.findOne({
      where: {
        name: sequelize.where(
          sequelize.fn('LOWER', sequelize.fn('replace', sequelize.col('name'), ' ', '')), // case sensitive
          value
        ),
      },
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// create new client data
exports.createClient = async (req, res) => {
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

// get client detail by id
exports.editClient = async (req, res) => {
  try {
    const data = await db.findOne({ where: { id: req.params.id } })
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// update client data by id
exports.updateClient = async (req, res) => {
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

// delete client data by id
exports.deleteClient = async (req, res) => {
  try {
    await db.destroy({ where: { id: req.params.id } })
    res.status(200).json({ status: 'success' })
  } catch (error) {
    res.json({ message: error.message })
  }
}
