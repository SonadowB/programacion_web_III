const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nombres'
});
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

connection.query('SELECT * FROM estudiantes', (error, results) => {
    if (error) throw error;
    console.log(results);
});
connection.end(); 
