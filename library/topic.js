const url = require('url');
const qs = require('querystring');
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

const create = response => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if (error) throw error;
		db.query(`SELECT * FROM author`, (error2, authors) => {
			// sanitizeHtml는 악성 스크립트를 방어하기 위한 패키지 모듈임
			const title = 'Create';
			const list = template.list(topics);
			const html = template.HTML(
				title,
				list,
				`
          <h2>${title}</h2>
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${template.selectAuthor(authors)}							
            </p>
            <p>
              <input type="submit" value="create post">
            </p>
          </form>
        `,
				`<a href="/create">create</a>`,
			);
			response.writeHead(200);
			response.end(html);
		});
	});
};

const create_process = (request, response) => {
	let body = '';
	request.on('data', function (data) {
		body += data;
	});
	request.on('end', function () {
		const post = qs.parse(body);
		// sanitizeHtml는 악성 스크립트를 방어하기 위한 패키지 모듈임
		// 그러므로 sanitizeHtml 을 사용자로부터 값을 입력받는 부분에 걸어야 함!
		const sanitizedTitle = sanitizeHtml(post.title);
		const sanitizedDescription = sanitizeHtml(post.description, {
			allowedTags: ['h1'],
		});
		db.query(
			`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
			// [post.title, post.description, post.author],
			[sanitizedTitle, sanitizedDescription, post.author],
			(error, result) => {
				if (error) throw error;
				// 글 생성 후 해당 글로 이동!
				response.writeHead(302, { Location: `/?id=${result.insertId}` });
				response.end();
			},
		);
	});
};

const update = (request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;

	db.query('SELECT * FROM topic', (error, topics) => {
		if (error) throw error;
		db.query(
			'SELECT * FROM topic where id = ?',
			[queryData.id],
			(error2, topic) => {
				if (error2) throw error2;
				db.query(`SELECT * FROM author`, (error, authors) => {
					const title = topic[0].title;
					const description = topic[0].description;
					const list = template.list(topics);
					const html = template.HTML(
						title,
						list,
						`
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                ${template.selectAuthor(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
						`<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`,
					);
					response.writeHead(200);
					response.end(html);
				});
			},
		);
	});
};

const update_process = (request, response) => {
	let body = '';
	request.on('data', data => {
		body += data;
	});
	request.on('end', function () {
		const post = qs.parse(body);
		const sanitizedTitle = sanitizeHtml(post.title);
		const sanitizedDescription = sanitizeHtml(post.description, {
			allowedTags: ['h1'],
		});
		db.query(
			'UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
			// [post.title, post.description, post.author, post.id],
			[sanitizedTitle, sanitizedDescription, post.author, post.id],
			(error, result) => {
				response.writeHead(302, { Location: `/?id=${post.id}` });
				response.end();
			},
		);
	});
};

module.exports = {
	home,
	page,
	create,
	create_process,
	update,
	update_process,
};
