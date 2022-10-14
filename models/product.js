'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      // id: {
      //   primaryKey: true,
      //   type: DataTypes.STRING,
      // },
      // supplierId: DataTypes.STRING,
      // categoryId: DataTypes.STRING,
      // name: DataTypes.STRING,
      // quantity: DataTypes.INTEGER,
      // description: DataTypes.TEXT,
      // picture: DataTypes.TEXT,
      // createdBy: DataTypes.STRING,
      // updatedBy: DataTypes.STRING,
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Product',
    }
  )
  return Product
}
