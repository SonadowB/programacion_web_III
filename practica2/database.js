const mysql = require('mysql2/promise');

async function main() {
  try {
    // Medir tiempo de conexión
    console.time("Tiempo de conexión");
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nombres'
    });
    console.timeEnd("Tiempo de conexión"); // Fin de medición de conexión
    // Medir tiempo de consulta
    console.time("Tiempo de consulta");
    // Ejecutar consulta
    const [rows, fields] = await connection.execute('SELECT * FROM estudiantes');
    console.timeEnd("Tiempo de consulta"); // Fin de medición de consulta
    console.log('Query Result:', rows);
    console.time("Tiempo de cierre de conexión");
    await connection.end();
    console.timeEnd("Tiempo de cierre de conexión"); // Fin de medición de cierre
    console.log('Conexión cerrada.');

  } catch (err) {
    console.error('Error:', err);
  }
}
main();

