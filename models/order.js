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
    }
  }
  Order.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      userId: DataTypes.STRING,
      productId: DataTypes.STRING,
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  )
  return Order
}
