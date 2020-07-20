const db = require('./index');

// topic table에 사용할 query 분리
module.exports.getTopics = async options => {
	console.log('options: ', options);
	let query = 'SELECT * FROM topic';
	let value;
	if (options) {
		if (options.id) {
			// query += ' WHERE id = ?';
			// 특정 목록의 정보를 요청할 때, topic과 author 데이터가 필요함
			query +=
				' LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?';
			value = [options.id];
		}
	}
	return await db.query({ query, value });
};

module.exports.insert = async options => {
	console.log('options: ', options);
	let query = 'INSERT INTO topic';
	let value;
	if (options) {
		query += ' (title, description, created, author_id) VALUES(?, ?, NOW(), ?)';
		value = [options.title, options.description, options.author_id];
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
