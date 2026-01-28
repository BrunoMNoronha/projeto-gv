const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// /api/v1/usuarios
router.get('/usuarios', usuarioController.listar);
router.post('/usuarios', usuarioController.criar);
router.put('/usuarios/:id', usuarioController.atualizar);
router.delete('/usuarios/:id', usuarioController.excluir);


// alteração de senha do usuário logado
router.put('/usuarios/:id/senha', usuarioController.alterarSenha);

// recuperação de senha por nome, matrícula e CPF
router.put('/usuarios/recuperar-senha', usuarioController.recuperarSenha);

module.exports = router;
