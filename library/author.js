const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const template = require('./template');
// 테이블과 상호작용하기 위한 module
const topicTable = require('../models/topic');
const authorTable = require('../models/author');

// author 목록을 보여주는 페이지
// author 목록을 표현하기 위해 topic와 author 정보가 필요함
const home = async response => {
	try {
		const topics = await topicTable.getTopics();
		const authors = await authorTable.getAuthors();

		const title = 'Welcome';
		const list = template.list(topics);
		const html = template.HTML(
			title,
			list,
			template.renderAuthorsTable(authors),
			``,
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
		const authors = await authorTable.getAuthors();

		const title = 'Create Author';
		const list = template.list(topics);
		const html = template.HTML(
			title,
			list,
			`
				${template.renderAuthorsTable(authors)}
				<form action="/author/create_process" method="post">
					<fieldset style="width: 400px;">
						<legend>Input fieldset</legend>
						<div>
							<input type="text" name="name" placeholder="author name" style="font-size:14px; margin-bottom: 10px;">
						</div>
						<div>
							<textarea name="description" placeholder="profile description"></textarea>
						</div>
					</fieldset>
					<button type="submit">Submit</button>
				</form>
			`,
			``,
		);
		response.writeHead(200);
		response.end(html);
	} catch (error) {
		console.log(error);
	}
};

const create_process = (request, response) => {
	try {
		let body = '';
		request.on('data', function (data) {
			body += data;
		});
		request.on('end', async () => {
			const post = qs.parse(body);
			// sanitizeHtml는 악성 스크립트를 방어하기 위한 패키지 모듈임
			const sanitizedName = sanitizeHtml(post.name);
			const sanitizedDescription = sanitizeHtml(post.description);

			const newAuthor = {
				name: sanitizedName,
				profile: sanitizedDescription,
			};
			await authorTable.insert(newAuthor);
			response.writeHead(302, { Location: `/author` });
			response.end();
		});
	} catch (error) {
		console.log(error);
	}
};

const update = async (request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;

	try {
		const topics = await topicTable.getTopics();
		const authors = await authorTable.getAuthors();
		const author = await authorTable.getAuthors({ id: queryData.id });

		const title = 'Update Author';
		const list = template.list(topics);
		const html = template.HTML(
			title,
			list,
			`
				${template.renderAuthorsTable(authors)}
				<form action="/author/update_process" method="post">
					<fieldset style="width: 400px;">
						<legend>Update fieldset</legend>
						<input type="hidden" name="id" value="${author[0].id}" />
						<div>
							<input type="text" name="name" value="${sanitizeHtml(
								author[0].name,
							)}" style="font-size:14px; margin-bottom: 10px;">
						</div>
						<div>
							<textarea name="description" placeholder="profile description">${sanitizeHtml(
								author[0].profile,
							)}</textarea>
						</div>
						<button type="submit">Update</button>
					</fieldset>
				</form>
			`,
			``,
		);
		response.writeHead(200);
		response.end(html);
	} catch (error) {
		console.log(error);
	}
};

const update_process = (request, response) => {
	let body = '';
	request.on('data', data => {
		body += data;
	});
	request.on('end', async () => {
		try {
			const post = qs.parse(body);
			const sanitizedTitle = sanitizeHtml(post.name);
			const sanitizedDescription = sanitizeHtml(post.description);

			const updatedAuthor = {
				name: sanitizedTitle,
				profile: sanitizedDescription,
				id: post.id,
			};
			await authorTable.update(updatedAuthor);
			response.writeHead(302, { Location: `/author` });
			response.end();
		} catch (error) {
			console.log(error);
		}
	});
};

const destroy = (request, response) => {
	try {
		let body = '';
		request.on('data', data => {
			body += data;
		});
		request.on('end', async () => {
			const post = qs.parse(body);
			console.log('쿼리 스트링 값: ', post.id);
			await authorTable.destroy({ id: post.id });
			// 저자가 삭제되면 저자가 생성한 글 또한 삭제되도록 기능 구현
			await topicTable.destroy({ author_id: post.id });
			response.writeHead(302, { Location: '/author' });
			response.end();
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	home,
	create,
	create_process,
	update,
	update_process,
	destroy,
};
