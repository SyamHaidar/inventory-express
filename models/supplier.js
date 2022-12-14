'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Supplier.hasMany(models.Product, {
        as: 'product',
        foreignKey: 'supplierId',
        onDelete: 'CASCADE',
      })
    }
  }
  Supplier.init(
    {
      id: { type: DataTypes.STRING, autoIncrement: false, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      location: { type: DataTypes.TEXT, allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: false },
      mobile: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.BIGINT, allowNull: false },
      updatedAt: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Supplier',
      timestamps: false,
    }
  )
  return Supplier
}
