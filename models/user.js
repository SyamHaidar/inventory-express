'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.UserRole, {
        as: 'role',
        foreignKey: 'roleId',
      })
      User.hasMany(models.Log, {
        as: 'log',
        foreignKey: 'userId',
      })
    }
  }
  User.init(
    {
      id: { type: DataTypes.STRING, autoIncrement: false, primaryKey: true },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
      fullName: { type: DataTypes.STRING, allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.BOOLEAN, allowNull: true },
      picture: { type: DataTypes.TEXT, allowNull: true },
      token: { type: DataTypes.TEXT, allowNull: false },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: false,
    }
  )
  return User
}
