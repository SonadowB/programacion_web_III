// backend/routes/favoritosRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favoritosController');


router.get('/', ctrl.getByUsuario);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.delete);

module.exports = router;
