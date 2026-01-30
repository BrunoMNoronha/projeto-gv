/*
  Aplica scripts SQL do diretório docs/sql na base MySQL definida no .env
  Uso: npm run db:migrate
*/

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'sgv',
  } = process.env;

  const dbNameSafe = String(DB_NAME).replace(/[^a-zA-Z0-9_]/g, '') || 'sgv';

  let conn;
  try {
    console.log('[db:migrate] Conectando ao MySQL...');
    conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    });

    console.log(`[db:migrate] Garantindo base \`${dbNameSafe}\`...`);
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbNameSafe}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await conn.query(`USE \`${dbNameSafe}\`;`);

    const sqlDir = path.join(__dirname, '..', 'docs', 'sql');
    const filesInOrder = [
      'veiculos.sql',
      'veiculo_fotos.sql',
      'veiculo_km_historico.sql',
      'usuarios.sql',
    ];

    for (const file of filesInOrder) {
      const full = path.join(sqlDir, file);
      if (!fs.existsSync(full)) {
        console.log(`[db:migrate] (pulado) ${file} não encontrado.`);
        continue;
      }
      const sql = fs.readFileSync(full, 'utf8');
      if (!sql.trim()) {
        console.log(`[db:migrate] (pulado) ${file} vazio.`);
        continue;
      }
      console.log(`[db:migrate] Executando ${file}...`);
      await conn.query(sql);
      console.log(`[db:migrate] OK: ${file}`);
    }

    console.log('[db:migrate] Finalizado com sucesso.');
    process.exit(0);
  } catch (err) {
    console.error('[db:migrate] Falhou:', err && err.message ? err.message : err);
    process.exit(1);
  } finally {
    if (conn) {
      try { await conn.end(); } catch (_) {}
    }
  }
})();
