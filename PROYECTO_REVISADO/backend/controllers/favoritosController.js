const pool = require('../config/db');

/**
 * GET /api/favoritos
 * Devuelve la lista de canciones favoritas del usuario logueado.
 */
exports.getByUsuario = async (req, res) => {
  if (!req.session.usuario || !req.session.usuario.id) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }

  try {
    const usuarioId = req.session.usuario.id;
    const [rows] = await pool.query(
      `SELECT f.id AS favorito_id, c.id AS cancion_id, c.titulo, c.artista, c.album, c.genero
       FROM favoritos f
       JOIN canciones c ON f.cancion_id = c.id
       WHERE f.usuario_id = ? AND c.estado = 1`,
      [usuarioId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/favoritos
 * Agrega una canción a favoritos para el usuario logueado. 
 */
exports.create = async (req, res) => {
  if (!req.session.usuario || !req.session.usuario.id) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }

  const usuarioId = req.session.usuario.id;
  const { cancion_id } = req.body;

  if (!cancion_id) {
    return res.status(400).send('cancion_id es obligatorio');
  }

  try {
    await pool.query(
      `INSERT INTO favoritos (usuario_id, cancion_id) VALUES (?, ?)`,
      [usuarioId, cancion_id]
    );
    res.status(201).json({ message: 'Agregado a favoritos', cancion_id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send('Ya está en favoritos');
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/favoritos/:id
 * Elimina de favoritos un registro (por su ID en la tabla favoritos).
 */
exports.delete = async (req, res) => {
  if (!req.session.usuario || !req.session.usuario.id) {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }

  const usuarioId = req.session.usuario.id;
  const favoritoId = req.params.id;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM favoritos WHERE id = ? AND usuario_id = ?',
      [favoritoId, usuarioId]
    );
    if (rows.length === 0) {
      return res.status(404).send('Favorito no encontrado');
    }

    await pool.query('DELETE FROM favoritos WHERE id = ?', [favoritoId]);
    res.send('Eliminado de favoritos');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
