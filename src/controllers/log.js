const { Log: db } = require('../../models')

// -----------------------------------------------------------------------------

// search all log data
exports.searchLogs = async (req, res) => {
  const value = req.query.name?.toLowerCase() || ''

  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        [Op.or]: [
          { remoteAddress: { [Op.iLike]: `%${value}%` } },
          { requestMethod: { [Op.iLike]: `%${value}%` } },
          { requestUrl: { [Op.iLike]: `%${value}%` } },
          { statusCode: { [Op.iLike]: `%${value}%` } },
          { contentLength: { [Op.iLike]: `%${value}%` } },
          { responseTime: { [Op.iLike]: `%${value}%` } },
          F,
        ],
      },
    })

    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}

// get all log data
exports.getLogs = async (req, res) => {
  try {
    const data = await db.findAll({
      order: [['createdAt', 'DESC']],
    })
    res.status(200).json(data)
  } catch (error) {
    res.json({ message: error.message })
  }
}
