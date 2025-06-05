const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM canciones WHERE estado = 1');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { titulo, artista, album, genero } = req.body;
  if (!titulo || !artista) return res.status(400).send('Título y artista son obligatorios');
  try {
    const [result] = await pool.query('INSERT INTO canciones SET ?', { titulo, artista, album, genero });
    res.json({ id: result.insertId, titulo, artista, album, genero });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { titulo, artista, album, genero } = req.body;
  try {
    await pool.query('UPDATE canciones SET ? WHERE id = ?', [{ titulo, artista, album, genero }, id]);
    res.send('Canción actualizada');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE canciones SET estado = 0 WHERE id = ?', [id]);
    res.send('Canción eliminada (lógicamente)');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};