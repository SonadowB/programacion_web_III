const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM genero WHERE estado = 1 ORDER BY id ASC');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener géneros:', err);
    res.status(500).json({ error: 'Error al obtener géneros' });
  }
});

router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }
  try {
    const [result] = await pool.query('INSERT INTO genero (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
    res.status(201).json({ id: result.insertId, nombre, descripcion, estado: 1 });
  } catch (err) {
    console.error('Error al crear género:', err);
    res.status(500).json({ error: 'Error al crear género' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio.' });
  }
  try {
    const [result] = await pool.query('UPDATE genero SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Género no encontrado.' });
    }
    res.json({ mensaje: 'Género actualizado correctamente.' });
  } catch (err) {
    console.error('Error al actualizar género:', err);
    res.status(500).json({ error: 'Error al actualizar género' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [canciones] = await pool.query('SELECT * FROM canciones WHERE genero = ? AND estado = 1', [id]);
    if (canciones.length > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar el género porque tiene canciones asociadas.' });
    }
    await pool.query('UPDATE genero SET estado = 0 WHERE id = ?', [id]);
    res.json({ mensaje: 'Género eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el género.' });
  }
});

router.delete('/:id/forzar', async (req, res) => {
  const { id } = req.params;

  try {
    const [generoRows] = await pool.query('SELECT * FROM genero WHERE id = ? AND estado = 1', [id]);
    if (generoRows.length === 0) {
      return res.status(404).json({ mensaje: 'Género no encontrado o ya eliminado.' });
    }

    await pool.query('UPDATE canciones SET estado = 0 WHERE genero = ?', [id]);
    await pool.query('UPDATE genero SET estado = 0 WHERE id = ?', [id]);

    res.json({ mensaje: 'Género y sus canciones asociadas fueron eliminados correctamente.' });
  } catch (err) {
    console.error('Error en eliminación forzada:', err);
    res.status(500).json({ mensaje: 'Error al eliminar el género y sus canciones.' });
  }
});

module.exports = router;