const { Log: db, User, UserRole } = require('../../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// -----------------------------------------------------------------------------

// get all log data
exports.getLogs = async (req, res) => {
  const keyword = req.query.keyword || ''
  const limit = 50
  const page = req.query.page || 0
  const offset = limit * page

  try {
    const data = await db.findAndCountAll({
      where: {
        [Op.or]: [
          { remoteAddress: { [Op.iLike]: `%${keyword}%` } },
          { requestMethod: { [Op.iLike]: `%${keyword}%` } },
          { requestUrl: { [Op.iLike]: `%${keyword}%` } },
          { statusCode: { [Op.iLike]: `%${keyword}%` } },
          { contentLength: { [Op.iLike]: `%${keyword}%` } },
          { responseTime: { [Op.iLike]: `%${keyword}%` } },
          { '$user.fullName$': { [Op.iLike]: `%${keyword}%` } },
          { '$user.role.name$': { [Op.iLike]: `%${keyword}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
          include: [{ model: UserRole, as: 'role', attributes: ['name'] }],
        },
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
