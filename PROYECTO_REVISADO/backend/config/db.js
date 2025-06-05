// backend/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'musica',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

;(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conexión a MySQL (pool) exitosa');
    conn.release();
  } catch (err) {
    console.error('❌ Error al conectar al pool de MySQL:', err.message);
  }
})();

module.exports = pool;