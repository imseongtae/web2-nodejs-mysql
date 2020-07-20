const db = require('./index');

module.exports.getAuthors = async options => {
	console.log('options: ', options);
	let query = 'SELECT * FROM author';
	let value;
	if (options) {
		if (options.id) {
			// 특정 정보를 요청할 때
			query += ' WHERE id = ?';
			value = [options.id];
		}
	}
	return await db.query({ query, value });
};
