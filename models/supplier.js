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
    }
  }
  Supplier.init(
    {
      // id: {
      //   primaryKey: true,
      //   type: DataTypes.STRING,
      // },
      // cityId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      location: DataTypes.TEXT,
      address: DataTypes.TEXT,
      mobile: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Supplier',
    }
  )
  return Supplier
}
