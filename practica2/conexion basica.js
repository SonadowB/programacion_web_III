const mysql = require('mysql2');
console.time("Tiempo de conexión");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nombres'
});
connection.connect((err) => {
    console.timeEnd("Tiempo de conexión"); // Fin de medición de conexión
    if (err) {
        console.error('Error de conexión:', err);
        return;
    }
    // Medir tiempo de consulta
    console.time("Tiempo de consulta");
    connection.query('SELECT * FROM estudiantes', (error, results) => {
        console.timeEnd("Tiempo de consulta"); // Fin de medición de consulta
        if (error) throw error;
        console.log(results);
        // Medir tiempo de cierre de conexión
        console.time("Tiempo de cierre de conexión");
        connection.end((err) => {
            console.timeEnd("Tiempo de cierre de conexión"); // Fin de medición de cierre
            if (err) throw err;
            console.log('Conexión cerrada.');
        });
    });
});
