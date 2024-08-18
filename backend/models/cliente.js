const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Cliente = sequelize.define('Cliente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  coordenadas: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: false,
  },
})

module.exports = Cliente
