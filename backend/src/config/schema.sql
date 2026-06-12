CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(30) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS propostas (
  id                SERIAL PRIMARY KEY,
  sigla_tipo        VARCHAR(10) NOT NULL,
  numero            INTEGER NOT NULL,
  ano               INTEGER NOT NULL,
  ementa            TEXT NOT NULL,
  data_apresentacao DATE NOT NULL,
  uri               VARCHAR(500),
  user_id           INTEGER NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_propostas_busca ON propostas(sigla_tipo, numero, ano);
CREATE INDEX IF NOT EXISTS idx_propostas_user_id ON propostas(user_id);
