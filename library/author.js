const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const db = require('./../models');
const template = require('./template');

// home 함수의 파라미터로 response 하나만 넘어오므로 에러가 발생했다.
// home 함수를 호출하는 곳에서 home(request, response) 처럼 두 개의 arguments를 전달하여 에러
const home = response => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		db.query('SELECT * FROM author', (error2, authors) => {
			const title = 'Welcome';
			const description = 'Hello Nodejs-MySQL';
			const list = template.list(topics);
			const html = template.HTML(
				title,
				list,
				template.renderAuthorsTable(authors),
				``,
			);
			response.writeHead(200);
			response.end(html);
		});
	});
};

const create = response => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
		if (error) throw error;
		db.query(`SELECT * FROM author`, (error2, authors) => {
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
		const sanitizedName = sanitizeHtml(post.name);
		const sanitizedDescription = sanitizeHtml(post.description);
		db.query(
			`INSERT INTO author (name, profile) VALUES(?, ?)`,
			[sanitizedName, sanitizedDescription],
			(error, result) => {
				if (error) throw error;
				// 저자 생성 후 저자 목록으로 이동!
				response.writeHead(302, { Location: `/author` });
				response.end();
			},
		);
	});
};

const update = (request, response) => {
	db.query('SELECT * FROM topic', (topics_error, topics) => {
		if (topics_error) throw topics_error;
		db.query(`SELECT * FROM author`, (authors_error, authors) => {
			if (authors_error) throw authors_error;
			// URL id를 얻어오기 위해선..!
			const _url = request.url;
			const queryData = url.parse(_url, true).query;
			db.query(
				'SELECT * FROM author WHERE id = ?',
				[queryData.id],
				(author_error, author) => {
					if (author_error) throw author_error;
					// console.log(author); // 서버로부터 배열로 감싸진 데이터가 응답됨
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
                  <input type="text" name="name" value="${
										author[0].name
									}" style="font-size:14px; margin-bottom: 10px;">
                </div>
                <div>
                  <textarea name="description" placeholder="profile description">${
										author[0].profile
									}</textarea>
                </div>
                <button type="submit">Update</button>
              </fieldset>
            </form>
            `,
						``,
					);
					response.writeHead(200);
					response.end(html);
				},
			);
		});
	});
};

const update_process = (request, response) => {
	let body = '';
	request.on('data', data => {
		body += data;
	});
	request.on('end', function () {
		const post = qs.parse(body);
		const sanitizedTitle = sanitizeHtml(post.name);
		const sanitizedDescription = sanitizeHtml(post.description);
		db.query(
			'UPDATE author SET name=?, profile=? WHERE id=?',
			// [post.title, post.description, post.author, post.id],
			[sanitizedTitle, sanitizedDescription, post.id],
			(error, result) => {
				response.writeHead(302, { Location: `/author` });
				response.end();
			},
		);
	});
};

// 왜 요청을 보내도 응답이 없어서 affectedRows 값이 0일까?..!
const destroy = (request, response) => {
	let body = '';
	request.on('data', data => {
		body += data;
	});
	request.on('end', () => {
		const post = qs.parse(body);
		console.log('쿼리 스트링 값: ', post.id);
		db.query('DELETE FROM author WHERE id = ?', [post.id], (error, result) => {
			if (error) throw error;
			response.writeHead(302, { Location: '/author' });
			console.log(result);
			response.end();
		});
	});
};

module.exports = {
	home,
	create,
	create_process,
	update,
	update_process,
	destroy,
};
