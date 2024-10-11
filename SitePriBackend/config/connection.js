require("dotenv").config();
const { Sequelize } = require("sequelize");

async function getConnectionInfo() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const DATABASE_NAME = process.env.DATABASE_NAME || "azure-todo-app";
  const DATABASE_USER = process.env.DATABASE_USER || "postgres";
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "password";
  const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
  const DATABASE_PORT = process.env.DATABASE_PORT || 5432;

  if (!DATABASE_URL) {
    throw new Error("No value in DATABASE_URL in env var");
  }

  const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'postgres',
    logging: false, // Desativa logs de SQL no console
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  return sequelize;
}

module.exports = {
  getConnectionInfo
};