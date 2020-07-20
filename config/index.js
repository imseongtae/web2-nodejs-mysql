// use dotenv
require('dotenv').config();

module.exports = {
	database: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
		connectionLimit: '10',
		debug: ['ComQueryPacket', 'RowDataPacket'],
	},
};

// connectionLimit을 통해 연결횟수를 제어
// module.exports = {
// 	database: {
// 		host: 'localhost',
// 		user: 'haemil',
// 		password: '12345',
// 		database: 'opentutorials',
// 		port: '3306',
// 		connectionLimit: '10',
// 		debug: ['ComQueryPacket', 'RowDataPacket'],
//		// debug: true,
// 	},
// };
