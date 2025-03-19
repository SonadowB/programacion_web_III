const mysql = require('mysql2');
// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nombres',
  waitForConnections: true,
});
pool.query('SELECT * FROM estudiantes', (err, results, fields) => {
  if (err) throw err;
  console.log(results);
  pool.end(err => { // Cerrar
    if (err) throw err;
    console.log('Pool de conexiones cerrado.');
  });

});
