const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || './academia.db';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
  console.log(`Conectado ao banco de dados SQLite em: ${dbPath}`);
});

// O restante do seu código de inicialização do banco de dados permanece o mesmo
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      nascimento TEXT,
      senha TEXT NOT NULL DEFAULT '',
      peso REAL,
      nivel TEXT,
      altura REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS planos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      duracao INTEGER NOT NULL,
      valor REAL NOT NULL,
      descricao TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS matriculas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER NOT NULL,
      plano_id INTEGER NOT NULL,
      inicio TEXT NOT NULL,
      termino TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
      FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS treinos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricula_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      descricao TEXT,
      exercicios TEXT,
      inicio TEXT NOT NULL,
      termino TEXT NOT NULL,
      FOREIGN KEY (matricula_id) REFERENCES matriculas(id) ON DELETE CASCADE
    )
  `);

  db.all('PRAGMA table_info(alunos)', [], (err, rows) => {
    if (err) {
      console.error('Erro lendo estrutura da tabela alunos:', err.message);
      return;
    }
    const hasSenha = rows.some((column) => column.name === 'senha');
    if (!hasSenha) {
      db.run("ALTER TABLE alunos ADD COLUMN senha TEXT NOT NULL DEFAULT ''");
    }
    const hasPeso = rows.some((column) => column.name === 'peso');
    if (!hasPeso) {
      db.run('ALTER TABLE alunos ADD COLUMN peso REAL');
    }
    const hasNivel = rows.some((column) => column.name === 'nivel');
    if (!hasNivel) {
      db.run("ALTER TABLE alunos ADD COLUMN nivel TEXT");
    }
    const hasAltura = rows.some((column) => column.name === 'altura');
    if (!hasAltura) {
      db.run('ALTER TABLE alunos ADD COLUMN altura REAL');
    }
  });
});

module.exports = db;
