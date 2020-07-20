const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
// Server에 console log를 출력하는 morgan

const db = require('./../models');
const template = require('./template');

const topicTable = require('../models/topic');
const authorTable = require('../models/author');

const home = async response => {
	try {
		const topics = await topicTable.getTopics();
		if (topics.length == 0)
			throw { status: 404, erorrMessage: 'Topics not font' };
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
	} catch (error) {
		console.log(error);
	}
};

const page = async (request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;

	try {
		const topics = await topicTable.getTopics();
		if (topics.length === 0)
			throw { status: 404, erorrMessage: 'not found topics' };
		const [topic] = await topicTable.getTopics({ id: queryData.id });
		if (!topic) {
			throw { status: 404, erorrMessage: 'not found topic' };
		}
		const sanitizedTitle = sanitizeHtml(topic.title);
		const sanitizedDescription = sanitizeHtml(topic.description, {
			allowedTags: ['h1'],
		});
		const list = template.list(topics);
		const html = template.HTML(
			sanitizedTitle,
			list,
			`
				<h2>${sanitizedTitle}</h2>${sanitizedDescription}
				<p>by ${topic.name}</p>
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
	} catch (error) {
		console.log(error);
	}
};

const create = async response => {
	try {
		const topics = await topicTable.getTopics();
		if (topics === 0) throw { status: 404, erorrMessage: 'not found topics' };
		const authors = await authorTable.getAuthors();

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
	} catch (error) {
		console.log(error);
	}
};

const create_process = async (request, response) => {
	try {
		let body = '';
		request.on('data', function (data) {
			body += data;
		});
		request.on('end', async function () {
			const post = qs.parse(body);
			// sanitizeHtml는 악성 스크립트를 방어하기 위한 패키지 모듈임
			// sanitizeHtml 을 사용자로부터 값을 입력받는 부분에 적용
			const sanitizedTitle = sanitizeHtml(post.title);
			const sanitizedDescription = sanitizeHtml(post.description, {
				allowedTags: ['h1'],
			});

			const newTopic = {
				title: sanitizedTitle,
				description: sanitizedDescription,
				author_id: post.author,
			};
			// const result = await topicTable.create(connection, newTopic);
			const result = await topicTable.insert(newTopic);
			console.log('결과: ', result); // result 가 반환하는 insertId
			response.writeHead(302, { Location: `/?id=${result.insertId}` });
			response.end();
		});
	} catch (error) {
		console.log(error);
	}
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
					const title = sanitizeHtml(topic[0].title);
					const description = sanitizeHtml(topic[0].description);
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

const destroy = (request, response) => {
	let body = '';
	request.on('data', data => {
		body += data;
	});
	request.on('end', () => {
		const post = qs.parse(body);
		db.query('DELETE FROM topic WHERE id = ?', [post.id], (error, result) => {
			if (error) throw error;
			response.writeHead(302, { Location: '/' });
			console.log(result);
			// console.log(`delete ${result[0].title} item`);
			response.end();
		});
	});
};

module.exports = {
	home,
	page,
	create,
	create_process,
	update,
	update_process,
	destroy,
};
