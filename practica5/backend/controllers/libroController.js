const Libro = require('../models/libroModel');

exports.getLibros = (req, res) => {
  Libro.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getLibro = (req, res) => {
  Libro.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

// Simulando creación de libro (puedes usar base de datos)
exports.crearLibro = (req, res) => {
  const nuevoLibro = req.body;

  // Aquí normalmente guardarías en la base de datos
  console.log('Libro recibido:', nuevoLibro);

  // Respuesta simulada
  res.status(201).json({
    mensaje: 'Libro creado exitosamente',
    libro: nuevoLibro
  });
};


exports.updateLibro = (req, res) => {
  Libro.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: req.params.id, ...req.body });
  });
};

exports.deleteLibro = (req, res) => {
  Libro.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ deleted: true });
  });
};
