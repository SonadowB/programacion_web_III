const mysql = require('mysql2');

// Medir tiempo de conexión
console.time("Tiempo de conexión");

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nombres',
  waitForConnections: true,
});

console.timeEnd("Tiempo de conexión"); // Fin del tiempo de conexión
// Medir tiempo de consulta
console.time("Tiempo de consulta");

pool.query('SELECT * FROM estudiantes', (err, results, fields) => {
  if (err) throw err;

  console.timeEnd("Tiempo de consulta"); // Fin del tiempo de consulta
  console.log(results);

  // Cerrar el pool de conexiones
  console.time("Tiempo de cierre del pool");
  pool.end(err => {
    if (err) throw err;
    console.timeEnd("Tiempo de cierre del pool");
    console.log('Pool de conexiones cerrado.');
  });

});
