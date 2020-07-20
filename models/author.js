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

module.exports.insert = async options => {
	console.log('options: ', options);
	let query = 'INSERT INTO author';
	let value;
	if (options) {
		query += ' (name, profile) VALUES(?, ?)';
		value = [options.name, options.profile];
	}
	return await db.query({ query, value });
};

// Transactions이 필요한 코드
// module.exports.create = async (connection, options) => {
// 	console.log('options: ', options);
// 	return await db.query({
// 		connection,
// 		query: 'INSERT INTO topic SET ?',
// 		value: options,
// 	});
// };

module.exports.update = async options => {
	console.log('options: ', options);
	let query = 'UPDATE author SET name=?, profile=? WHERE id=?';
	let value;
	if (options.name && options.profile) {
		value = [options.name, options.profile, options.id];
	}
	return await db.query({ query, value });
};

module.exports.destroy = async options => {
	console.log('options: ', options);
	let query = 'DELETE FROM author WHERE id = ?';
	let value;
	if (options) {
		if (options.id) {
			value = [options.id];
		}
	}
	return await db.query({ query, value });
};
