const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const useragent = require('express-useragent');
const pool = require('./config/db');

const app = express();

const { isAuthenticated } = require('./middleware/auth');

const cancionesRoutes = require('./routes/cancionesRoutes');
const authRoutes      = require('./routes/authRoutes');
const generoRoutes    = require('./routes/genero');
const favoritosRoutes = require('./routes/favoritosRoutes'); 

// En tu backend Express
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(express.json());
app.use(useragent.express());
const sessionStore = new MySQLStore({}, pool); 

app.use(session({
  key: 'session_id',
  secret: 'tu_secreto',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 2, 
  }
}));

app.use('/api/genero',   generoRoutes);
app.use('/api/canciones', cancionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', isAuthenticated, favoritosRoutes);

// Iniciar servidor
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
const pdfRoutes = require('./routes/pdf');
app.use('/api/pdf', pdfRoutes);
