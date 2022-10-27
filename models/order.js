'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Product, {
        as: 'product',
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      })
      Order.belongsTo(models.Supplier, {
        as: 'supplier',
        foreignKey: 'supplierId',
      })
    }
  }
  Order.init(
    {
      id: { type: DataTypes.STRING, autoIncrement: false, primaryKey: true },
      productId: { type: DataTypes.STRING, allowNull: false },
      supplierId: { type: DataTypes.STRING, allowNull: true },
      clientId: { type: DataTypes.STRING, allowNull: true },
      invoice: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.BIGINT, allowNull: false },
      status: { type: DataTypes.BOOLEAN, allowNull: false },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Order',
      timestamps: false,
    }
  )
  return Order
}
