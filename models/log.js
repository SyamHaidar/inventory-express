'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Log.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.STRING },
      remoteAddress: { type: DataTypes.STRING },
      requestMethod: { type: DataTypes.STRING },
      requestUrl: { type: DataTypes.STRING },
      statusCode: { type: DataTypes.STRING },
      contentLength: { type: DataTypes.STRING },
      responseTime: { type: DataTypes.STRING },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Log',
      timestamps: false,
    }
  )
  return Log
}
