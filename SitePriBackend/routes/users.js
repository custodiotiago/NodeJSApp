const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Importando o modelo corretamente

// Exemplo de rota para obter todos os usuários
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;