const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear libro
router.post('/', (req, res) => {
  const { titulo, autor } = req.body;

  const sql = 'INSERT INTO libros (titulo, autor) VALUES (?, ?)';
  db.query(sql, [titulo, autor], (err, result) => {
    if (err) {
      console.error('Error al insertar libro en la base de datos:', err);
      return res.status(500).json({ error: 'Error al guardar libro' });
    }
    console.log('Libro guardado en BD con ID:', result.insertId);
    res.status(201).json({ message: 'Libro agregado correctamente' });
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM libros', (err, results) => {
    if (err) {
      console.error('Error al obtener libros:', err);
      return res.status(500).json({ error: 'Error al obtener libros' });
    }
    res.json(results);
  });
});

module.exports = router;
