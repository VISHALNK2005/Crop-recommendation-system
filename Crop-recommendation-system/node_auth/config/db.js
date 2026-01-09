const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',        // Change if using a remote database
    user: 'root',             // Your MySQL username
    password: 'password', // Your MySQL password
    database: 'login_app'     // Must match the database name in schema.sql
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ MySQL Connected...');
});

module.exports = db;  // Export the database connection
