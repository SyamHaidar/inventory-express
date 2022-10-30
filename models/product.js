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
      Product.hasMany(models.Category, {
        as: 'category',
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      })
      Product.hasMany(models.Order, {
        as: 'order',
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      })
      Product.belongsTo(models.Supplier, {
        as: 'supplier',
        foreignKey: 'supplierId',
        onDelete: 'CASCADE',
      })
    }
  }
  Product.init(
    {
      id: { type: DataTypes.STRING, autoIncrement: false, primaryKey: true },
      supplierId: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      picture: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Product',
      timestamps: false,
    }
  )

  return Product
}
