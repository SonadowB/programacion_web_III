const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController');

router.get('/', controller.list);
router.post('/save', controller.save);
router.get('/delete/:id', controller.delete);

module.exports = router;
