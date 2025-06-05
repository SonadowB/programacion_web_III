const express = require('express');
const bcrypt  = require('bcrypt');
const pool    = require('../config/db');
const router  = express.Router();

router.get('/captcha', (req, res) => {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const suma = a + b;
  req.session.captcha = suma;
  res.json({ pregunta: `${a} + ${b} = ?` });
});

router.post('/register', async (req, res) => {
  const { nombre, email, password, captchaRespuesta } = req.body;
  if (!nombre || !email || !password || captchaRespuesta == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }
  if (Number(captchaRespuesta) !== req.session.captcha) {
    return res.status(400).json({ error: 'Respuesta de captcha incorrecta.' });
  }
  delete req.session.captcha;

  const fuerza = evaluarFuerza(password);
  if (fuerza === 'Débil') {
    return res.status(400).json({ error: 'La contraseña es demasiado débil.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, creado_en) VALUES (?, ?, ?, NOW())',
      [nombre, email, hash]
    );
    res.status(200).json({ mensaje: '✅ Cuenta creada con éxito.', fuerza });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, captchaRespuesta } = req.body;

  if (!email || !password || captchaRespuesta == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  const esperado = req.session.captcha;
  if (esperado == null) {
    return res.status(400).json({ error: 'Captcha inválido o expirado.' });
  }
  if (Number(captchaRespuesta) !== esperado) {
    return res.status(400).json({ error: 'Respuesta de captcha incorrecta.' });
  }
  delete req.session.captcha;

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

   req.session.usuario = { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };

const userAgent = req.headers['user-agent']?.slice(0, 200) || 'desconocido'; 
const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

try {
  await pool.query(
    "INSERT INTO logs (usuario_id, ip, navegador, evento) VALUES (?, ?, ?, 'ingreso')",
    [usuario.id, ip, userAgent]
  );
} catch (logError) {
  console.warn('⚠️ Error al registrar log:', logError.message);
}


    return res.json({
      mensaje: 'Login correcto',
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno al iniciar sesión.' });
  }
});

router.get('/usuario', (req, res) => {
  if (req.session.usuario) {
    res.json({ usuario: req.session.usuario });
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const id = req.session.usuario?.id;
    if (id) {
      const userAgent = req.headers['user-agent'] || 'desconocido';
      await pool.query(
        "INSERT INTO logs (usuario_id, ip, navegador, evento) VALUES (?, ?, ?, 'salida')",
        [id, req.ip, userAgent]
      );
    }
    req.session.destroy();
    res.json({ mensaje: 'Sesión cerrada' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno al cerrar sesión.' });
  }
});

function evaluarFuerza(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/\W/.test(pass)) score++;
  return ['Débil', 'Intermedia', 'Fuerte'][Math.min(score - 1, 2)] || 'Débil';
}

module.exports = router;
