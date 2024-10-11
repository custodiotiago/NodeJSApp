const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection').getConnectionInfo(); // Certifique-se de que este arquivo está exportando a conexão

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // Adicione mais campos conforme necessário
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;