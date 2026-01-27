const db = require('../config/db');

// Mapeia o campo "perfil" salvo no banco para o label exibido na tela
const mapPerfilToLabel = (perfil) => {
  if (perfil === 'ADMIN') return 'Administrador';
  if (perfil === 'EDITOR') return 'Editor';
  return 'Leitor';
};

async function listarUsuarios() {
  const [rows] = await db.query(
    'SELECT id, nome_completo AS nome, matricula, posto_graduacao AS posto, cpf, perfil FROM usuarios ORDER BY id DESC'
  );

  return rows.map((row) => ({
    ...row,
    perfilLabel: mapPerfilToLabel(row.perfil),
  }));
}

async function criarUsuario({ nome, matricula, posto, cpf, perfil }) {
  const sql =
    'INSERT INTO usuarios (nome_completo, matricula, posto_graduacao, cpf, perfil) VALUES (?, ?, ?, ?, ?)';
  const params = [nome, matricula, posto, cpf, perfil];

  const [result] = await db.execute(sql, params);

  return {
    id: result.insertId,
    nome,
    matricula,
    posto,
    cpf,
    perfil,
    perfilLabel: mapPerfilToLabel(perfil),
  };
}

async function atualizarUsuario(id, { nome, matricula, posto, cpf, perfil }) {
  const sql =
    'UPDATE usuarios SET nome_completo = ?, matricula = ?, posto_graduacao = ?, cpf = ?, perfil = ? WHERE id = ?';
  const params = [nome, matricula, posto, cpf, perfil, id];

  await db.execute(sql, params);

  return {
    id,
    nome,
    matricula,
    posto,
    cpf,
    perfil,
    perfilLabel: mapPerfilToLabel(perfil),
  };
}

async function excluirUsuario(id) {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  const params = [id];
  await db.execute(sql, params);
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
};
