import pool from '../config/database.js';

const Proposta = {
  async search(keyword) {
    const pattern = `%${keyword}%`;
    const { rows } = await pool.query(
      `SELECT * FROM propostas
       WHERE sigla_tipo ILIKE $1 OR ementa ILIKE $1
       ORDER BY data_apresentacao DESC`,
      [pattern]
    );
    return rows;
  },

  async create({ sigla_tipo, numero, ano, ementa, data_apresentacao, uri, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO propostas (sigla_tipo, numero, ano, ementa, data_apresentacao, uri, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [sigla_tipo, numero, ano, ementa, data_apresentacao, uri || null, user_id]
    );
    return rows[0];
  },

  async findAll(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM propostas WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },
};

export default Proposta;
