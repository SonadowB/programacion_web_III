const db = require('../models/itemModel');
exports.list = (req, res) => {
  const editId = req.query.editId; // ID que se quiere editar, si hay

  if (editId) {
    // Si se pasa editId, buscamos ese registro para editar
    db.query('SELECT * FROM items', (err, items) => {
      if (err) throw err;
      db.query('SELECT * FROM items WHERE id = ?', [editId], (err2, result) => {
        if (err2) throw err2;
        res.render('index', {
          items,
          editItem: result[0] || null, // enviamos el item a editar
        });
      });
    });
  } else {
    // Si no hay editId, solo listamos los items y mostramos formulario vacío
    db.query('SELECT * FROM items', (err, items) => {
      if (err) throw err;
      res.render('index', { items, editItem: null });
    });
  }
};

exports.save = (req, res) => {
  const data = req.body;

  if (data.id) {
    // Si existe id, actualizamos
    const id = data.id;
    delete data.id; // borramos id del objeto para evitar actualizar la clave primaria
    db.query('UPDATE items SET ? WHERE id = ?', [data, id], (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  } else {
    // Si no hay id, creamos nuevo registro
    db.query('INSERT INTO items SET ?', data, (err) => {
      if (err) throw err;
      res.redirect('/');
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
};
