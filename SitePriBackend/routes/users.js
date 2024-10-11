const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Importando o sequelize do index.js

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Outros campos conforme necessário
});

module.exports = User;
