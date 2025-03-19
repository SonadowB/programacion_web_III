const mysql = require('mysql2/promise');
async function main() {
  try {
    // conecta la base de datos usando promise
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nombres'
    });
    console.log('Conectado a MySQL Database');
    // ejecuta una consulta usando una promesa
    const [rows, fields] = await connection.execute('SELECT * FROM estudiantes');
    console.log('Query Result:', rows);
    await connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}
main();
