const mysql = require('mysql2');

const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '12345',
	database: 'opentutorials',
});
db.connect();

module.exports = db;
