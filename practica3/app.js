const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const itemRoutes = require('./routes/itemRoutes');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', itemRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
