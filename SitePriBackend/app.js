const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { format } = require("date-fns");
const cors = require('cors');
const userRouter = require('./routes/users');
const configData = require("./config/connection");

async function getApp() {
  // Conectar ao banco de dados
  await configData.getConnectionInfo();

  const app = express();

  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  // Configuração do motor de visualização
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  // Configuração CORS
  app.use(cors());

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.locals.format = format;

  // Configurar rotas
  app.use("/users", userRouter);

  // Captura 404 e encaminha para o manipulador de erros
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // Manipulador de erros
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });

  return app;
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(val)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

module.exports = {
  getApp
};