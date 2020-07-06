const http = require('http');
const url = require('url');
const qs = require('querystring');

const db = require('./models');
const template = require('./library/template');
const topic = require('./library/topic');

const app = http.createServer((request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;
	const pathName = url.parse(_url, true).pathname;

	if (pathName === '/') {
		if (queryData.id === undefined) {
			topic.home(response);
		} else {
			topic.page(request, response);
		}
	} else if (pathName === '/create') {
		topic.create(response);
	} else if (pathName === '/create_process') {
		topic.create_process(request, response);
	} else if (pathName === '/update') {
		topic.update(request, response);
	} else if (pathName === '/update_process') {
		topic.update_process(request, response);
	} else if (pathName === '/delete_process') {
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
	} else {
		response.writeHead(404);
		response.end('Not found');
	}
});

app.listen(3000, () => {
	console.log('application 동작 중');
});
