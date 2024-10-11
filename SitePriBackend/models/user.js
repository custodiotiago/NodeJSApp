const { DataTypes } = require('sequelize');
const sequelize = require('../config/connection').getConnectionInfo();

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

(async () => {
  await sequelize.sync(); // Cria a tabela se ela não existir
})();

module.exports = User;