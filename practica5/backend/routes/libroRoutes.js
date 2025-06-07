const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que la ruta esté correcta

// Crear libro
router.post('/', (req, res) => {
  const { titulo, autor } = req.body;
  console.log('Libro recibido:', req.body);

  if (!titulo || !autor) {
    return res.status(400).json({ mensaje: 'Faltan campos' });
  }

  const sql = 'INSERT INTO libros (titulo, autor) VALUES (?, ?)';
  db.query(sql, [titulo, autor], (err, resultado) => {
    if (err) {
      console.error('Error al insertar libro:', err);
      return res.status(500).json({ mensaje: 'Error al guardar libro' });
    }
    res.status(201).json({ mensaje: 'Libro guardado correctamente' });
  });
});

// Obtener libros
router.get('/', (req, res) => {
  db.query('SELECT * FROM libros', (err, resultados) => {
    if (err) {
      console.error('Error al obtener libros:', err);
      return res.status(500).json({ mensaje: 'Error al obtener libros' });
    }
    res.json(resultados);
  });
});

// DELETE libro
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM libros WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

// PUT editar libro
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor } = req.body;
  const sql = 'UPDATE libros SET titulo = ?, autor = ? WHERE id = ?';
  db.query(sql, [titulo, autor, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});
// routes/libroRoutes.js (simplificado)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor } = req.body;

  const sql = 'UPDATE libros SET titulo = ?, autor = ? WHERE id = ?';
  db.query(sql, [titulo, autor, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al actualizar libro');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Libro no encontrado');
    }
    res.status(200).send('Libro actualizado');
  });
});


module.exports = router;

