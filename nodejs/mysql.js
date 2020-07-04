// const mysql = require('mysql'); // mysql module 을 변수에 할당
// Client does not support authentication protocol requested by server; consider upgrading MySQL client
// https://www.inflearn.com/questions/3637 마지막 응답을 보고 해결!
const mysql = require('mysql2'); // mysql2 를 사용하니 에러가 해결됐다.

// mysql 객체에 소속되어 있는 createConnection 메소드의 인자로..!
// 객체를 전달
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '12345',
	database: 'opentutorials',
});

// 접속을 위해 connect() 메소드를 호출
connection.connect();

// 첫 번째 인자로 DB서버에 SQL을 전달하고,
// 첫 번째 작업이 완료되면 두 번째 인자의 콜백함수 호출됨
connection.query('SELECT * FROM topic', function (error, results, fields) {
	// if (error) throw error;
	if (error) console.log('error', error);
	// console.log('The solution is: ', results[0].solution);
	console.log(results);
});

connection.end();

// 접속하고, 질의하고, 접속을 끊는 일련의 과정..!을 MySQL서버에 접속하는 모든 클라이언트는 다 하게 된다.
// Nodejs는 이 과정에서 클라이언트이다.
