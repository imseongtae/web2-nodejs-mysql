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
		}
	}
});

app.listen(3000, () => {
	console.log('application 동작 중');
});
