# WEB2 Nodejs-MySQL

생활코딩 WEB2 Nodejs를 학습한 내용을 정리합니다.  
WEB2 Nodejs를 학습한 내용을 기반으로 WEB2 Nodejs-MySQL 을 진행합니다.


## Table of Contents
- CRUD Application 
- sanitize-html을 사용하여 Escaping 적용
- Database와 상호작용하는 query 구문을 module로 분리
- Database를 실행하는 구문을 module로 분리

## Escaping 적용

공격의 의도를 가진 자바스크립트 코드를 입력해서 이 코드를 웹 브라우저로 실행할 때 공격목적을 달성하는 공격 기법을 Cross site scripting (XSS)이라고 하며, 이를 막는 방법을 코드에 적용하기 위해 `sanitize-html`을 사용  
- Express에서는 helmet 라이브러리를 사용함으로써 간단하게 막을 수 있다고 한다. 

`sanitize-html`은 입력과 출력에 관계된 모든 데이터에 적용해야 한다.
사용자가 입력하여 들어오는 정보, 사용자에게 출력되는 정보는 모두 오염되거나 위험한 정보라고 생각하고 살균해야 한다.

Table에서 자동으로 생성되는 정보인.. id는 `sanitize`처리하지 않더라도 사용자가 입력한 정보는 모두 `sanitize`처리하는 것을 권장한다.

저장된 정보가 바깥으로 나올 때 사용자를 공격하려는 의도를 담을 수 있는 스크립트 태그나 아이프레임 같은 태그는 sanitize처리를 통해 필터링할 수 있다.

## 모듈을 분리하기 위해 참조한 코드
- 참조: npm pooling connections
- [npm pooling connections 링크](https://www.npmjs.com/package/mysql#pooling-connections)
- **When done with the connection, release it.**
- `connection`이 완료된 후에는 꼭 release를 처리한다.

```js

module.exports.query = options => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(reject);
			connection.query(options.query, options.value, (error, results) => {
        // When done with the connection, release it.
				connection.release();
				if (error) reject(error);
				console.log('results: ', results);
				resolve(results);
			});
		});
	});
};
```

```js
// rollback을 사용하려면 beginTransaction을 사용해야 함
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


```