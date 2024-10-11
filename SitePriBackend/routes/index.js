const { Sequelize, DataTypes } = require('sequelize');

// Inicialize o Sequelize com as credenciais do seu banco de dados
const sequelize = new Sequelize('nome_do_banco', 'usuario', 'senha', {
  host: 'localhost',
  dialect: 'postgres' // ou o que você estiver usando
});

// Defina o modelo User
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

// Sincronize os modelos com o banco de dados (opcional)
sequelize.sync();

module.exports = {
  sequelize,
  User,
};