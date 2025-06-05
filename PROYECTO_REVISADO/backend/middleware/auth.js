// backend/middleware/auth.js
const session = require('express-session');
const useragent = require('express-useragent');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('../config/db');

function configurarSesion(app) {
  const sessionStore = new MySQLStore({}, pool);

  app.use(
    session({
      key: 'session_id',
      secret: 'secreto_super_seguro',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 1000 * 60 * 60 * 2, 
      },
    })
  );

  app.use(useragent.express());
}

function isAuthenticated(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.id) {
    return next();
  } else {
    return res.status(401).json({ error: 'No autorizado. Debes iniciar sesión.' });
  }
}


module.exports = {
  configurarSesion,
  isAuthenticated,
};
