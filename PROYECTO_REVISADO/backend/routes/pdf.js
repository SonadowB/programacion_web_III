const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const db = require('../config/db');

router.get('/canciones', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT titulo, artista, genero FROM canciones WHERE estado = 1');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Lista de Canciones', { align: 'center' });
    doc.moveDown();

    rows.forEach((c, i) => {
      doc.fontSize(12).text(`${i + 1}. ${c.titulo} - ${c.artista} (${c.genero})`);
    });

    doc.end();
  } catch (err) {
    console.error('Error generando PDF:', err);
    res.status(500).send('Error generando PDF');
  }
});

module.exports = router;
