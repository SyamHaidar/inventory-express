'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserLog.init(
    {
      id: { type: DataTypes.STRING, autoIncrement: false, primaryKey: true },
      userId: { type: DataTypes.STRING, allowNull: false },
      log: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'UserLog',
      timestamps: false,
    }
  )
  return UserLog
}
