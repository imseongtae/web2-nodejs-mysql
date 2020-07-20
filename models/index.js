const config = require('./../config');
const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: config.database.connectionLimit,
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database,
});

// 참조: npm pooling connections
// https://www.npmjs.com/package/mysql#pooling-connections
module.exports.query = options => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(reject);
			connection.query(options.query, options.value, (error, results) => {
				connection.release();
				if (error) reject(error);
				console.log('results: ', results);
				resolve(results);
			});
		});
	});
};

// rollback을 사용하려면 beginTransaction을 사용해야 함
// 이번 branch에서는 rollback이 없음
module.exports.beginTransaction = () => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (error, connection) {
			if (error) reject(error); // not connected!
			// Use the connection
			connection.beginTransaction(err => {
				if (err) reject(err);
				resolve(connection);
			});
		});
	});
};
