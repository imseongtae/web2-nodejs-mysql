const url = require('url');
const sanitizeHtml = require('sanitize-html');

const db = require('./../models');
const template = require('./template');

const home = response => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		const title = 'Welcome';
		const description = 'Hello Nodejs-MySQL';
		const list = template.list(topics);
		const html = template.HTML(
			title,
			list,
			`<h2>${title}</h2>${description}`,
			`<a href="/create">create</a>`,
		);
		response.writeHead(200);
		response.end(html);
	});
};

const page = (request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;

	db.query('SELECT * from topic', (error, topics) => {
		if (error) throw error;
		db.query(
			`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ?`,
			[queryData.id], // 공격의 의도가 있는 코드는 세탁해서 처리해줌
			(error2, topic) => {
				if (error2) throw error2;
				console.log(topic);
				// sanitizeHtml는 악성 스크립트를 방어하기 위한 패키지 모듈임
				const sanitizedTitle = sanitizeHtml(topic[0].title);
				const sanitizedDescription = sanitizeHtml(topic[0].description, {
					allowedTags: ['h1'],
				});
				const list = template.list(topics);
				const html = template.HTML(
					sanitizedTitle,
					list,
					`
            <h2>${sanitizedTitle}</h2>${sanitizedDescription}
            <p>by ${topic[0].name}</p>
          `,
					`
            <a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete"> 
            </form>
          `,
				);
				response.writeHead(200);
				response.end(html);
			},
		);
	});
};

module.exports = {
	home,
	page,
};
