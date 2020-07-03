const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const template = require('./library/template');

const app = http.createServer((request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;
	const pathName = url.parse(_url, true).pathname;

	if (pathName === '/') {
		if (queryData.id === undefined) {
			fs.readdir('./data', (err, filelist) => {
				const title = 'Welcome';
				const description = 'Hello Nodejs';
				const list = template.list(filelist);
				const html = template.HTML(
					title,
					list,
					`<h2>${title}</h2>${description}`,
					`<a href="/create">create</a>`,
				);
				response.writeHead(200);
				response.end(html);
			});
		} else {
			fs.readdir('./data', (err, filelist) => {
				const filteredId = path.parse(queryData.id).base;
				fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
					const title = queryData.id;
					const sanitizedTitle = sanitizeHtml(title);
					const sanitizedDescription = sanitizeHtml(description, {
						allowedTags: ['h1'],
					});

					const list = template.list(filelist);
					const html = template.HTML(
						sanitizedTitle,
						list,
						`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
						`
              <a href="/create">create</a>
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete"> 
              </form>
            `,
					);
					response.writeHead(200);
					response.end(html);
				});
			});
		}
	} else if (pathName === '/create') {
		fs.readdir('./data', (err, filelist) => {
			const title = 'WEB - create';
			const list = template.list(filelist);
			const html = template.HTML(
				title,
				list,
				`
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
				'',
			);
			response.writeHead(200);
			response.end(html);
		});
	} else if (pathName === '/create_process') {
		let body = '';
		request.on('data', function (data) {
			body += data;
		});
		request.on('end', function () {
			const post = qs.parse(body);
			const title = post.title;
			const description = post.description;
			fs.writeFile(`data/${title}`, description, 'utf8', err => {
				response.writeHead(302, { Location: `/?id=${title}` });
				response.end();
			});
		});
	} else if (pathName === '/update') {
		fs.readdir('./data', (err, filelist) => {
			const filteredId = path.parse(queryData.id).base;
			fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
				const title = queryData.id;
				const list = template.list(filelist);
				const html = template.HTML(
					title,
					list,
					`
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
					`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
				);
				response.writeHead(200);
				response.end(html);
			});
		});
	} else if (pathName === '/update_process') {
		var body = '';
		request.on('data', data => {
			body += data;
		});
		request.on('end', function () {
			const post = qs.parse(body);
			const id = post.id;
			const title = post.title;
			const description = post.description;
			fs.rename(`data/${id}`, `data/${title}`, function (error) {
				fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
					response.writeHead(302, { Location: `/?id=${title}` });
					response.end();
				});
			});
		});
	} else if (pathName === '/delete_process') {
		let body = '';
		request.on('data', data => {
			body += data;
		});
		request.on('end', () => {
			const post = qs.parse(body);
			const id = post.id;
			const filteredId = path.parse(id).base;
			fs.unlink(`data/${filteredId}`, err => {
				response.writeHead(302, { Location: `/` });
				response.end();
			});
		});
	} else {
		response.writeHead(404);
		response.end('Not found');
	}
});

app.listen(3000, () => {
	console.log('application 동작 중');
});
