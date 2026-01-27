const usuarioService = require('../services/usuarioService');

const apenasDigitos = (valor = '') => valor.replace(/\D/g, '');

const validarCPF = (cpf) => {
  cpf = apenasDigitos(cpf || '');
  if (!cpf || cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
};

async function listar(req, res, next) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function criar(req, res, next) {
  try {
    const { nome, matricula, posto, cpf, perfil } = req.body;

    const erros = [];

    if (!nome) erros.push('Informe o nome completo.');

    const matriculaDigits = apenasDigitos(matricula || '');
    if (!/^\d{8}$/.test(matriculaDigits)) {
      erros.push('Matrícula deve conter exatamente 8 números.');
    }

    if (!posto) erros.push('Informe o posto/graduação.');

    const cpfDigits = apenasDigitos(cpf || '');
    if (!/^\d{11}$/.test(cpfDigits)) {
      erros.push('CPF deve conter exatamente 11 números.');
    } else if (!validarCPF(cpfDigits)) {
      erros.push('CPF inválido.');
    }

    if (!perfil || !['ADMIN', 'EDITOR', 'LEITOR'].includes(perfil)) {
      erros.push('Selecione um tipo de perfil válido.');
    }

    if (erros.length) {
      return res.status(400).json({ message: erros[0] });
    }

    const usuarioCriado = await usuarioService.criarUsuario({
      nome,
      matricula: matriculaDigits,
      posto,
      cpf: cpfDigits,
      perfil,
    });

    res.status(201).json(usuarioCriado);
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, matricula, posto, cpf, perfil } = req.body;

    const erros = [];

    if (!nome) erros.push('Informe o nome completo.');

    const matriculaDigits = apenasDigitos(matricula || '');
    if (!/^\d{8}$/.test(matriculaDigits)) {
      erros.push('Matrícula deve conter exatamente 8 números.');
    }

    if (!posto) erros.push('Informe o posto/graduação.');

    const cpfDigits = apenasDigitos(cpf || '');
    if (!/^\d{11}$/.test(cpfDigits)) {
      erros.push('CPF deve conter exatamente 11 números.');
    } else if (!validarCPF(cpfDigits)) {
      erros.push('CPF inválido.');
    }

    if (!perfil || !['ADMIN', 'EDITOR', 'LEITOR'].includes(perfil)) {
      erros.push('Selecione um tipo de perfil válido.');
    }

    if (erros.length) {
      return res.status(400).json({ message: erros[0] });
    }

    const usuarioAtualizado = await usuarioService.atualizarUsuario(id, {
      nome,
      matricula: matriculaDigits,
      posto,
      cpf: cpfDigits,
      perfil,
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    next(error);
  }
}

async function excluir(req, res, next) {
  try {
    const { id } = req.params;
    await usuarioService.excluirUsuario(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  excluir,
};
