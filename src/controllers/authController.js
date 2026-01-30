const db = require('../config/db');

async function login(req, res, next) {
  try {
    const { matricula, senha } = req.body;

    if (!matricula || !senha) {
      return res
        .status(400)
        .json({ message: 'Informe matrícula e senha.' });
    }

    // Normaliza e valida regra: matrícula 8 dígitos, senha 4 dígitos
    const matriculaDigits = String(matricula).replace(/\D/g, '');
    if (!/^\d{8}$/.test(matriculaDigits)) {
      console.log('[auth] login rejeitado: matrícula inválida', matricula);
      return res.status(400).json({ message: 'Matrícula deve conter exatamente 8 números.' });
    }
    if (!/^\d{4}$/.test(String(senha))) {
      console.log('[auth] login rejeitado: senha inválida para matrícula', matriculaDigits);
      return res.status(400).json({ message: 'A senha deve ter exatamente 4 números.' });
    }

    const [rows] = await db.query(
      'SELECT id, nome_completo AS nome, matricula, posto_graduacao AS posto, perfil FROM usuarios WHERE matricula = ? AND senha = ? LIMIT 1',
      [matriculaDigits, senha]
    );

    if (!rows.length) {
      console.log('[auth] login 401: não encontrado', { m: matriculaDigits });
      return res
        .status(401)
        .json({ message: 'Matrícula ou senha incorretos.' });
    }

    const usuario = rows[0];

    console.log('[auth] login OK', { id: usuario.id, m: usuario.matricula });
    res.json({
      id: usuario.id,
      nome: usuario.nome,
      matricula: usuario.matricula,
      posto: usuario.posto,
      perfil: usuario.perfil,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};
