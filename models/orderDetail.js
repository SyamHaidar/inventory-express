'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderDetail.init(
    {
      id: { type: DataTypes.STRING, autoIncrement: false, primaryKey: true },
      orderId: { type: DataTypes.STRING, allowNull: false },
      productId: { type: DataTypes.STRING, allowNull: false },
      supplierId: { type: DataTypes.STRING, allowNull: true },
      clientId: { type: DataTypes.STRING, allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.BOOLEAN, allowNull: false },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'OrderDetail',
      timestamps: false,
    }
  )
  return OrderDetail
}
