const db = require('./index');

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
module.exports.getTopics = options => {
	console.log('options: ', options);
	let query = 'SELECT * FROM topic';
	let value;
	if (options) {
		if (options.id) {
			// 특정 목록의 정보를 요청할 때, topic과 author 데이터가 필요함
			// query += ' WHERE id = ?';
			query +=
				' LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?';
			value = [options.id];
		}
	}
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(reject);
			connection.query(query, value, (error, results) => {
				connection.release();
				if (error) reject(error);
				console.log('results: ', results);
				resolve(results);
			});
		});
	});
};
